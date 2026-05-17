from django.contrib import admin
from .models import EmergencyRequest

@admin.register(EmergencyRequest)
class EmergencyRequestAdmin(admin.ModelAdmin):
    list_display = [
        'blood_type', 'severity', 'status',
        'hospital_name', 'contact_phone',
        'is_spam', 'created_at'
    ]
    list_filter = ['severity', 'status', 'blood_type', 'is_spam']
    search_fields = ['hospital_name', 'patient_name', 'contact_phone']
    readonly_fields = ['spam_score', 'is_spam', 'created_at', 'updated_at']

    actions = ['mark_verified', 'mark_fulfilled']

    def mark_verified(self, request, queryset):
        queryset.update(status='verified')
    mark_verified.short_description = 'Mark selected as Verified'

    def mark_fulfilled(self, request, queryset):
        queryset.update(status='fulfilled')
    mark_fulfilled.short_description = 'Mark selected as Fulfilled'