from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import User, Transaction, Deposit, Withdrawal, Investment, InvestmentStatus

# Custom Admin Site
class CustomAdminSite(admin.AdminSite):
    site_header = 'Web3SecureNet Admin'
    site_title = 'Web3SecureNet Administration'
    index_title = 'Dashboard'
    site_url = '/'

admin_site = CustomAdminSite(name='custom_admin')

# Custom User Admin
@admin.register(User, site=admin_site)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_staff', 'is_active', 'date_joined')
    list_filter = ('is_staff', 'is_active', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('-date_joined',)
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'address')}),
        (_('Wallet Info'), {'fields': ('wallet_name', 'wallet_number','balance')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'is_staff', 'is_active'),
        }),
    )
    readonly_fields = ('date_joined', 'last_login')

# Transaction Admin
@admin.register(Transaction, site=admin_site)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'transaction_type', 'amount', 'status', 'created_at', 'user_email')
    list_filter = ('transaction_type', 'status', 'created_at')
    search_fields = ('transaction_id', 'user__email')
    readonly_fields = ('transaction_id', 'created_at', 'updated_at', 'completed_at')
    date_hierarchy = 'created_at'
    
    def user_email(self, obj):
        return obj.user.email
    user_email.short_description = 'User Email'

# Deposit Admin
@admin.register(Deposit, site=admin_site)
class DepositAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'get_user_email', 'amount', 'asset_type', 'is_approved', 'created_at')
    list_filter = ('is_approved', 'asset_type', 'created_at')
    search_fields = ('transaction__transaction_id', 'user__email')
    readonly_fields = ('transaction_id', 'created_at', 'approved_at')
    date_hierarchy = 'created_at'
    actions = ['approve_deposits']
    
    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'
    
    def transaction_id(self, obj):
        return obj.transaction.transaction_id
    transaction_id.short_description = 'Transaction ID'
    
    def approve_deposits(self, request, queryset):
        updated = queryset.filter(is_approved=False).update(is_approved=True)
        self.message_user(request, f"Successfully approved {updated} deposit(s).")
    approve_deposits.short_description = "Approve selected deposits"

# Withdrawal Admin
@admin.register(Withdrawal, site=admin_site)
class WithdrawalAdmin(admin.ModelAdmin):
    list_display = ('id', 'transaction_id', 'get_user_email', 'amount','is_approved', 'created_at')
    list_filter = ('is_approved',  'created_at')
    search_fields = ('transaction__transaction_id', 'user__email')
    readonly_fields = ('transaction_id', 'created_at', 'approved_at')
    date_hierarchy = 'created_at'
    actions = ['approve_withdrawals']

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'

    def transaction_id(self, obj):
        return obj.transaction.transaction_id
    transaction_id.short_description = 'Transaction ID'

    def approve_withdrawals(self, request, queryset):
        updated = queryset.filter(is_approved=False).update(is_approved=True)
        self.message_user(request, f"Successfully approved {updated} withdrawal(s).")
    approve_withdrawals.short_description = "Approve selected withdrawals"

# Investment Admin
@admin.register(Investment, site=admin_site)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_user_email', 'plan_name', 'amount', 'status', 'start_date', 'end_date')
    list_filter = ('status', 'plan_name', 'start_date')
    search_fields = ('user__email', 'plan_name', 'transaction__transaction_id')
    readonly_fields = ('created_at', 'updated_at', 'last_payout', 'next_payout')
    date_hierarchy = 'created_at'
    actions = ['mark_as_active', 'mark_as_completed', 'mark_as_cancelled']

    def get_user_email(self, obj):
        return obj.user.email
    get_user_email.short_description = 'User Email'

    def mark_as_active(self, request, queryset):
        updated = queryset.filter(status__in=[InvestmentStatus.PENDING, InvestmentStatus.CANCELLED])\
                        .update(status=InvestmentStatus.ACTIVE)
        self.message_user(request, f"Marked {updated} investment(s) as active.")
    mark_as_active.short_description = "Mark selected as Active"

    def mark_as_completed(self, request, queryset):
        updated = queryset.update(status=InvestmentStatus.COMPLETED)
        self.message_user(request, f"Marked {updated} investment(s) as completed.")
    mark_as_completed.short_description = "Mark selected as Completed"

    def mark_as_cancelled(self, request, queryset):
        updated = queryset.update(status=InvestmentStatus.CANCELLED)
        self.message_user(request, f"Marked {updated} investment(s) as cancelled.")
    mark_as_cancelled.short_description = "Mark selected as Cancelled"

# Remove default admin site
