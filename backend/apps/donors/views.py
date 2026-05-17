from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import DonorProfile, DonationRecord
from .serializers import DonorProfileSerializer, DonationRecordSerializer
from .matching import find_matches

class DonorProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, _ = DonorProfile.objects.get_or_create(user=self.request.user)
        return profile

class DonorListView(generics.ListAPIView):
    serializer_class = DonorProfileSerializer
    permission_classes = [IsAuthenticated]
    queryset = DonorProfile.objects.filter(
        is_available=True
    ).select_related('user')

class SmartMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        blood_type = request.data.get('blood_type')
        lat = request.data.get('latitude')
        lon = request.data.get('longitude')
        radius = request.data.get('radius_km', 50)

        if not all([blood_type, lat, lon]):
            return Response(
                {'error': 'blood_type, latitude, longitude required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        donors = find_matches(blood_type, float(lat), float(lon), float(radius))
        return Response(DonorProfileSerializer(donors, many=True).data)

class DonationRecordListView(generics.ListCreateAPIView):
    serializer_class = DonationRecordSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        profile, _ = DonorProfile.objects.get_or_create(user=self.request.user)
        return DonationRecord.objects.filter(donor=profile)