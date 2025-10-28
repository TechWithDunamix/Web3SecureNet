from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from enum import Enum as PyEnum
from django.db.models import TextChoices


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


class AssetType(TextChoices):
    BTC = 'BTC', _('Bitcoin')
    ETH = 'ETH', _('Ethereum')
    TRX = 'TRX', _('Tron')
    SOL = 'SOL', _('Solana')
    XRP = 'XRP', _('XRP')
    USDT = 'USDT', _('Tether')
    USDC = 'USDC', _('USD Coin')
    OTHER = 'OTHER', _('Other')


class TransactionStatus(TextChoices):
    PENDING = 'PENDING', _('Pending')
    COMPLETED = 'COMPLETED', _('Completed')
    FAILED = 'FAILED', _('Failed')
    CANCELLED = 'CANCELLED', _('Cancelled')


class TransactionType(TextChoices):
    DEPOSIT = 'DEPOSIT', _('Deposit')
    WITHDRAWAL = 'WITHDRAWAL', _('Withdrawal')
    TRANSFER = 'TRANSFER', _('Transfer')
    SWAP = 'SWAP', _('Swap')
    FEE = 'FEE', _('Fee')


class Transaction(models.Model):
    """
    A model to track all financial transactions in the system.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='transactions',
        verbose_name=_('user')
    )
    transaction_id = models.CharField(
        _('transaction ID'),
        max_length=255,
        unique=True,
        help_text=_('Unique identifier for the transaction')
    )
    transaction_type = models.CharField(
        _('transaction type'),
        max_length=20,
        choices=TransactionType.choices,
        default=TransactionType.DEPOSIT
    )
    status = models.CharField(
        _('status'),
        max_length=20,
        choices=TransactionStatus.choices,
        default=TransactionStatus.PENDING
    )
    amount = models.DecimalField(
        _('amount'),
        max_digits=36,
        decimal_places=18,
        help_text=_('Amount in the original currency')
    )
   
    
    fee = models.DecimalField(
        _('transaction fee'),
        max_digits=18,
        decimal_places=8,
        default=0,
        help_text=_('Transaction fee in the asset currency')
    )
   
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    completed_at = models.DateTimeField(_('completed at'), null=True, blank=True)

    class Meta:
        verbose_name = _('transaction')
        verbose_name_plural = _('transactions')
        ordering = ['-created_at']

    def __str__(self):
        return f"TRX - {self.amount}  ({self.status})"

    def save(self, *args, **kwargs):
        if self.status == TransactionStatus.COMPLETED and not self.completed_at:
            self.completed_at = timezone.now()
        super().save(*args, **kwargs)


class Deposit(models.Model):
    """
    A model specifically for tracking deposit transactions.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='deposits',
        verbose_name=_('user')
    )
    transaction_id = models.CharField(
        _('transaction ID'),
        max_length=255,
        unique=True,
        help_text=_('Unique identifier for the transaction')
    )

    deposit_address = models.CharField(
        _('deposit address'),
        max_length=255,
        help_text=_('The address where the deposit was sent')
    )
    amount = models.DecimalField(
        _('amount'),
        max_digits=36,
        decimal_places=18,
        help_text=_('Amount in the original currency')
    )
    asset_type = models.CharField(
        _('asset type'),
        max_length=10,
        choices=AssetType.choices,
        default=AssetType.USDT
    )

    tx_hash = models.CharField(
        _('transaction hash'),
        max_length=255,
        unique=True,
        null=True,
        blank=True,
        help_text=_('Blockchain transaction hash')
    )
    
    is_approved = models.BooleanField(
        _('is approved'),
        default=False,
        help_text=_('Whether the deposit has been approved by admin')
    )
    
    approved_at = models.DateTimeField(_('approved at'), null=True, blank=True)
    notes = models.TextField(_('admin notes'), blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    

    class Meta:
        verbose_name = _('deposit')
        verbose_name_plural = _('deposits')
        ordering = ['-created_at']

    def __str__(self):
        return f"Deposit of {self.amount} {self.asset_type} "

    def save(self, *args, **kwargs):
        if self.is_approved and not self.approved_at:
            self.approved_at = timezone.now()
        super().save(*args, **kwargs)