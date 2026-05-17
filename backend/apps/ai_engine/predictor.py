from collections import Counter
from datetime import date, timedelta

def predict_shortage(blood_type, city, days_ahead=7):
    """
    Simple heuristic shortage predictor.
    Replace with trained ML model in production.
    """
    from apps.emergency.models import EmergencyRequest
    from apps.donors.models import DonorProfile

    thirty_days_ago = date.today() - timedelta(days=30)
    recent_requests = EmergencyRequest.objects.filter(
        blood_type=blood_type,
        created_at__date__gte=thirty_days_ago,
        status__in=['pending','verified']
    ).count()

    available_donors = DonorProfile.objects.filter(
        blood_type=blood_type,
        is_available=True,
        user__city__icontains=city
    ).count()

    demand_ratio = recent_requests / max(available_donors, 1)
    risk = 'critical' if demand_ratio > 3 else 'high' if demand_ratio > 1.5 else 'medium' if demand_ratio > 0.5 else 'low'
    return {'blood_type': blood_type, 'city': city, 'demand_ratio': round(demand_ratio, 2), 'risk_level': risk}

def detect_spam(request_data):
    """Basic spam detection heuristic."""
    score = 0.0
    notes = request_data.get('notes', '')
    contact = request_data.get('contact_phone', '')

    if len(notes) < 10:
        score += 0.3
    if not contact or len(contact) < 10:
        score += 0.4
    if request_data.get('units_needed', 450) > 2000:
        score += 0.3

    return {'spam_score': score, 'is_spam': score > 0.7}