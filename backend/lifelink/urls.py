from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/donors/', include('apps.donors.urls')),
    path('api/hospitals/', include('apps.hospitals.urls')),
    path('api/emergency/', include('apps.emergency.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
]