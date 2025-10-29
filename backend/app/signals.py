from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.db import transaction
from .models import Transaction, Withdrawal, Deposit, Investment, User, TransactionStatus,InvestmentStatus


@receiver(post_save, sender=Withdrawal)
def handle_withdrawal_status(sender, instance, created, **kwargs):
    """
    Handle withdrawal status changes and update user balance when approved.
    """
    if not created and instance.is_approved and not instance.approved_at:
        try:
            with transaction.atomic():
                # Update the transaction status
                txn = Transaction.objects.get(id=instance.transaction_id)
                txn.status = TransactionStatus.COMPLETED
                txn.completed_at = timezone.now()
                txn.save(update_fields=['status', 'completed_at'])

                # Deduct from user balance
                user = instance.user
                user.balance -= instance.amount
                user.save(update_fields=['balance'])

                # Mark withdrawal as processed
                instance.approved_at = timezone.now()
                instance.save(update_fields=['approved_at'])

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error processing withdrawal {instance.id}: {str(e)}")
            raise e


@receiver(post_save, sender=Deposit)
def handle_deposit_status(sender, instance, created, **kwargs):
    """
    Handle deposit status changes and update user balance when approved.
    """
    if not created and instance.is_approved and not instance.approved_at:
        try:
            with transaction.atomic():
                # Update the transaction status
                txn = Transaction.objects.get(id=instance.transaction_id)
                txn.status = TransactionStatus.COMPLETED
                txn.completed_at = timezone.now()
                txn.save(update_fields=['status', 'completed_at'])

                # Add to user balance
                user = instance.user
                user.balance += instance.amount
                user.save(update_fields=['balance'])

                # Mark deposit as processed
                instance.approved_at = timezone.now()
                instance.save(update_fields=['approved_at'])

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error processing deposit {instance.id}: {str(e)}")
            raise


@receiver(post_save, sender=Investment)
def handle_investment_status(sender, instance, created, **kwargs):
    """
    Handle investment status changes and update transaction status accordingly.
    """
    if not created:
        try:
            with transaction.atomic():
                txn = Transaction.objects.get(id=instance.transaction_id)

                if instance.status == InvestmentStatus.ACTIVE:
                    txn.status = TransactionStatus.COMPLETED
                    txn.completed_at = timezone.now()
                elif instance.status in [
                    InvestmentStatus.CANCELLED,
                    InvestmentStatus.PENDING
                ]:
                    txn.status = TransactionStatus.PENDING
                else:
                    txn.status = TransactionStatus.COMPLETED

                txn.save(update_fields=['status', 'completed_at'])

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error updating investment transaction {instance.id}: {str(e)}")
            raise
