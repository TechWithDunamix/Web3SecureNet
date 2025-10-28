from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils.translation import gettext_lazy as _
from .models import User, Transaction, Deposit

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
        (_('Wallet Info'), {'fields': ('wallet_name', 'wallet_number')}),
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
        updated = queryset.update(is_approved=True)
        self.message_user(request, f"{updated} deposit(s) approved successfully.")
    approve_deposits.short_description = "Approve selected deposits"

# Remove default admin site
