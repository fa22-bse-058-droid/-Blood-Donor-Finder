from django.db import models
from apps.users.models import User

class EmergencyRequest(models.Model):
    SEVERITY = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical')
    ]
    STATUS = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('fulfilled', 'Fulfilled'),
        ('cancelled', 'Cancelled')
    ]

    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='emergency_requests')
    blood_type = models.CharField(max_length=5)
    units_needed = models.FloatField(default=450.0)
    severity = models.CharField(max_length=10, choices=SEVERITY, default='high')
    status = models.CharField(max_length=15, choices=STATUS, default='pending')
    hospital_name = models.CharField(max_length=200)
    hospital_address = models.TextField()
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    patient_name = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=20)
    notes = models.TextField(blank=True)
    is_spam = models.BooleanField(default=False)
    spam_score = models.FloatField(default=0.0)
    verified_by = models.ForeignKey(
        User, on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='verified_emergencies'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.blood_type} - {self.severity} - {self.status}"