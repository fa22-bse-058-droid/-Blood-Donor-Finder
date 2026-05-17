from rest_framework import serializers
from .models import DonorProfile, DonationRecord

class DonorProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    city = serializers.CharField(source='user.city', read_only=True)
    phone = serializers.CharField(source='user.phone', read_only=True)
    latitude = serializers.FloatField(source='user.latitude', read_only=True)
    longitude = serializers.FloatField(source='user.longitude', read_only=True)

    class Meta:
        model = DonorProfile
        fields = ['id', 'username', 'city', 'phone', 'latitude', 'longitude',
                  'blood_type', 'is_available', 'last_donation_date',
                  'total_donations', 'reputation_score', 'is_verified_donor']
        read_only_fields = ['id', 'total_donations', 'reputation_score']

class DonationRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = DonationRecord
        fields = '__all__'
        read_only_fields = ['id', 'created_at']