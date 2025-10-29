from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db import transaction as db_transaction

from ..models import Withdrawal, Transaction, TransactionStatus, TransactionType
from ..serializers import WithdrawalSerializer

class WithdrawalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        # Get user's balance (you'll need to implement this based on your user model)
        user = request.user
        
        # Prepare withdrawal data
        withdrawal_data = {
            'user': user.id,
            'wallet_address': request.data.get('address'),
            'amount': request.data.get('amount'),
            'asset_type': request.data.get('symbol'),
            'network': request.data.get('network'),
            'status': TransactionStatus.PENDING
        }
        
        # Validate withdrawal data
        serializer = WithdrawalSerializer(data=withdrawal_data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        # Check if user has sufficient balance
        # Note: You'll need to implement get_user_balance based on your user model
        if user.balance < float(withdrawal_data['amount']):
            return Response(
                {'error': 'Insufficient balance'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            with db_transaction.atomic():
                # Create withdrawal record
                withdrawal = serializer.save()
                
                # Update user balance (you'll need to implement this)
                user.balance -= withdrawal.amount
                user.save(update_fields=['balance'])
                
                # In a real application, you would integrate with a payment processor here
                # For now, we'll just mark it as completed after a short delay
                
                return Response(
                    {
                        'message': 'Withdrawal request received',
                        'withdrawal_id': withdrawal.id,
                        'status': withdrawal.status
                    },
                    status=status.HTTP_201_CREATED
                )
                
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
