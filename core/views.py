from rest_framework import status, generics
import logging
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from django.contrib.auth import get_user_model, authenticate, login
from django.contrib.auth.models import AnonymousUser
from .serializers import (
    UserRegistrationSerializer,
    UserSerializer,
    AdminUserCreationSerializer,
    LoginSerializer,
    VehicleSerializer,
    KYCSerializer,
    DriverApplicationSerializer,
    NotificationSerializer,
)
from .models import Vehicle, KYC, Payment, DriverApplication, Notification
from django.db import IntegrityError, DataError
from decimal import InvalidOperation

User = get_user_model()
logger = logging.getLogger('django')

class SignUpView(generics.CreateAPIView):
    """Public registration endpoint - only allows OGA and DRIVER roles"""
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return Response({
                'message': 'User created successfully',
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AdminUserCreationView(generics.CreateAPIView):
    """Admin-only endpoint for creating admin users"""
    queryset = User.objects.all()
    serializer_class = AdminUserCreationSerializer
    permission_classes = [IsAdminUser]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user_data = UserSerializer(user).data
            return Response({
                'message': 'Admin user created successfully',
                'user': user_data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Login endpoint that returns user data and role for frontend routing"""
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        
        # Find user by email (since we use email for login)
        try:
            user = User.objects.get(email=email)
            # Authenticate using username and password
            authenticated_user = authenticate(request, username=user.username, password=password)
            
            if authenticated_user:
                login(request, authenticated_user)
                user_data = UserSerializer(authenticated_user).data
                return Response({
                    'message': 'Login successful',
                    'user': user_data,
                    'role': authenticated_user.role
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except User.DoesNotExist:
            return Response({
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def logout_view(request):
    """Logout endpoint"""
    from django.contrib.auth import logout
    logout(request)
    return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({'status': 'API is running'}, status=status.HTTP_200_OK)


class VehicleCreateView(generics.ListCreateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        owner_id = self.request.query_params.get('owner')
        if owner_id:
            queryset = queryset.filter(owner_id=owner_id)
        return queryset

class VehicleDetailView(generics.RetrieveUpdateAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [AllowAny]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        # Block edits if vehicle already assigned to a driver
        if instance.driver is not None:
            return Response({'error': 'Vehicle is assigned and cannot be edited.'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


def compute_driver_credit_score(applicant_id, vehicle):
    """Compute a simple credit risk score for a driver.

    Heuristic:
    - Base score: 500
    - KYC status: APPROVED +200, UNDER_REVIEW +50, REJECTED -200, PENDING -50
    - Payment history: +15 per successful payment (cap +150), -25 per failed payment (cap -250)
    - Weekly burden: small penalty for high weekly returns
    - Clamp to [300, 850]
    """
    score = 500

    # KYC adjustment
    kyc = KYC.objects.filter(user_id=applicant_id).first()
    if kyc:
        if kyc.status == KYC.VerificationStatus.APPROVED:
            score += 200
        elif kyc.status == KYC.VerificationStatus.UNDER_REVIEW:
            score += 50
        elif kyc.status == KYC.VerificationStatus.REJECTED:
            score -= 200
        elif kyc.status == KYC.VerificationStatus.PENDING:
            score -= 50

    # Payment history adjustments
    successful_count = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.SUCCESSFUL).count()
    failed_count = Payment.objects.filter(driver_id=applicant_id, status=Payment.PaymentStatus.FAILED).count()
    score += min(successful_count * 15, 150)
    score -= min(failed_count * 25, 250)

    # Weekly burden adjustment (vehicle-specific)
    try:
        weekly_returns = float(vehicle.weekly_returns or 0)
    except Exception:
        weekly_returns = 0.0
    if weekly_returns >= 40000:
        score -= 50
    elif weekly_returns >= 30000:
        score -= 25

    # Clamp the score to a reasonable range
    score = max(300, min(850, int(round(score))))
    return score

@api_view(['GET'])
@permission_classes([AllowAny])
def recent_activity(request):
    """Return recent activity for a driver including KYC, applications, and payments."""
    driver_id = request.query_params.get('driver')
    if not driver_id:
        return Response({'error': 'Missing driver id'}, status=status.HTTP_400_BAD_REQUEST)

    # Build activity list
    activities = []
    try:
        # KYC activity
        kyc = KYC.objects.filter(user_id=driver_id).first()
        if kyc:
            activities.append({
                'type': 'KYC',
                'title': 'KYC Submitted',
                'description': f'Status: {kyc.status.title()}',
                'timestamp': kyc.submitted_at.isoformat() if kyc.submitted_at else None,
            })

        # Driver applications
        apps = DriverApplication.objects.filter(applicant_id=driver_id).order_by('-application_date')[:5]
        for app in apps:
            activities.append({
                'type': 'APPLICATION',
                'title': 'Driver Application',
                'description': f'{app.vehicle.registration_number} • Status: {app.status.title()}',
                'timestamp': app.application_date.isoformat() if app.application_date else None,
            })

        # Payments
        payments = Payment.objects.filter(driver_id=driver_id).order_by('-payment_date')[:5]
        for p in payments:
            activities.append({
                'type': 'PAYMENT',
                'title': 'Payment Made' if p.status == Payment.PaymentStatus.SUCCESSFUL else 'Payment Failed',
                'description': f'₦{p.amount} • {p.vehicle.registration_number}',
                'timestamp': p.payment_date.isoformat() if p.payment_date else None,
            })

        # Sort by timestamp desc and limit
        activities = [a for a in activities if a.get('timestamp')]
        activities.sort(key=lambda a: a['timestamp'], reverse=True)
        activities = activities[:10]

        return Response({'items': activities}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def credit_risk_score(request):
    """Compute and return creditworthiness metrics (probability, score, category).

    Query params:
      - user: driver UUID (required)
      - vehicle: vehicle UUID (optional)
    """
    try:
        user_id = request.query_params.get('user')
        vehicle_id = request.query_params.get('vehicle')
        if not user_id:
            return Response({'error': 'Missing user id'}, status=status.HTTP_400_BAD_REQUEST)

        vehicle = None
        if vehicle_id:
            try:
                vehicle = Vehicle.objects.get(id=vehicle_id)
            except Vehicle.DoesNotExist:
                return Response({'error': 'Invalid vehicle'}, status=status.HTTP_400_BAD_REQUEST)

        # Always use logistic scoring
        from .risk_model import compute_driver_credit_score_logistic
        details = compute_driver_credit_score_logistic(applicant_id=user_id, vehicle=vehicle)
        try:
            logger.info(
                "[CREDIT_RISK_SCORE] logistic details user=%s vehicle=%s -> %s",
                user_id,
                getattr(vehicle, 'id', None),
                details,
            )
        except Exception:
            pass

        return Response(details, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_kyc(request):
    """Create or update KYC for a driver and mark as UNDER_REVIEW."""
    try:
        data = request.data
        user_id = data.get('user')
        if not user_id:
            return Response({'error': 'Missing user id'}, status=status.HTTP_400_BAD_REQUEST)

        # Upsert KYC by user
        kyc = KYC.objects.filter(user_id=user_id).first()

        # Force status to UNDER_REVIEW on submission
        payload = {**data, 'status': KYC.VerificationStatus.UNDER_REVIEW}
        serializer = KYCSerializer(instance=kyc, data=payload, partial=kyc is not None)
        if serializer.is_valid():
            try:
                instance = serializer.save()
            except (IntegrityError, DataError, InvalidOperation, ValueError) as e:
                # Return as 400 to surface meaningful error to client instead of 500
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

            resp = {
                'message': 'KYC submitted',
                'kyc': KYCSerializer(instance).data
            }
            return Response(resp, status=status.HTTP_201_CREATED if kyc is None else status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def kyc_status(request):
    """Return the current KYC status for a given user id."""
    try:
        user_id = request.query_params.get('user')
        if not user_id:
            return Response({'error': 'Missing user id'}, status=status.HTTP_400_BAD_REQUEST)

        kyc = KYC.objects.filter(user_id=user_id).first()
        if not kyc:
            return Response({'status': 'NOT_SUBMITTED'}, status=status.HTTP_200_OK)

        return Response({
            'status': kyc.status,
            'kyc': KYCSerializer(kyc).data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def submit_application(request):
    """Create a driver application for a vehicle with PENDING status."""
    try:
        data = request.data
        applicant_id = data.get('applicant')
        vehicle_id = data.get('vehicle')
        if not applicant_id or not vehicle_id:
            return Response({'error': 'Missing applicant or vehicle id'}, status=status.HTTP_400_BAD_REQUEST)

        # Basic validations
        from django.contrib.auth import get_user_model
        User = get_user_model()
        try:
            applicant = User.objects.get(id=applicant_id, role=User.Role.DRIVER)
        except User.DoesNotExist:
            return Response({'error': 'Invalid applicant'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            vehicle = Vehicle.objects.get(id=vehicle_id)
        except Vehicle.DoesNotExist:
            return Response({'error': 'Invalid vehicle'}, status=status.HTTP_400_BAD_REQUEST)

        # Require approved KYC
        kyc = KYC.objects.filter(user_id=applicant_id).first()
        if not kyc or kyc.status != KYC.VerificationStatus.APPROVED:
            return Response({'error': 'KYC must be approved before applying'}, status=status.HTTP_400_BAD_REQUEST)

        # Prevent re-applying for the same vehicle by same driver and return current status
        existing = (
            DriverApplication.objects
            .filter(applicant_id=applicant_id, vehicle_id=vehicle_id)
            .order_by('-application_date')
            .first()
        )
        if existing:
            # Backfill risk score using logistic model if missing on older records
            if existing.risk_score is None:
                from .risk_model import compute_driver_credit_score_logistic
                details = compute_driver_credit_score_logistic(applicant_id=applicant_id, vehicle=vehicle)
                existing.risk_score = int(details.get('score') or 0)
                existing.save(update_fields=['risk_score'])
            return Response(
                {
                    'message': 'You have applied for this vehicle already',
                    'status': existing.status,
                    'application': DriverApplicationSerializer(existing).data,
                },
                status=status.HTTP_200_OK,
            )

        # Compute risk score and create application using logistic scoring only
        from .risk_model import compute_driver_credit_score_logistic
        risk_details = compute_driver_credit_score_logistic(applicant_id=applicant_id, vehicle=vehicle)
        risk_score = int(risk_details.get('score') or 0)
        try:
            logger.info(
                "[SUBMIT_APPLICATION] logistic user=%s vehicle=%s -> prob=%s score=%s category=%s",
                applicant_id,
                vehicle_id,
                risk_details.get('probability'),
                risk_details.get('score'),
                risk_details.get('category'),
            )
        except Exception:
            pass
        application = DriverApplication.objects.create(
            applicant=applicant,
            vehicle=vehicle,
            status=DriverApplication.ApplicationStatus.PENDING,
            risk_score=risk_score,
        )
        # Create owner notification
        try:
            Notification.objects.create(
                user=vehicle.owner,
                title="New Driver Application",
                message=f"{applicant.get_full_name() or applicant.username} applied for {vehicle.registration_number}",
                type=Notification.NotificationType.APPLICATION_SUBMITTED,
                application=application,
            )
        except Exception:
            # Non-fatal
            pass
        resp = {'message': 'Application submitted', 'application': DriverApplicationSerializer(application).data}
        if risk_details:
            resp['risk_details'] = risk_details
        return Response(resp, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def application_detail(request, pk):
    """Fetch a single driver application by id."""
    try:
        try:
            application = DriverApplication.objects.get(id=pk)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response(DriverApplicationSerializer(application).data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def update_application_status(request, pk):
    """Approve or reject an application by id."""
    try:
        try:
            application = DriverApplication.objects.get(id=pk)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = (request.data or {}).get('status')
        valid_statuses = [
            DriverApplication.ApplicationStatus.APPROVED,
            DriverApplication.ApplicationStatus.REJECTED,
        ]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status. Use APPROVED or REJECTED.'}, status=status.HTTP_400_BAD_REQUEST)

        if application.status == new_status:
            return Response({'message': 'No change', 'application': DriverApplicationSerializer(application).data}, status=status.HTTP_200_OK)

        application.status = new_status
        from django.utils import timezone
        application.decision_date = timezone.now()
        application.save(update_fields=['status', 'decision_date'])

        # Notify owner about the decision update
        try:
            Notification.objects.create(
                user=application.vehicle.owner,
                title="Application Status Updated",
                message=f"Status set to {new_status} for {application.vehicle.registration_number}",
                type=Notification.NotificationType.GENERIC,
                application=application,
            )
        except Exception:
            pass

        return Response({'application': DriverApplicationSerializer(application).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['GET'])
@permission_classes([AllowAny])
def owner_applications(request):
    """List all driver applications for vehicles owned by a given owner."""
    try:
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Missing owner id'}, status=status.HTTP_400_BAD_REQUEST)
        apps = DriverApplication.objects.filter(vehicle__owner_id=owner_id).order_by('-application_date')
        data = DriverApplicationSerializer(apps, many=True).data
        return Response({'items': data, 'count': len(data)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def notifications_list(request):
    """List notifications for a given user id."""
    try:
        user_id = request.query_params.get('user')
        if not user_id:
            return Response({'error': 'Missing user id'}, status=status.HTTP_400_BAD_REQUEST)
        notes = Notification.objects.filter(user_id=user_id).order_by('-created_at')
        data = NotificationSerializer(notes, many=True).data
        return Response({'items': data, 'count': len(data)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def notifications_mark_read(request):
    """Mark notifications as read. Provide 'user' to mark all for a user, or 'id' to mark a single notification."""
    try:
        notif_id = (request.data or {}).get('id')
        user_id = (request.data or {}).get('user') or request.query_params.get('user')
        if notif_id:
            try:
                note = Notification.objects.get(id=notif_id)
            except Notification.DoesNotExist:
                return Response({'error': 'Notification not found'}, status=status.HTTP_404_NOT_FOUND)
            note.is_read = True
            note.save(update_fields=['is_read'])
            return Response({'message': 'Marked as read', 'id': str(note.id)}, status=status.HTTP_200_OK)
        if not user_id:
            return Response({'error': 'Provide user or id'}, status=status.HTTP_400_BAD_REQUEST)
        updated = Notification.objects.filter(user_id=user_id, is_read=False).update(is_read=True)
        return Response({'message': 'Marked all as read', 'updated': updated}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)