import logging
from urllib.parse import urlsplit

from django.conf import settings
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.core.exceptions import ValidationError
from django.core.mail import send_mail
from django.db import transaction
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import serializers, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import SimpleRateThrottle
from rest_framework.views import APIView

from .models import User

logger = logging.getLogger(__name__)


class PasswordResetThrottle(SimpleRateThrottle):
    scope = 'password_reset'
    rate = '5/hour'

    def get_cache_key(self, request, view):
        return self.cache_format % {'scope': self.scope, 'ident': self.get_ident(request)}


class ResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class ResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField(max_length=200)
    token = serializers.CharField(max_length=200)
    password = serializers.CharField(min_length=8, max_length=128, trim_whitespace=False)


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [PasswordResetThrottle]

    def post(self, request):
        serializer = ResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        frontend_url = settings.FRONTEND_URL.rstrip('/')
        parsed = urlsplit(frontend_url)
        if parsed.scheme not in ('http', 'https') or not parsed.netloc or not settings.EMAIL_HOST:
            return Response(
                {'detail': 'Password recovery is temporarily unavailable. Please contact your administrator.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # Use a configured trusted origin, never a host or redirect URL supplied by the caller.
        users = User.objects.filter(email__iexact=serializer.validated_data['email'], is_active=True)
        for user in users:
            if not user.has_usable_password():
                continue
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            reset_url = f'{frontend_url}/reset-password/{uid}/{token}'
            try:
                send_mail(
                    'Reset your Web3SecureNet password',
                    f'Use this link to reset your account password:\n\n{reset_url}\n\n'
                    'This link expires in one hour and can be used once. '
                    'If you did not request this, ignore this email. '
                    'We will never ask for your wallet recovery phrase or private key.',
                    settings.DEFAULT_FROM_EMAIL,
                    [user.email],
                    fail_silently=False,
                )
            except Exception:
                # Keep the public response identical for existing and unknown accounts.
                logger.error('Password recovery email could not be sent')

        return Response({'message': 'If an account exists for that email, a password reset link will be sent.'})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [PasswordResetThrottle]

    def post(self, request):
        serializer = ResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        try:
            user_id = urlsafe_base64_decode(data['uid']).decode()
            # Lock the user so concurrent attempts cannot reuse a reset token.
            with transaction.atomic():
                user = User.objects.select_for_update().get(pk=user_id, is_active=True)
                if not default_token_generator.check_token(user, data['token']):
                    raise ValueError('Invalid token')
                try:
                    validate_password(data['password'], user=user)
                except ValidationError as error:
                    return Response({'detail': error.messages[0]}, status=status.HTTP_400_BAD_REQUEST)
                user.set_password(data['password'])
                user.save(update_fields=['password'])
        except (ValueError, TypeError, OverflowError, UnicodeError, User.DoesNotExist):
            return Response({'detail': 'This password reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'message': 'Password updated. You can now sign in.'})
