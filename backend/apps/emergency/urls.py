from django.urls import path
from .views import (
    EmergencyRequestListView,
    EmergencyRequestDetailView,
    VerifyEmergencyView,
    CancelEmergencyView
)

urlpatterns = [
    path('requests/', EmergencyRequestListView.as_view()),
    path('requests/<int:pk>/', EmergencyRequestDetailView.as_view()),
    path('requests/<int:pk>/verify/', VerifyEmergencyView.as_view()),
    path('requests/<int:pk>/cancel/', CancelEmergencyView.as_view()),
]