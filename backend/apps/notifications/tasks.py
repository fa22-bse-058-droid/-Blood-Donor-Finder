from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

@shared_task
def send_sms_alert(to_phone, message):
    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(body=message, from_=settings.TWILIO_PHONE, to=to_phone)
        return f"SMS sent to {to_phone}"
    except Exception as e:
        return f"SMS failed: {str(e)}"

@shared_task
def send_email_alert(subject, message, recipient_list):
    try:
        send_mail(subject, message, settings.EMAIL_HOST_USER, recipient_list)
        return f"Email sent to {recipient_list}"
    except Exception as e:
        return f"Email failed: {str(e)}"

@shared_task
def notify_nearby_donors(emergency_id):
    from apps.emergency.models import EmergencyRequest
    from apps.donors.matching import find_matches
    from apps.donors.models import DonorProfile

    try:
        req = EmergencyRequest.objects.get(id=emergency_id)
        if req.latitude and req.longitude:
            donors = find_matches(req.blood_type, req.latitude, req.longitude, radius_km=30)
            for donor in donors:
                user = donor.user
                msg = (f"URGENT: {req.blood_type} blood needed at {req.hospital_name}. "
                       f"Severity: {req.severity.upper()}. Contact: {req.contact_phone}")
                if user.phone:
                    send_sms_alert.delay(user.phone, msg)
                if user.email:
                    send_email_alert.delay("LifeLink Emergency Alert", msg, [user.email])
    except EmergencyRequest.DoesNotExist:
        pass