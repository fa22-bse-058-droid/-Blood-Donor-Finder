from django.conf import settings

def send_sms(to_phone, message):
    try:
        from twilio.rest import Client
        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            body=message,
            from_=settings.TWILIO_PHONE,
            to=to_phone
        )
        return True
    except Exception as e:
        print(f"SMS error: {e}")
        return False

def send_emergency_sms(to_phone, blood_type, hospital_name, severity):
    message = (
        f"LIFELINK EMERGENCY: {blood_type} blood urgently needed "
        f"at {hospital_name}. Severity: {severity.upper()}. "
        f"Open LifeLink app to respond."
    )
    return send_sms(to_phone, message)