from django.urls import path
from . import views

urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
    path('admin/create-user/', views.AdminUserCreationView.as_view(), name='admin_create_user'),
    path('health/', views.health_check, name='health_check'),
]