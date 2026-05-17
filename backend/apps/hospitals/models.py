from django.db import models
from apps.users.models import User

class Hospital(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='hospital_profile')
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class BloodStock(models.Model):
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='blood_stocks')
    blood_type = models.CharField(max_length=5)
    units_available = models.FloatField(default=0.0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['hospital', 'blood_type']

    def __str__(self):
        return f"{self.hospital.name} - {self.blood_type}: {self.units_available}ml"