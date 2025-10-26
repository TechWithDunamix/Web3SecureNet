from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom User model that uses email as the primary identifier instead of username.
    """
    username = None  # Remove username field
    email = models.EmailField(_('email address'), unique=True)
    first_name = models.CharField(_('first name'), max_length=150)
    last_name = models.CharField(_('last name'), max_length=150)
    address = models.TextField(_('address'), blank=True, null=True)
    verified = models.BooleanField(_('verified'), default=False)
    wallet_name = models.CharField(_('wallet name'), max_length=100, blank=True, null=True)
    wallet_number = models.CharField(_('wallet number'), max_length=200, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('user')
        verbose_name_plural = _('users')

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.email})"

    @classmethod
    def create_user(cls, email, password, first_name, last_name):
        user = cls.objects.create(email=email, first_name=first_name, last_name=last_name)
        user.set_password(password)
        user.save()
        return user