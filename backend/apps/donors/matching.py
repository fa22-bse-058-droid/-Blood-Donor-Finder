import math
from datetime import date, timedelta
from .models import DonorProfile

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

COMPATIBLE = {
    'O-': ['O-','O+','A-','A+','B-','B+','AB-','AB+'],
    'O+': ['O+','A+','B+','AB+'],
    'A-': ['A-','A+','AB-','AB+'],
    'A+': ['A+','AB+'],
    'B-': ['B-','B+','AB-','AB+'],
    'B+': ['B+','AB+'],
    'AB-': ['AB-','AB+'],
    'AB+': ['AB+'],
}

def find_matches(blood_type, lat, lon, radius_km=50, limit=10):
    eligible_blood = [bt for bt, can_give_to in COMPATIBLE.items() if blood_type in can_give_to]
    sixty_days_ago = date.today() - timedelta(days=60)
    qs = DonorProfile.objects.filter(
        blood_type__in=eligible_blood,
        is_available=True,
        user__latitude__isnull=False,
    ).exclude(last_donation_date__gte=sixty_days_ago).select_related('user')

    results = []
    for donor in qs:
        d = haversine(lat, lon, donor.user.latitude, donor.user.longitude)
        if d <= radius_km:
            results.append((d, donor))

    results.sort(key=lambda x: (x[0], -x[1].reputation_score))
    return [donor for _, donor in results[:limit]]