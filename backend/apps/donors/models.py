from django.db import models
from apps.users.models import User

BLOOD_TYPES = ['A+','A-','B+','B-','AB+','AB-','O+','O-']

class DonorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='donor_profile')
    blood_type = models.CharField(max_length=5, choices=[(b,b) for b in BLOOD_TYPES])
    is_available = models.BooleanField(default=True)
    last_donation_date = models.DateField(null=True, blank=True)
    total_donations = models.IntegerField(default=0)
    reputation_score = models.FloatField(default=0.0)
    is_verified_donor = models.BooleanField(default=False)
    qr_code = models.ImageField(upload_to='qr_codes/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.blood_type}"

class DonationRecord(models.Model):
    donor = models.ForeignKey(DonorProfile, on_delete=models.CASCADE, related_name='records')
    hospital = models.ForeignKey('hospitals.Hospital', on_delete=models.SET_NULL, null=True)
    donation_date = models.DateField()
    blood_units = models.FloatField(default=450.0)
    certificate_issued = models.BooleanField(default=False)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)