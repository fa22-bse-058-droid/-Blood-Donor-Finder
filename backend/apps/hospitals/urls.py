from django.urls import path
from .views import HospitalProfileView, HospitalListView, BloodStockView

urlpatterns = [
    path('profile/', HospitalProfileView.as_view()),
    path('list/', HospitalListView.as_view()),
    path('stock/', BloodStockView.as_view()),
]