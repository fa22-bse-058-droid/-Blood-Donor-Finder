from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'role', 'city', 'is_verified', 'date_joined']
    list_filter = ['role', 'is_verified', 'is_active']
    search_fields = ['username', 'email', 'city']
    fieldsets = UserAdmin.fieldsets + (
        ('LifeLink Info', {'fields': ('role', 'phone', 'city', 'latitude', 'longitude', 'is_verified')}),
    )