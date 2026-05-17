from datetime import datetime

def get_optimal_outreach_time():
    hour = datetime.now().hour
    if 8 <= hour <= 11:
        timing = 'excellent'
        reason = 'Morning hours — highest donor response rate'
    elif 17 <= hour <= 20:
        timing = 'good'
        reason = 'Evening hours — donors available after work'
    elif 0 <= hour <= 6:
        timing = 'poor'
        reason = 'Late night — low response expected'
    else:
        timing = 'moderate'
        reason = 'Moderate response expected at this time'

    return {
        'current_hour': hour,
        'timing_quality': timing,
        'reason': reason,
        'recommended_channels': (
            ['sms', 'email', 'push']
            if timing in ['excellent', 'good']
            else ['push']
        )
    }