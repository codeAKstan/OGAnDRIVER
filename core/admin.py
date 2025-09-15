from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import User, Vehicle, DriverApplication, Payment

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User
        fields = UserCreationForm.Meta.fields + ('role', 'phone_number', 'email', 'first_name', 'last_name')

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User
        fields = '__all__'

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    
    list_display = ('username', 'email','password', 'role', 'phone_number', 'is_active', 'date_joined')
    list_filter = ('role', 'is_active', 'is_staff', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-date_joined',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone_number')
        }),
    )
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Additional Info', {
            'fields': ('role', 'phone_number', 'email', 'first_name', 'last_name')
        }),
    )
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related()

@admin.register(Vehicle)
class VehicleAdmin(admin.ModelAdmin):
    list_display = ('registration_number', 'vehicle_type', 'model_name', 'owner_name', 'driver_name', 'is_active', 'created_at')
    list_filter = ('vehicle_type', 'is_active', 'created_at')
    search_fields = ('registration_number', 'model_name', 'owner__username', 'owner__email', 'driver__username')
    ordering = ('-created_at',)
    raw_id_fields = ('owner', 'driver')
    
    fieldsets = (
        ('Vehicle Information', {
            'fields': ('vehicle_type', 'model_name', 'registration_number', 'photo_url')
        }),
        ('Assignment', {
            'fields': ('owner', 'driver')
        }),
        ('Financial', {
            'fields': ('total_cost', 'amount_paid', 'is_fully_paid')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
    )
    
    readonly_fields = ('created_at', 'updated_at')
    
    def owner_name(self, obj):
        return f"{obj.owner.first_name} {obj.owner.last_name}" if obj.owner else "-"
    owner_name.short_description = 'Owner'
    
    def driver_name(self, obj):
        return f"{obj.driver.first_name} {obj.driver.last_name}" if obj.driver else "Unassigned"
    driver_name.short_description = 'Driver'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('owner', 'driver')

@admin.register(DriverApplication)
class DriverApplicationAdmin(admin.ModelAdmin):
    list_display = ('applicant_name', 'vehicle_info', 'status', 'risk_score', 'application_date', 'decision_date')
    list_filter = ('status', 'application_date', 'decision_date')
    search_fields = ('applicant__username', 'applicant__email', 'vehicle__registration_number')
    ordering = ('-application_date',)
    raw_id_fields = ('applicant', 'vehicle')
    
    fieldsets = (
        ('Application Details', {
            'fields': ('applicant', 'vehicle')
        }),
        ('Status & Assessment', {
            'fields': ('status', 'risk_score')
        }),
        ('Dates', {
            'fields': ('application_date', 'decision_date'),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('application_date',)
    
    def applicant_name(self, obj):
        return f"{obj.applicant.first_name} {obj.applicant.last_name}"
    applicant_name.short_description = 'Applicant'
    
    def vehicle_info(self, obj):
        return f"{obj.vehicle.registration_number} ({obj.vehicle.vehicle_type})"
    vehicle_info.short_description = 'Vehicle'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('applicant', 'vehicle')
    
    actions = ['approve_applications', 'reject_applications']
    
    def approve_applications(self, request, queryset):
        updated = queryset.filter(status=DriverApplication.ApplicationStatus.PENDING).update(
            status=DriverApplication.ApplicationStatus.APPROVED
        )
        self.message_user(request, f'{updated} applications were approved.')
    approve_applications.short_description = "Approve selected applications"
    
    def reject_applications(self, request, queryset):
        updated = queryset.filter(status=DriverApplication.ApplicationStatus.PENDING).update(
            status=DriverApplication.ApplicationStatus.REJECTED
        )
        self.message_user(request, f'{updated} applications were rejected.')
    reject_applications.short_description = "Reject selected applications"

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'vehicle_info', 'driver_name', 'amount', 'status', 'payment_date')
    list_filter = ('status', 'payment_date')
    search_fields = ('transaction_id', 'vehicle__registration_number', 'driver__username', 'driver__email')
    ordering = ('-payment_date',)
    raw_id_fields = ('vehicle', 'driver')
    
    fieldsets = (
        ('Payment Information', {
            'fields': ('transaction_id', 'amount', 'status')
        }),
        ('Related Records', {
            'fields': ('vehicle', 'driver')
        }),
        ('Timestamp', {
            'fields': ('payment_date',),
            'classes': ('collapse',)
        }),
    )
    
    readonly_fields = ('payment_date',)
    
    def vehicle_info(self, obj):
        return f"{obj.vehicle.registration_number} ({obj.vehicle.vehicle_type})"
    vehicle_info.short_description = 'Vehicle'
    
    def driver_name(self, obj):
        return f"{obj.driver.first_name} {obj.driver.last_name}"
    driver_name.short_description = 'Driver'
    
    def get_queryset(self, request):
        return super().get_queryset(request).select_related('vehicle', 'driver')

# Customize admin site headers
admin.site.site_header = "OGA Driver Platform Admin"
admin.site.site_title = "OGA Admin"
admin.site.index_title = "Welcome to OGA Driver Platform Administration"
