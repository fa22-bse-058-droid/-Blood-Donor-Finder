from django.core.mail import send_mail
from django.conf import settings

def send_emergency_email(to_email, blood_type, hospital_name, contact_phone, severity):
    subject = f"🚨 LifeLink Emergency — {blood_type} Blood Needed"
    message = f"""
URGENT BLOOD REQUEST

Blood Type Needed: {blood_type}
Hospital: {hospital_name}
Severity: {severity.upper()}
Contact: {contact_phone}

Please respond immediately if you are available to donate.
Visit: http://localhost:5173/emergency

— LifeLink AI Team
    """
    try:
        send_mail(subject, message, settings.EMAIL_HOST_USER, [to_email])
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def send_welcome_email(to_email, username):
    subject = "Welcome to LifeLink AI"
    message = f"""
Hi {username},

Welcome to LifeLink AI — Pakistan's smart blood donor platform.

Your account has been created successfully.
Complete your donor profile to start saving lives!

Visit: http://localhost:5173/dashboard

— LifeLink AI Team
    """
    try:
        send_mail(subject, message, settings.EMAIL_HOST_USER, [to_email])
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False