import secrets

from apps.config import settings


async def generate_numeric_otp(length=settings.OTP_LENGTH):
    """Generate a numeric OTP of a specified length."""
    otp = "".join(secrets.choice("0123456789") for _ in range(length))
    return otp
