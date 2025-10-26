from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.shortcuts import get_object_or_404

from .models import User
from .serializers import (
    UserRegistrationSerializer,
    CustomTokenObtainPairSerializer,
    LoginSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    WalletConnectSerializer,
    WalletStatusSerializer
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
    try:
        user = request.user
        user.wallet_name = None
        user.wallet_number = None
        user.save()

        serializer = UserProfileSerializer(user)
        return Response({
            'message': 'Wallet disconnected successfully',
            'user': serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({
            'error': 'Failed to disconnect wallet'
        }, status=status.HTTP_400_BAD_REQUEST)
