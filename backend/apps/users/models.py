

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('donor', 'Donor'),
        ('hospital', 'Hospital'),
        ('admin', 'Admin'),
        ('emergency_coordinator', 'Emergency Coordinator'),
    ]
    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default='donor')
    phone = models.CharField(max_length=20, blank=True)
    city = models.CharField(max_length=100, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"