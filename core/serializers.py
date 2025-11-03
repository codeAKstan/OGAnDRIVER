from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Vehicle, KYC
from decimal import Decimal

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Restrict role choices for public registration
        if 'role' in self.fields:
            self.fields['role'].choices = [
                (User.Role.OWNER, 'Oga'),
                (User.Role.DRIVER, 'Driver')
            ]

    def validate_role(self, value):
        # Only allow OGA and DRIVER roles for public registration
        if value not in [User.Role.OWNER, User.Role.DRIVER]:
            raise serializers.ValidationError("Invalid role selection. Only 'OGA' and 'DRIVER' roles are allowed for registration.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password fields didn't match.")
        
        # Validate password strength
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': e.messages})
        
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user


class VehicleSerializer(serializers.ModelSerializer):
    owner = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.Role.OWNER))
    driver = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.Role.DRIVER), allow_null=True, required=False)

    class Meta:
        model = Vehicle
        fields = (
            'id', 'vehicle_type', 'model_name', 'registration_number', 'photo_url',
            'total_cost', 'amount_paid', 'repayment_duration', 'interest_rate', 'total_receivable', 'weekly_returns',
            'owner', 'driver', 'is_active', 'is_fully_paid', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'interest_rate', 'total_receivable', 'weekly_returns', 'is_active', 'is_fully_paid', 'created_at', 'updated_at')

    def create(self, validated_data):
        total_cost = Decimal(str(validated_data.get('total_cost', '0')))
        amount_paid = Decimal(str(validated_data.get('amount_paid', '0')))
        # Compute interest rate from duration
        duration = validated_data.get('repayment_duration')
        rate_map = {12: Decimal('0.30'), 18: Decimal('0.45'), 24: Decimal('0.50')}
        rate = rate_map.get(int(duration)) if duration in rate_map or isinstance(duration, int) else rate_map.get(duration) if isinstance(duration, int) else Decimal('0.00')
        # Safeguard if duration is provided as string
        if isinstance(duration, str):
            try:
                rate = rate_map.get(int(duration), Decimal('0.00'))
            except ValueError:
                rate = Decimal('0.00')
        validated_data['interest_rate'] = rate
        validated_data['total_receivable'] = (total_cost * (Decimal('1.00') + rate)).quantize(Decimal('0.01'))
        validated_data['is_fully_paid'] = amount_paid >= total_cost
        return super().create(validated_data)

    def update(self, instance, validated_data):
        # Prevent owner change through update
        validated_data.pop('owner', None)
        # Recompute interest fields if total_cost or duration changed
        total_cost = Decimal(str(validated_data.get('total_cost', instance.total_cost)))
        amount_paid = Decimal(str(validated_data.get('amount_paid', instance.amount_paid)))
        duration = validated_data.get('repayment_duration', instance.repayment_duration)
        rate_map = {12: Decimal('0.30'), 18: Decimal('0.45'), 24: Decimal('0.50')}
        # Normalize duration
        if isinstance(duration, str):
            try:
                duration = int(duration)
            except ValueError:
                duration = instance.repayment_duration
        rate = rate_map.get(duration, instance.interest_rate or Decimal('0.00'))
        instance.interest_rate = rate
        instance.total_receivable = (total_cost * (Decimal('1.00') + rate)).quantize(Decimal('0.01'))
        # Recompute is_fully_paid
        instance.is_fully_paid = amount_paid >= total_cost
        return super().update(instance, validated_data)

# Admin-only serializer for creating admin users
class AdminUserCreationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'password', 'password_confirm', 'is_staff', 'is_superuser')
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
        }
    
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password fields didn't match.")
        
        # Validate password strength
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': e.messages})
        
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        user = User.objects.create_user(
            password=password,
            **validated_data
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone_number', 'role', 'date_joined')
        read_only_fields = ('id', 'date_joined')

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required.")
        return value.lower()
    
    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Password is required.")
        return value


class KYCSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.filter(role=User.Role.DRIVER))

    class Meta:
        model = KYC
        fields = (
            'id', 'user', 'full_name', 'date_of_birth', 'address',
            'document_type', 'document_number', 'document_front_image', 'document_back_image',
            'status', 'verified_by', 'verification_notes',
            'submitted_at', 'verified_at', 'updated_at'
        )
        read_only_fields = ('id', 'verified_by', 'submitted_at', 'verified_at', 'updated_at')