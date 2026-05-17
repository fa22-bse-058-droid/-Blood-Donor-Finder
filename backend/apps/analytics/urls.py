from django.urls import path
from .views import (
    DashboardStatsView,
    BloodTypeStatsView,
    CityStatsView,
    ShortagePredictonView
)

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view()),
    path('blood-types/', BloodTypeStatsView.as_view()),
    path('cities/', CityStatsView.as_view()),
    path('shortage/', ShortagePredictonView.as_view()),
]