from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserRegistrationView,
    CustomTokenObtainPairView,
    LoginView,
    UserProfileView,
    UserProfileUpdateView,
    wallet_status_view,
    wallet_connect_view,
    wallet_disconnect_view
)

app_name = 'app'

urlpatterns = [
    # Authentication endpoints
    path('auth/signup/', UserRegistrationView.as_view(), name='user-signup'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token-obtain-pair'),
    path('auth/login-alt/', LoginView.as_view(), name='login-alt'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

    # Profile endpoints
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/edit/', UserProfileUpdateView.as_view(), name='edit-profile'),

    # Wallet endpoints
    path('wallet/status/', wallet_status_view, name='wallet-status'),
    path('wallet/connect/', wallet_connect_view, name='wallet-connect'),
    path('wallet/disconnect/', wallet_disconnect_view, name='wallet-disconnect'),
]
