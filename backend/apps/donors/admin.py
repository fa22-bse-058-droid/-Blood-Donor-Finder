from django.contrib import admin
from .models import DonorProfile, DonationRecord

@admin.register(DonorProfile)
class DonorProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'blood_type', 'is_available', 'last_donation_date', 'reputation_score', 'is_verified_donor']
    list_filter = ['blood_type', 'is_available', 'is_verified_donor']
    search_fields = ['user__username', 'user__city']

@admin.register(DonationRecord)
class DonationRecordAdmin(admin.ModelAdmin):
    list_display = ['donor', 'hospital', 'donation_date', 'blood_units', 'certificate_issued']
    list_filter = ['certificate_issued']
    search_fields = ['donor__user__username']