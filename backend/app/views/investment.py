from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from django.db import transaction
from ..models import (
    Investment, Transaction,
    TransactionStatus, TransactionType, AssetType
)
from ..serializers import (
    InvestmentSerializer,
    CreateInvestmentSerializer
)

class InvestmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        investments = Investment.objects.filter(
            user=request.user
        ).select_related('transaction').order_by('-created')
        
        status_filter = request.query_params.get('status')
        if status_filter:
            investments = investments.filter(status=status_filter.upper())
            
        serializer = InvestmentSerializer(investments, many=True)
        return Response(serializer.data)
    
    @transaction.atomic
    def post(self, request):
        serializer = CreateInvestmentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        plan_name = serializer.validated_data['plan_name']
        amount = serializer.validated_data['amount']
        expected_roi = serializer.validated_data['expected_roi']
        duration_days = serializer.validated_data['duration_days']
        
        # Create transaction
        transaction_obj = Transaction.objects.create(
            user=request.user,
            amount=amount,
            transaction_type=TransactionType.INVESTMENT,
            status=TransactionStatus.PENDING,
            asset_type=AssetType.USDT,  # Default to USDT
            notes=f"New investment in {plan_name}"
        )
        
        try:
            # Create investment
            investment = Investment.objects.create(
                user=request.user,
                plan_name=plan_name,
                transaction=transaction_obj,
                amount=amount,
                expected_roi=expected_roi,
                duration_days=duration_days,
                end_date=timezone.now() + timezone.timedelta(days=duration_days)
            )
            
            # Update transaction status
            transaction_obj.status = TransactionStatus.COMPLETED
            transaction_obj.save()
            
            return Response(
                InvestmentSerializer(investment).data,
                status=status.HTTP_201_CREATED
            )
            
        except Exception as e:
            # If anything fails, the transaction will be rolled back
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
