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
    PaymentSerializer,
)
from .models import Vehicle, KYC, Payment, DriverApplication, Notification
from django.core.mail import send_mail
from django.conf import settings
import json
from urllib import request as urlrequest
from urllib.error import HTTPError, URLError
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
        return Response({'error': 'Validation failed', 'details': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

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
        try:
            Notification.objects.create(
                user=vehicle.owner,
                title="New Driver Application",
                message=f"{applicant.get_full_name() or applicant.username} applied for {vehicle.registration_number}",
                type=Notification.NotificationType.APPLICATION_SUBMITTED,
                application=application,
            )
        except Exception:
            pass
        try:
            Notification.objects.create(
                user=applicant,
                title="Application Submitted",
                message=f"Your application for {vehicle.registration_number} has been received.",
                type=Notification.NotificationType.APPLICATION_SUBMITTED,
                application=application,
            )
        except Exception:
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
def application_deposit_payment(request, pk):
    try:
        try:
            application = DriverApplication.objects.get(id=pk)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        if application.status != DriverApplication.ApplicationStatus.APPROVED:
            return Response({'error': 'Application must be approved before deposit'}, status=status.HTTP_400_BAD_REQUEST)

        from decimal import Decimal
        total_cost = Decimal(str(application.vehicle.total_cost or '0'))
        deposit = (total_cost * Decimal('0.05')).quantize(Decimal('0.01'))

        import uuid as _uuid
        tx_id = f"DEP-{_uuid.uuid4()}"

        Payment.objects.create(
            transaction_id=tx_id,
            vehicle=application.vehicle,
            driver=application.applicant,
            amount=deposit,
            status=Payment.PaymentStatus.SUCCESSFUL,
        )

        from decimal import Decimal as D
        application.vehicle.amount_paid = (D(str(application.vehicle.amount_paid or '0')) + deposit).quantize(D('0.01'))
        application.vehicle.save(update_fields=['amount_paid'])

        try:
            Notification.objects.create(
                user=application.applicant,
                title="Deposit Paid",
                message="Your 5% deposit has been received. Your loan is now active.",
                type=Notification.NotificationType.GENERIC,
                application=application,
            )
        except Exception:
            pass
        try:
            Notification.objects.create(
                user=application.vehicle.owner,
                title="Driver Deposit Received",
                message=f"5% deposit received for {application.vehicle.registration_number}.",
                type=Notification.NotificationType.GENERIC,
                application=application,
            )
        except Exception:
            pass
        try:
            subject = "Deposit Received – Oga Driver"
            message = "Your 5% deposit has been received. Your loan is now active."
            recipient = [application.applicant.email] if application.applicant.email else []
            if recipient:
                send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient, fail_silently=True)
        except Exception:
            pass

        return Response({'application': DriverApplicationSerializer(application).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def _paystack_request(path, payload=None, method='POST'):
    url = f"https://api.paystack.co{path}"
    data = None
    if payload is not None:
        data = json.dumps(payload).encode('utf-8')
    req = urlrequest.Request(url, data=data, method=method)
    req.add_header('Authorization', f"Bearer {getattr(settings, 'PAYSTACK_SECRET_KEY', '')}")
    req.add_header('Content-Type', 'application/json')
    try:
        with urlrequest.urlopen(req, timeout=20) as resp:
            body = resp.read().decode('utf-8')
            try:
                return json.loads(body)
            except Exception:
                return {'status': False, 'message': body}
    except HTTPError as e:
        try:
            raw = e.read().decode('utf-8')
            return json.loads(raw)
        except Exception:
            return {'status': False, 'message': getattr(e, 'reason', str(e))}
    except URLError as e:
        return {'status': False, 'message': str(e)}


@api_view(['POST'])
@permission_classes([AllowAny])
def deposit_init(request):
    try:
        data = request.data or {}
        application_id = data.get('application')
        callback_url = data.get('callback_url') or getattr(settings, 'PAYSTACK_DEFAULT_CALLBACK', '')
        if not application_id:
            return Response({'error': 'Missing application id'}, status=status.HTTP_400_BAD_REQUEST)
        # Basic validations
        secret = getattr(settings, 'PAYSTACK_SECRET_KEY', '')
        if not secret:
            return Response({'error': 'PAYSTACK_SECRET_KEY not configured'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = DriverApplication.objects.get(id=application_id)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        if application.status != DriverApplication.ApplicationStatus.APPROVED:
            return Response({'error': 'Application must be approved before deposit'}, status=status.HTTP_400_BAD_REQUEST)
        if not application.applicant.email:
            return Response({'error': 'Applicant email is required for Paystack'}, status=status.HTTP_400_BAD_REQUEST)
        from decimal import Decimal
        total_cost = Decimal(str(application.vehicle.total_cost or '0'))
        deposit = (total_cost * Decimal('0.05')).quantize(Decimal('0.01'))
        amount_kobo = int((deposit * 100).to_integral_value())
        ref = f"DEP-{application.id}"
        payload = {
            'email': application.applicant.email,
            'amount': amount_kobo,
            'reference': ref,
            'callback_url': callback_url,
            'metadata': {
                'application': str(application.id),
                'driver': str(application.applicant_id),
                'vehicle': str(application.vehicle_id),
                'type': 'deposit_5pct'
            }
        }
        res = _paystack_request('/transaction/initialize', payload=payload, method='POST')
        if res.get('status'):
            data = res.get('data') or {}
            return Response({'authorization_url': data.get('authorization_url'), 'reference': data.get('reference')}, status=status.HTTP_200_OK)
        return Response({'error': res.get('message') or 'Paystack init failed'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def deposit_verify(request):
    try:
        data = request.data or {}
        reference = data.get('reference') or request.query_params.get('reference')
        if not reference:
            return Response({'error': 'Missing reference'}, status=status.HTTP_400_BAD_REQUEST)
        res = _paystack_request(f"/transaction/verify/{reference}", payload=None, method='GET')
        if not res.get('status'):
            return Response({'error': res.get('message') or 'Verification failed'}, status=status.HTTP_400_BAD_REQUEST)
        payload = res.get('data') or {}
        amount_kobo = payload.get('amount') or 0
        status_str = payload.get('status')
        metadata = payload.get('metadata') or {}
        application_id = metadata.get('application')
        if status_str != 'success' or not application_id:
            return Response({'error': 'Payment not successful'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            application = DriverApplication.objects.get(id=application_id)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)
        from decimal import Decimal
        total_cost = Decimal(str(application.vehicle.total_cost or '0'))
        deposit = (total_cost * Decimal('0.05')).quantize(Decimal('0.01'))
        expected_kobo = int((deposit * 100).to_integral_value())
        if int(amount_kobo) < expected_kobo:
            return Response({'error': 'Insufficient amount'}, status=status.HTTP_400_BAD_REQUEST)
        import uuid as _uuid
        tx_id = payload.get('reference') or f"DEP-{_uuid.uuid4()}"
        Payment.objects.create(
            transaction_id=tx_id,
            vehicle=application.vehicle,
            driver=application.applicant,
            amount=deposit,
            status=Payment.PaymentStatus.SUCCESSFUL,
        )
        from decimal import Decimal as D
        application.vehicle.amount_paid = (D(str(application.vehicle.amount_paid or '0')) + deposit).quantize(D('0.01'))
        application.vehicle.save(update_fields=['amount_paid'])
        try:
            Notification.objects.create(
                user=application.applicant,
                title="Deposit Paid",
                message="Your 5% deposit has been received. Your loan is now active.",
                type=Notification.NotificationType.GENERIC,
                application=application,
            )
        except Exception:
            pass
        try:
            Notification.objects.create(
                user=application.vehicle.owner,
                title="Driver Deposit Received",
                message=f"5% deposit received for {application.vehicle.registration_number}.",
                type=Notification.NotificationType.GENERIC,
                application=application,
            )
        except Exception:
            pass
        return Response({'application': DriverApplicationSerializer(application).data}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def update_application_status(request, pk):
    """Approve, reject or revert an application by id."""
    try:
        try:
            application = DriverApplication.objects.get(id=pk)
        except DriverApplication.DoesNotExist:
            return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

        new_status = (request.data or {}).get('status')
        valid_statuses = [
            DriverApplication.ApplicationStatus.APPROVED,
            DriverApplication.ApplicationStatus.REJECTED,
            DriverApplication.ApplicationStatus.PENDING,
        ]
        if new_status not in valid_statuses:
            return Response({'error': 'Invalid status. Use APPROVED, REJECTED or PENDING.'}, status=status.HTTP_400_BAD_REQUEST)

        if application.status == new_status:
            return Response({'message': 'No change', 'application': DriverApplicationSerializer(application).data}, status=status.HTTP_200_OK)

        from django.utils import timezone
        if new_status == DriverApplication.ApplicationStatus.APPROVED:
            vehicle = application.vehicle
            if vehicle.driver and vehicle.driver_id != application.applicant_id:
                return Response({'error': 'Vehicle already assigned to a driver.'}, status=status.HTTP_400_BAD_REQUEST)
            application.status = new_status
            application.decision_date = timezone.now()
            application.save(update_fields=['status', 'decision_date'])
            vehicle.driver = application.applicant
            vehicle.save(update_fields=['driver'])
            try:
                Notification.objects.create(
                    user=application.vehicle.owner,
                    title="Application Approved",
                    message=f"Approved for {application.vehicle.registration_number}",
                    type=Notification.NotificationType.GENERIC,
                    application=application,
                )
            except Exception:
                pass
            try:
                Notification.objects.create(
                    user=application.applicant,
                    title="Application Approved",
                    message="You have been approved for this loan. You have to make a 5% first payment to be assigned the vehicle.",
                    type=Notification.NotificationType.GENERIC,
                    application=application,
                )
            except Exception:
                pass
            try:
                subject = "Application Approved – Oga Driver"
                message = "You have been approved for this loan. You have to make a 5% first payment to be assigned the vehicle."
                recipient = [application.applicant.email] if application.applicant.email else []
                if recipient:
                    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, recipient, fail_silently=True)
            except Exception:
                pass
        elif new_status == DriverApplication.ApplicationStatus.REJECTED:
            application.status = new_status
            application.decision_date = timezone.now()
            application.save(update_fields=['status', 'decision_date'])
            try:
                Notification.objects.create(
                    user=application.vehicle.owner,
                    title="Application Rejected",
                    message=f"Rejected for {application.vehicle.registration_number}",
                    type=Notification.NotificationType.GENERIC,
                    application=application,
                )
            except Exception:
                pass
            try:
                Notification.objects.create(
                    user=application.applicant,
                    title="Application Rejected",
                    message=f"Your application for {application.vehicle.registration_number} was rejected.",
                    type=Notification.NotificationType.GENERIC,
                    application=application,
                )
            except Exception:
                pass
        else:
            if application.status == DriverApplication.ApplicationStatus.APPROVED:
                application.status = DriverApplication.ApplicationStatus.PENDING
                application.decision_date = timezone.now()
                application.save(update_fields=['status', 'decision_date'])
                vehicle = application.vehicle
                if vehicle.driver_id == application.applicant_id:
                    vehicle.driver = None
                    vehicle.save(update_fields=['driver'])
                try:
                    Notification.objects.create(
                        user=application.vehicle.owner,
                        title="Approval Reverted",
                        message=f"Reverted approval for {application.vehicle.registration_number}",
                        type=Notification.NotificationType.GENERIC,
                        application=application,
                    )
                except Exception:
                    pass
                try:
                    Notification.objects.create(
                        user=application.applicant,
                        title="Approval Reverted",
                        message=f"Your approval for {application.vehicle.registration_number} has been reverted.",
                        type=Notification.NotificationType.GENERIC,
                        application=application,
                    )
                except Exception:
                    pass
            else:
                application.status = DriverApplication.ApplicationStatus.PENDING
                application.decision_date = timezone.now()
                application.save(update_fields=['status', 'decision_date'])

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
        items = []
        for n in notes:
            item = {
                'id': str(n.id),
                'title': n.title,
                'message': n.message,
                'type': n.type,
                'is_read': n.is_read,
                'created_at': n.created_at.isoformat() if n.created_at else None,
            }
            if n.application_id:
                item['application'] = {'id': str(n.application_id)}
            items.append(item)
        return Response({'items': items, 'count': len(items)}, status=status.HTTP_200_OK)
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


@api_view(['GET'])
@permission_classes([AllowAny])
def driver_overview(request):
    try:
        driver_id = request.query_params.get('driver')
        if not driver_id:
            return Response({'error': 'Missing driver id'}, status=status.HTTP_400_BAD_REQUEST)
        vehicle = Vehicle.objects.filter(driver_id=driver_id).first()
        app_qs = DriverApplication.objects.filter(applicant_id=driver_id).order_by('-application_date')
        application = app_qs.first()
        from decimal import Decimal
        deposit_paid = False
        total_receivable = 0
        amount_paid = 0
        weekly_returns = 0
        if vehicle:
            total_receivable = float(vehicle.total_receivable or 0)
            amount_paid = float(vehicle.amount_paid or 0)
            weekly_returns = float(vehicle.weekly_returns or 0)
            threshold = (Decimal(str(vehicle.total_cost or '0')) * Decimal('0.05')).quantize(Decimal('0.01'))
            amounts = Payment.objects.filter(driver_id=driver_id, vehicle_id=vehicle.id, status=Payment.PaymentStatus.SUCCESSFUL).values_list('amount', flat=True)
            paid = sum(Decimal(str(a)) for a in amounts) if amounts else Decimal('0')
            deposit_paid = paid >= threshold
        payload = {
            'vehicle': {
                'id': str(getattr(vehicle, 'id', '')) if vehicle else None,
                'model_name': getattr(vehicle, 'model_name', None) if vehicle else None,
                'registration_number': getattr(vehicle, 'registration_number', None) if vehicle else None,
            },
            'application': DriverApplicationSerializer(application).data if application else None,
            'stats': {
                'total_receivable': total_receivable,
                'amount_paid': amount_paid,
                'weekly_returns': weekly_returns,
                'deposit_paid': deposit_paid,
            }
        }
        return Response(payload, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def driver_applications(request):
    try:
        driver_id = request.query_params.get('driver')
        if not driver_id:
            return Response({'error': 'Missing driver id'}, status=status.HTTP_400_BAD_REQUEST)
        apps = DriverApplication.objects.filter(applicant_id=driver_id).order_by('-application_date')
        data = DriverApplicationSerializer(apps, many=True).data
        return Response({'items': data, 'count': len(data)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def owner_payments(request):
    try:
        owner_id = request.query_params.get('owner')
        if not owner_id:
            return Response({'error': 'Missing owner id'}, status=status.HTTP_400_BAD_REQUEST)
        qs = Payment.objects.filter(vehicle__owner_id=owner_id).order_by('-payment_date')
        data = PaymentSerializer(qs, many=True).data
        return Response({'items': data, 'count': len(data)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@permission_classes([AllowAny])
def driver_payments(request):
    try:
        driver_id = request.query_params.get('driver')
        if not driver_id:
            return Response({'error': 'Missing driver id'}, status=status.HTTP_400_BAD_REQUEST)
        qs = Payment.objects.filter(driver_id=driver_id).order_by('-payment_date')
        data = PaymentSerializer(qs, many=True).data
        return Response({'items': data, 'count': len(data)}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)