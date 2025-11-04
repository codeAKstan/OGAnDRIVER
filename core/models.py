from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    class Role(models.TextChoices):
        OWNER = "OGA", "Oga"
        DRIVER = "DRIVER", "Driver"
        ADMIN = "ADMIN", "Admin"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=50, choices=Role.choices)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    


class Vehicle(models.Model):
    class VehicleType(models.TextChoices):
        KEKE = "KEKE", "Keke"
        BUS = "BUS", "Bus"
        BIKE = "BIKE", "Bike"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vehicles', limit_choices_to={'role': User.Role.OWNER})
    driver = models.OneToOneField(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='vehicle_assigned', limit_choices_to={'role': User.Role.DRIVER})
    
    vehicle_type = models.CharField(max_length=50, choices=VehicleType.choices)
    model_name = models.CharField(max_length=100)
    registration_number = models.CharField(max_length=20, unique=True)
    photo_url = models.URLField(max_length=200, blank=True, null=True)
    

    # Financials
    total_cost = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    # Hire-purchase terms
    repayment_duration = models.IntegerField(choices=[(12, '12'), (18, '18'), (24, '24')], null=True, blank=True)
    interest_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_receivable = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    weekly_returns = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    # Status
    is_active = models.BooleanField(default=True)
    is_fully_paid = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Calculate weekly returns using precise week mapping
        if self.total_receivable and self.repayment_duration:
            duration_to_weeks = {12: 52, 18: 78, 24: 104}
            weeks = duration_to_weeks.get(self.repayment_duration, 0)
            if weeks:
                self.weekly_returns = self.total_receivable / weeks
            else:
                self.weekly_returns = 0
        else:
            self.weekly_returns = 0
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.model_name} - {self.registration_number}"


class DriverApplication(models.Model):
    class ApplicationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications', limit_choices_to={'role': User.Role.DRIVER})
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='applications')
    
    status = models.CharField(max_length=50, choices=ApplicationStatus.choices, default=ApplicationStatus.PENDING)
    risk_score = models.IntegerField(null=True, blank=True) # Will be calculated later

    application_date = models.DateTimeField(auto_now_add=True)
    decision_date = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Application by {self.applicant.username} for {self.vehicle.model_name}"


class Payment(models.Model):
    class PaymentStatus(models.TextChoices):
        SUCCESSFUL = "SUCCESSFUL", "Successful"
        FAILED = "FAILED", "Failed"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    transaction_id = models.CharField(max_length=100, unique=True) # From payment gateway
    
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE, related_name='payments')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments_made', limit_choices_to={'role': User.Role.DRIVER})
    
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=PaymentStatus.choices)

    def __str__(self):
        return f"Payment of {self.amount} for {self.vehicle.registration_number}"


class KYC(models.Model):
    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Pending"
        APPROVED = "APPROVED", "Approved"
        REJECTED = "REJECTED", "Rejected"
        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"

    class DocumentType(models.TextChoices):
        NATIONAL_ID = "NATIONAL_ID", "National ID"
        DRIVERS_LICENSE = "DRIVERS_LICENSE", "Driver's License"
        PASSPORT = "PASSPORT", "Passport"
        VOTERS_CARD = "VOTERS_CARD", "Voter's Card"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='kyc')
    
    # Personal Information
    full_name = models.CharField(max_length=200)
    date_of_birth = models.DateField()
    address = models.TextField()
    
    # Document Information
    document_type = models.CharField(max_length=50, choices=DocumentType.choices)
    document_number = models.CharField(max_length=50, unique=True)
    document_front_image = models.URLField(max_length=500, blank=True, null=True)
    document_back_image = models.URLField(max_length=500, blank=True, null=True)
    
    # Financial Information
    monthly_income = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    bank_statement_summary = models.TextField(blank=True, null=True, help_text="Summary of bank statement including average balance, transaction patterns, etc.")
    bank_statement_file = models.URLField(max_length=500, blank=True, null=True, help_text="URL to uploaded bank statement file")
    
    # Verification Status
    status = models.CharField(max_length=50, choices=VerificationStatus.choices, default=VerificationStatus.PENDING)
    verified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='kyc_verifications', limit_choices_to={'role': User.Role.ADMIN})
    verification_notes = models.TextField(blank=True, null=True)
    
    # Timestamps
    submitted_at = models.DateTimeField(auto_now_add=True)
    verified_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"KYC for {self.user.username} - {self.status}"

    class Meta:
        verbose_name = "KYC Verification"
        verbose_name_plural = "KYC Verifications"