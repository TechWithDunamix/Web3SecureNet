from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from .models import User


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
        fields = ('id', 'wallet_name', 'wallet_number')
        read_only_fields = ('id',)
