from django.urls import path
from .views import DonorProfileView, DonorListView, SmartMatchView, DonationRecordListView

urlpatterns = [
    path('profile/', DonorProfileView.as_view()),
    path('list/', DonorListView.as_view()),
    path('match/', SmartMatchView.as_view()),
    path('records/', DonationRecordListView.as_view()),
]