from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import EmergencyRequest
from .serializers import EmergencyRequestSerializer
from apps.ai_engine.spam_detector import detect_spam
from apps.notifications.tasks import notify_nearby_donors

class EmergencyRequestListView(generics.ListCreateAPIView):
    serializer_class = EmergencyRequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = EmergencyRequest.objects.filter(is_spam=False)
        severity = self.request.query_params.get('severity')
        status_filter = self.request.query_params.get('status')
        blood_type = self.request.query_params.get('blood_type')

        if severity:
            qs = qs.filter(severity=severity)
        if status_filter:
            qs = qs.filter(status=status_filter)
        if blood_type:
            qs = qs.filter(blood_type=blood_type)
        return qs

    def perform_create(self, serializer):
        spam_result = detect_spam(self.request.data)
        instance = serializer.save(
            requested_by=self.request.user,
            is_spam=spam_result['is_spam'],
            spam_score=spam_result['spam_score']
        )
        if not instance.is_spam:
            notify_nearby_donors.delay(instance.id)

class EmergencyRequestDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = EmergencyRequestSerializer
    permission_classes = [IsAuthenticated]
    queryset = EmergencyRequest.objects.all()

class VerifyEmergencyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            emergency = EmergencyRequest.objects.get(pk=pk)
            emergency.status = 'verified'
            emergency.verified_by = request.user
            emergency.save()
            return Response({'message': 'Emergency verified successfully'})
        except EmergencyRequest.DoesNotExist:
            return Response(
                {'error': 'Not found'},
                status=status.HTTP_404_NOT_FOUND
            )

class CancelEmergencyView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        try:
            emergency = EmergencyRequest.objects.get(
                pk=pk,
                requested_by=request.user
            )
            emergency.status = 'cancelled'
            emergency.save()
            return Response({'message': 'Emergency cancelled'})
        except EmergencyRequest.DoesNotExist:
            return Response(
                {'error': 'Not found'},
                status=status.HTTP_404_NOT_FOUND
            )