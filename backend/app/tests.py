import re
from datetime import timedelta
from unittest.mock import patch

from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APITestCase

from .models import User
from .password_reset import default_token_generator
from .serializers import UserProfileSerializer


class RecoveryTests(APITestCase):
    def setUp(self):
        cache.clear()
        self.user = User.create_user('user@example.test', 'old-password', 'Test', 'User')

    def request_link(self):
        response = self.client.post('/api/auth/password-reset/', {'email': self.user.email})
        self.assertEqual(response.status_code, 200)
        uid, token = re.search(r'/reset-password/([^/]+)/([^\s]+)', mail.outbox[-1].body).groups()
        return {'uid': uid, 'token': token, 'password': 'new-password-123'}

    def test_reset_changes_password_and_token_cannot_be_reused(self):
        payload = self.request_link()
        self.assertIn('https://frontend.example.test/reset-password/', mail.outbox[-1].body)
        response = self.client.post('/api/auth/password-reset/confirm/', payload)
        self.assertEqual(response.status_code, 200)
        self.user.refresh_from_db()
        self.assertTrue(self.user.check_password(payload['password']))
        self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', payload).status_code, 400)

    def test_unknown_email_has_same_public_response(self):
        known = self.client.post('/api/auth/password-reset/', {'email': self.user.email})
        unknown = self.client.post('/api/auth/password-reset/', {'email': 'unknown@example.test'})
        self.assertEqual(known.data, unknown.data)
        self.assertEqual(len(mail.outbox), 1)

    @override_settings(EMAIL_HOST='')
    def test_missing_email_configuration_returns_service_error(self):
        response = self.client.post('/api/auth/password-reset/', {'email': self.user.email})
        self.assertEqual(response.status_code, 503)

    def test_bad_and_expired_tokens_are_rejected(self):
        payload = self.request_link()
        self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', {**payload, 'token': 'bad'}).status_code, 400)
        self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', {**payload, 'uid': 'bad'}).status_code, 400)
        future = default_token_generator._now() + timedelta(hours=2)
        with patch.object(default_token_generator, '_now', return_value=future):
            self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', payload).status_code, 400)

    def test_short_password_does_not_consume_token(self):
        payload = self.request_link()
        self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', {**payload, 'password': 'short'}).status_code, 400)
        self.assertEqual(self.client.post('/api/auth/password-reset/confirm/', payload).status_code, 200)

    def test_request_rate_is_limited(self):
        for _ in range(5):
            self.assertEqual(self.client.post('/api/auth/password-reset/', {'email': 'unknown@example.test'}).status_code, 200)
        self.assertEqual(self.client.post('/api/auth/password-reset/', {'email': 'unknown@example.test'}).status_code, 429)


class WalletAddressTests(APITestCase):
    def setUp(self):
        self.user = User.create_user('wallet@example.test', 'test-password', 'Test', 'User')
        self.client.force_authenticate(self.user)

    def test_wallet_endpoint_rejects_phrase_and_private_key(self):
        for secret in [' '.join(['word'] * 12), '0x' + 'a' * 64]:
            response = self.client.post('/api/wallet/connect/', {'wallet_name': 'Browser wallet', 'wallet_number': secret})
            self.assertEqual(response.status_code, 400)
        self.user.refresh_from_db()
        self.assertIsNone(self.user.wallet_number)

    def test_public_address_can_be_saved_and_disconnected(self):
        address = '0x' + '1' * 40
        response = self.client.post('/api/wallet/connect/', {'wallet_name': 'Browser wallet', 'wallet_number': address})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['wallet_number'], address)
        self.assertTrue(self.client.get('/api/wallet/status/').data['wallet_connected'])
        self.assertEqual(self.client.delete('/api/wallet/disconnect/').status_code, 200)
        self.assertFalse(self.client.get('/api/wallet/status/').data['wallet_connected'])

    def test_legacy_non_address_values_are_not_exposed(self):
        self.user.wallet_name = 'Legacy wallet'
        self.user.wallet_number = ' '.join(['word'] * 12)
        self.user.save()
        self.assertIsNone(UserProfileSerializer(self.user).data['wallet_number'])
        self.assertFalse(self.client.get('/api/wallet/status/').data['wallet_connected'])

    def test_profile_update_cannot_bypass_wallet_validation(self):
        self.client.put('/api/profile/edit/', {'first_name': 'Test', 'last_name': 'User', 'wallet_number': ' '.join(['word'] * 12)}, format='json')
        self.user.refresh_from_db()
        self.assertIsNone(self.user.wallet_number)
