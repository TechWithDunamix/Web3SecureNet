import uuid
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import User, Transaction, Deposit, TransactionStatus,TransactionType
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    WalletConnectSerializer,
    WalletStatusSerializer,
    TransactionSerializer,
    DepositSerializer,
    AdminDepositApprovalSerializer,
    DepositCreateSerializer
)


class UserRegistrationView(generics.CreateAPIView):
    """
    View for user registration/signup
    """
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        user = serializer.save()

        # Generate tokens for the new user
        token_data = CustomTokenObtainPairSerializer.get_token(user)
        refresh_token = str(token_data)
        access_token = str(token_data.access_token)

        return Response({
            'message': 'User registered successfully',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': refresh_token,
                'access': access_token,
            }
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view that returns user data along with tokens
    """
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            # Add user data to response
            user = self.request.user
            response.data['user'] = UserProfileSerializer(user).data
        return response


class LoginView(generics.GenericAPIView):
    """
    Alternative login view using custom login serializer
    """
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # serializer = self.get_serializer(data=request.data)
        serializer = LoginSerializer(data=request.data)
        print("Serializer: ", serializer)
        if not serializer.is_valid(raise_exception=True):
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.validated_data['user']

        # Generate tokens
        token_data = CustomTokenObtainPairSerializer.get_token(user)
        refresh_token = str(token_data)
        access_token = str(token_data.access_token)

        return Response({
            'message': 'Login successful',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': refresh_token,
                'access': access_token,
            }
        })


class UserProfileView(generics.RetrieveAPIView):
    """
    View to get current user's profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserProfileUpdateView(generics.UpdateAPIView):
    """
    View to update current user's profile
    """
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response({
            'message': 'Profile updated successfully',
            'user': UserProfileSerializer(instance).data
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wallet_status_view(request):
    """
    Get current user's wallet status
    """
    try:
        user = request.user
        serializer = WalletStatusSerializer(user)
        return Response({
            'wallet_connected': bool(user.wallet_name and user.wallet_number),
            'wallet': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Failed to retrieve wallet status'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def wallet_connect_view(request):
    """
    Connect or update wallet for current user
    """
    try:
        user = request.user
        serializer = WalletConnectSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()

            # Return updated user profile
            user_serializer = UserProfileSerializer(user)
            return Response({
                'message': 'Wallet connected successfully',
                'user': user_serializer.data
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid wallet data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'error': 'Failed to connect wallet'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def wallet_disconnect_view(request):
    """
    Disconnect wallet for current user
    """
    user = request.user
    if not user.wallet_number:
        return Response(
            {'detail': 'No wallet connected'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Store the disconnected wallet info for reference
    disconnected_wallet = {
        'wallet_name': user.wallet_name,
        'wallet_number': user.wallet_number,
        'disconnected_at': timezone.now()
    }

    user.wallet_name = ''
    user.wallet_number = ''
    user.save()

    return Response({
        'detail': 'Wallet disconnected successfully',
        'disconnected_wallet': disconnected_wallet
    }, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def transaction_list_create_view(request):
    """
    List all transactions for the authenticated user or create a new transaction
    """
    if request.method == 'GET':
        transactions = Transaction.objects.filter(user=request.user).order_by('-created_at')
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = TransactionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_detail_view(request, tx_id):
    """
    Retrieve a specific transaction
    """
    transaction = get_object_or_404(Transaction, transaction_id=tx_id, user=request.user)
    serializer = TransactionSerializer(transaction)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_deposit_view(request):
    """
    Create a new deposit
    """
    serializer = DepositCreateSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        trx = Transaction.objects.create(
            user=request.user,
            transaction_id=str(uuid.uuid4().hex),
            transaction_type=TransactionType.DEPOSIT,
            status=TransactionStatus.PENDING,
            amount=serializer.validated_data['amount'],
            
            
            created_at=timezone.now(),
            updated_at=timezone.now(),
            completed_at=timezone.now(),
        )
        Deposit.objects.create(
            user = request.user,
            transaction_id=trx.id,
            deposit_address=serializer.validated_data['deposit_address'],
            amount=serializer.validated_data['amount'],
            asset_type=serializer.validated_data['asset_type'],
            tx_hash=serializer.validated_data.get("tx_hash"),
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_deposits_view(request):
    """
    List all deposits for the authenticated user
    """
    deposits = Deposit.objects.filter(transaction__user=request.user).select_related('transaction')
    serializer = DepositSerializer(deposits, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
def deposit_detail_view(request, deposit_id):
    """
    Retrieve or update a specific deposit
    """
    deposit = get_object_or_404(Deposit, id=deposit_id, transaction__user=request.user)
    
    if request.method == 'GET':
        serializer = DepositSerializer(deposit)
        return Response(serializer.data)
    
    elif request.method == 'PATCH':
        # Only allow updating the transaction hash for now
        if 'tx_hash' in request.data:
            deposit.tx_hash = request.data['tx_hash']
            deposit.save()
            serializer = DepositSerializer(deposit)
            return Response(serializer.data)
        return Response(
            {'detail': 'Only tx_hash can be updated'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_deposit_confirmations(request, deposit_id):
    """
    Update the number of confirmations for a deposit
    """
    deposit = get_object_or_404(Deposit, id=deposit_id, transaction__user=request.user)
    
    try:
        confirmed_blocks = int(request.data.get('confirmed_blocks', 0))
    except (ValueError, TypeError):
        return Response(
            {'detail': 'Invalid confirmed_blocks value'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    deposit.confirmed_blocks = confirmed_blocks
    
    # Auto-update transaction status based on confirmations
    if deposit.confirmed_blocks >= deposit.required_confirmations:
        deposit.transaction.status = TransactionStatus.COMPLETED
        deposit.transaction.save()
    
    deposit.save()
    
    serializer = DepositSerializer(deposit)
    return Response(serializer.data)


# Admin Views
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_list_pending_deposits(request):
    """
    List all pending deposits (admin only)
    """
    if not request.user.is_staff:
        return Response(
            {'detail': 'You do not have permission to perform this action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    deposits = Deposit.objects.filter(
        transaction__status=TransactionStatus.PENDING
    ).select_related('transaction', 'transaction__user')
    
    serializer = DepositSerializer(deposits, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def admin_approve_deposit(request, deposit_id):
    """
    Approve or reject a deposit (admin only)
    """
    if not request.user.is_staff:
        return Response(
            {'detail': 'You do not have permission to perform this action.'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    deposit = get_object_or_404(Deposit, id=deposit_id)
    
    if deposit.transaction.status != TransactionStatus.PENDING:
        return Response(
            {'detail': 'This deposit is not in a pending state.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    serializer = AdminDepositApprovalSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if serializer.validated_data['is_approved']:
        deposit.transaction.status = TransactionStatus.COMPLETED
        deposit.is_approved = True
        deposit.approved_by = request.user
        deposit.approved_at = timezone.now()
        
        # Here you would typically update the user's balance
        # user = deposit.transaction.user
        # user.balance += deposit.transaction.amount
        # user.save()
    else:
        deposit.transaction.status = TransactionStatus.CANCELLED
        deposit.notes = serializer.validated_data.get('notes', 'Deposit was rejected by admin')
    
    deposit.transaction.save()
    deposit.save()
    
    return Response(DepositSerializer(deposit).data)
