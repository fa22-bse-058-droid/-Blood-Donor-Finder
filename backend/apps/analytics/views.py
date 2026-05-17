from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from apps.donors.models import DonorProfile, DonationRecord
from apps.emergency.models import EmergencyRequest
from apps.hospitals.models import Hospital
from apps.users.models import User

class DashboardStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'total_donors': DonorProfile.objects.count(),
            'available_donors': DonorProfile.objects.filter(is_available=True).count(),
            'total_emergencies': EmergencyRequest.objects.count(),
            'active_emergencies': EmergencyRequest.objects.filter(
                status__in=['pending', 'verified']
            ).count(),
            'fulfilled_emergencies': EmergencyRequest.objects.filter(
                status='fulfilled'
            ).count(),
            'total_donations': DonationRecord.objects.count(),
            'total_hospitals': Hospital.objects.count(),
        })

class BloodTypeStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        blood_types = ['A+','A-','B+','B-','AB+','AB-','O+','O-']
        result = []
        for bt in blood_types:
            result.append({
                'blood_type': bt,
                'donor_count': DonorProfile.objects.filter(blood_type=bt).count(),
                'emergency_count': EmergencyRequest.objects.filter(
                    blood_type=bt,
                    is_spam=False
                ).count(),
            })
        return Response(result)

class CityStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        cities = User.objects.exclude(city='').values('city').annotate(
            donor_count=Count('donor_profile')
        ).order_by('-donor_count')[:10]

        result = []
        for c in cities:
            result.append({
                'city': c['city'],
                'donor_count': c['donor_count'],
                'emergency_count': EmergencyRequest.objects.filter(
                    hospital_address__icontains=c['city'],
                    is_spam=False
                ).count(),
            })
        return Response(result)

class ShortagePredictonView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from apps.ai_engine.predictor import predict_shortage
        blood_type = request.query_params.get('blood_type', 'O+')
        city = request.query_params.get('city', '')
        return Response(predict_shortage(blood_type, city))