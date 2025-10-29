from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import (
    User, Transaction, Deposit, Withdrawal, TransactionStatus, TransactionType, AssetType,
    Investment, InvestmentStatus
)


class InvestmentTransactionSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    amount = serializers.DecimalField(max_digits=18, decimal_places=8)
    status = serializers.ChoiceField(choices=TransactionStatus.choices)
    created_at = serializers.DateTimeField()

class InvestmentSerializer(serializers.Serializer):
    id = serializers.UUIDField(read_only=True)
    plan_name = serializers.CharField()
    amount = serializers.DecimalField(max_digits=18, decimal_places=8)
    expected_roi = serializers.DecimalField(max_digits=5, decimal_places=2)
    duration_days = serializers.IntegerField()
    start_date = serializers.DateTimeField()
    end_date = serializers.DateTimeField()
    status = serializers.ChoiceField(choices=InvestmentStatus.choices)
    total_earned = serializers.DecimalField(max_digits=18, decimal_places=8)
    next_payout = serializers.DateTimeField(allow_null=True)
    transaction = InvestmentTransactionSerializer()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data['days_remaining'] = (instance.end_date - timezone.now()).days if instance.end_date > timezone.now() else 0
        return data

class CreateInvestmentSerializer(serializers.Serializer):
    plan_name = serializers.CharField(max_length=100)
    amount = serializers.DecimalField(max_digits=18, decimal_places=8, min_value=0.00000001)
    expected_roi = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100)
    duration_days = serializers.IntegerField(min_value=1)
    transaction_hash = serializers.CharField(max_length=128, required=False)

    def validate_amount(self, value):
        min_investment = 10  # Example minimum
        if value < min_investment:
            raise serializers.ValidationError(
                f'Minimum investment amount is {min_investment}'
            )
        return value

class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration/signup
    """
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password_confirm = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password and Confirm Password must be the same.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.create_user(**validated_data)
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer to include user data in the response
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['email'] = user.email
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        token['address'] = user.address
        token['verified'] = user.verified
        token['wallet_name'] = user.wallet_name
        token['wallet_number'] = user.wallet_number
        return token


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        print("Email: ", email)
        
        if email and password:
            user = authenticate(username=email, password=password)
            print("User: ", user)
            if user:
                if user.is_active:
                    attrs['user'] = user
                    return attrs
                else:
                    raise serializers.ValidationError('User account is disabled.')
            else:
                raise serializers.ValidationError('Unable to log in with provided credentials.')
        else:
            raise serializers.ValidationError('Must include "email" and "password".')


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'address', 'verified', 'wallet_name', 'wallet_number', 'date_joined', 'last_login')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login')
class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data
    """
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'address', 'verified', 'wallet_name', 'wallet_number', 'date_joined', 'last_login')
        read_only_fields = ('id', 'email', 'date_joined', 'last_login')

class WalletConnectSerializer(serializers.ModelSerializer):
    """
    Serializer for wallet connection operations
    """
    class Meta:
        model = User
        fields = ('wallet_name', 'wallet_number')
        read_only_fields = ()


class WalletStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for wallet status information
    """
    class Meta:
        model = User
        fields = ('wallet_name', 'wallet_number', 'is_wallet_connected')
        read_only_fields = ('is_wallet_connected',)


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for Transaction model
    """
    transaction_type = serializers.ChoiceField(choices=TransactionType.choices)
    status = serializers.ChoiceField(choices=TransactionStatus.choices, read_only=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'transaction_id', 'transaction_type', 'status', 'amount', 
             'fee', 
            'created_at', 'updated_at', 'completed_at', 'user', 'user_email'
        ]
        read_only_fields = ('transaction_id', 'created_at', 'updated_at', 'completed_at')

    def create(self, validated_data):
        # Generate a unique transaction ID
        import uuid
        validated_data['transaction_id'] = f"tx_{uuid.uuid4().hex[:16]}"
        return super().create(validated_data)


class DepositCreateSerializer(serializers.Serializer):
    amount = serializers.DecimalField(
        max_digits=36,
        decimal_places=18,
    )
    asset_type = serializers.ChoiceField(choices=AssetType.choices)
    deposit_address = serializers.CharField(
        max_length=255,
    )
    tx_hash = serializers.CharField(
        max_length=255,
        allow_blank=True,
        required = False
    )
    

class DepositSerializer(serializers.ModelSerializer):
    """
    Serializer for Deposit model
    """
    is_approved = serializers.BooleanField(read_only=True)
    approved_by = serializers.StringRelatedField(read_only=True)
    required_confirmations = serializers.IntegerField(read_only=True)
    
    created_at = serializers.DateTimeField(source='transaction.created_at', read_only=True)
    updated_at = serializers.DateTimeField(source='transaction.updated_at', read_only=True)
    
    class Meta:
        model = Deposit
        fields = [
            'id', 'transaction', 'deposit_address', 'tx_hash', 'confirmed_blocks',
            'required_confirmations', 'is_approved', 'approved_by', 'approved_at',
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ('created_at', 'updated_at', 'approved_at')
    
    def create(self, validated_data):
        transaction_data = validated_data.pop('transaction')
        transaction_serializer = TransactionSerializer(data=transaction_data)
        transaction_serializer.is_valid(raise_exception=True)
        transaction = transaction_serializer.save()
        
        # Set default required confirmations based on asset type
        asset_type = transaction.asset_type
        required_confirmations = {
            'BTC': 3,
            'ETH': 12,
            'TRX': 20,
            'SOL': 32,
            'XRP': 35,
            'USDT': 12,  # Assuming ERC20
            'USDC': 12,  # Assuming ERC20
            'OTHER': 10
        }
        
        deposit = Deposit.objects.create(
            transaction=transaction,
            required_confirmations=required_confirmations.get(asset_type, 10),
            **validated_data
        )
        return deposit


class AdminDepositApprovalSerializer(serializers.Serializer):
    """
    Serializer for admin deposit approval
    """
    is_approved = serializers.BooleanField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if attrs.get('is_approved') is None:
            raise serializers.ValidationError({"is_approved": "This field is required."})
        return attrs


class WithdrawalSerializer(serializers.Serializer):
    """
    Serializer for Withdrawal model
    """
    wallet_address = serializers.CharField(max_length=255)
    amount = serializers.DecimalField(max_digits=20, decimal_places=8)
    network = serializers.CharField(max_length=50)

    

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate(self, attrs):
        # Add any additional validation here
        return attrs
