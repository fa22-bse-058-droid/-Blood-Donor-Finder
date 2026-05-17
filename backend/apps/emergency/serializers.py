from rest_framework import serializers
from .models import EmergencyRequest

class EmergencyRequestSerializer(serializers.ModelSerializer):
    requested_by_username = serializers.CharField(
        source='requested_by.username',
        read_only=True
    )
    verified_by_username = serializers.CharField(
        source='verified_by.username',
        read_only=True
    )

    class Meta:
        model = EmergencyRequest
        fields = [
            'id', 'requested_by', 'requested_by_username',
            'blood_type', 'units_needed', 'severity', 'status',
            'hospital_name', 'hospital_address', 'latitude', 'longitude',
            'patient_name', 'contact_phone', 'notes',
            'is_spam', 'spam_score',
            'verified_by', 'verified_by_username',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'requested_by', 'is_spam',
            'spam_score', 'verified_by', 'created_at', 'updated_at'
        ]