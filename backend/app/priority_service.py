def predict_priority(title: str, description: str) -> str:
    text = f"{title} {description}".lower()

    high_keywords = [
        "server down",
        "network down",
        "entire office",
        "all users",
        "security breach",
        "ransomware",
        "malware",
        "hacked",
        "data breach",
        "system outage",
        "cannot work",
        "critical",
        "urgent",
    ]

    medium_keywords = [
        "forgot password",
        "password reset",
        "account locked",
        "cannot login",
        "cannot log in",
        "access denied",
        "vpn",
        "software crash",
        "application crash",
        "cannot access",
        "email not working",
    ]

    for keyword in high_keywords:
        if keyword in text:
            return "High"

    for keyword in medium_keywords:
        if keyword in text:
            return "Medium"

    return "Low"