from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    UserRegistrationView,
    CustomTokenObtainPairView,
    LoginView,
    UserProfileView,
    UserProfileUpdateView,
    wallet_status_view,
    wallet_connect_view,
    wallet_disconnect_view,
    transaction_list_create_view,
    transaction_detail_view,
    create_deposit_view,
    list_deposits_view,
    deposit_detail_view,
    update_deposit_confirmations,
    admin_list_pending_deposits,
    admin_approve_deposit,
    WithdrawalView,
    InvestmentView
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
    
    # Transaction endpoints
    path('transactions/', transaction_list_create_view, name='transaction-list'),
    path('transactions/user/', transaction_list_create_view, name='user-transactions'),  # For fetching user's transactions
    path('transactions/<str:tx_id>/', transaction_detail_view, name='transaction-detail'),
    
    # Deposit endpoints
    path('deposits/', create_deposit_view, name='deposit-create'),
    path('deposits/list/', list_deposits_view, name='deposit-list'),
    path('deposits/<int:deposit_id>/', deposit_detail_view, name='deposit-detail'),
    
    # Investment endpoints
    path('investments/', InvestmentView.as_view(), name='investment-list-create'),
    path('investments/<str:status>/', InvestmentView.as_view(), name='investment-filtered'),
    path('deposits/<int:deposit_id>/confirmations/', update_deposit_confirmations, name='deposit-update-confirmations'),
    
    # Withdrawal endpoints
    path('withdrawals/', WithdrawalView.as_view(), name='withdrawal-create'),
    
    # Admin endpoints
    path('admin/deposits/pending/', admin_list_pending_deposits, name='admin-pending-deposits'),
    path('admin/deposits/<int:deposit_id>/approve/', admin_approve_deposit, name='admin-approve-deposit'),
]
