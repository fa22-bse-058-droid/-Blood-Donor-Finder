from rest_framework import serializers

class DashboardStatsSerializer(serializers.Serializer):
    total_donors = serializers.IntegerField()
    available_donors = serializers.IntegerField()
    total_emergencies = serializers.IntegerField()
    active_emergencies = serializers.IntegerField()
    fulfilled_emergencies = serializers.IntegerField()
    total_donations = serializers.IntegerField()
    total_hospitals = serializers.IntegerField()

class BloodTypeStatsSerializer(serializers.Serializer):
    blood_type = serializers.CharField()
    donor_count = serializers.IntegerField()
    emergency_count = serializers.IntegerField()

class CityStatsSerializer(serializers.Serializer):
    city = serializers.CharField()
    donor_count = serializers.IntegerField()
    emergency_count = serializers.IntegerField()