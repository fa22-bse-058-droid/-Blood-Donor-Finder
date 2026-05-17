from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Hospital, BloodStock
from .serializers import HospitalSerializer, BloodStockSerializer

class HospitalProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        hospital, _ = Hospital.objects.get_or_create(
            user=self.request.user,
            defaults={
                'name': self.request.user.username,
                'address': '',
                'city': self.request.user.city,
                'phone': self.request.user.phone,
            }
        )
        return hospital

class HospitalListView(generics.ListAPIView):
    serializer_class = HospitalSerializer
    permission_classes = [IsAuthenticated]
    queryset = Hospital.objects.filter(
        is_verified=True
    ).prefetch_related('blood_stocks')

class BloodStockView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        hospital = Hospital.objects.get(user=request.user)
        stocks = BloodStock.objects.filter(hospital=hospital)
        return Response(BloodStockSerializer(stocks, many=True).data)

    def post(self, request):
        hospital = Hospital.objects.get(user=request.user)
        blood_type = request.data.get('blood_type')
        units = request.data.get('units_available', 0)

        stock, _ = BloodStock.objects.update_or_create(
            hospital=hospital,
            blood_type=blood_type,
            defaults={'units_available': units}
        )
        return Response(BloodStockSerializer(stock).data)