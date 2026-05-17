def detect_spam(request_data):
    score = 0.0
    notes = request_data.get('notes', '')
    contact = request_data.get('contact_phone', '')
    units = request_data.get('units_needed', 450)
    hospital = request_data.get('hospital_name', '')
    address = request_data.get('hospital_address', '')

    if len(notes) < 10:
        score += 0.2
    if not contact or len(contact) < 10:
        score += 0.4
    if units > 2000:
        score += 0.3
    if len(hospital) < 3:
        score += 0.2
    if len(address) < 5:
        score += 0.2

    score = min(score, 1.0)

    return {
        'spam_score': round(score, 2),
        'is_spam': score > 0.7
    }