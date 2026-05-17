from rest_framework import serializers
from .models import Hospital, BloodStock

class BloodStockSerializer(serializers.ModelSerializer):
    class Meta:
        model = BloodStock
        fields = ['id', 'blood_type', 'units_available', 'last_updated']
        read_only_fields = ['id', 'last_updated']

class HospitalSerializer(serializers.ModelSerializer):
    blood_stocks = BloodStockSerializer(many=True, read_only=True)

    class Meta:
        model = Hospital
        fields = ['id', 'name', 'address', 'city', 'phone',
                  'latitude', 'longitude', 'is_verified',
                  'blood_stocks', 'created_at']
        read_only_fields = ['id', 'is_verified', 'created_at']