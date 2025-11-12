from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('admin/create-user/', views.AdminUserCreationView.as_view(), name='admin_create_user'),
    path('health/', views.health_check, name='health_check'),
    path('vehicles/', views.VehicleCreateView.as_view(), name='vehicle_create'),
    path('vehicles/<uuid:pk>/', views.VehicleDetailView.as_view(), name='vehicle_detail'),
    path('recent-activity/', views.recent_activity, name='recent_activity'),
    path('kyc/submit/', views.submit_kyc, name='kyc_submit'),
    path('kyc/status/', views.kyc_status, name='kyc_status'),
    path('risk/score/', views.credit_risk_score, name='credit_risk_score'),
    path('applications/submit/', views.submit_application, name='submit_application'),
    path('applications/<uuid:pk>/', views.application_detail, name='application_detail'),
    path('applications/<uuid:pk>/status/', views.update_application_status, name='update_application_status'),
    path('applications/owner/', views.owner_applications, name='owner_applications'),
    path('notifications/', views.notifications_list, name='notifications_list'),
]