import os

from starlette.config import Config
from starlette.datastructures import CommaSeparatedStrings, Secret

env = os.environ.get("APP_ENV", "DEV")

if env == "PROD":
    config = Config(".env-prod")
elif env == "DEV":
    config = Config(".env")
else:
    config = Config(".env")


VERSION: str = config("VERSION", default="1.0.0")
DEBUG: bool = config("DEBUG", cast=bool, default=False)
APP_ENV: str = config("APP_ENV", default="DEVELOPMENT")
PROJECT_NAME: str = config("PROJECT_NAME", default="BE FASTAPI")
PROJECT_DESCRIPTION: str = config(
    "PROJECT_DESCRIPTION", default="Driving Lesson School"
)
APP_SECRET_KEY: Secret = config(
    "APP_SECRET_KEY", default="UBzPj7Qj29K4z4aeCqZ40xi8dVdTbbch", cast=Secret
)  # type: ignore


ADMIN_USERNAME: str = config("ADMIN_USERNAME", default="admin@admin.com")
ADMIN_PASSWORD: str = config("ADMIN_PASSWORD", default="admin@123")
ALLOWED_HOSTS: list[str] = config(
    "ALLOWED_HOSTS", cast=CommaSeparatedStrings, default=""
)  # type: ignore


DATABASE_HOST: str = config("DATABASE_HOST", default="localhost")
DATABASE_PORT: str = config("DATABASE_PORT")
DATABASE_NAME: str = config("DATABASE_NAME", default="")
DATABASE_USER: str = config("DATABASE_USER")
DATABASE_PASSWORD: str = config("DATABASE_PASSWORD")
SQLALCHEMY_DATABASE_URL: str = config(
    "SQLALCHEMY_DATABASE_URL", default="sqlite:///./test.db"
)
ASYNC_SQLALCHEMY_DATABASE_URL: str = config(
    "ASYNC_SQLALCHEMY_DATABASE_URL", default="sqlite:///./test.db"
)

SECRET_KEY: Secret = config("SECRET_KEY", default="secret")  # type: ignore
ALGORITHM: str = config("ALGORITHM", default="HS256")
ACCESS_TOKEN_EXPIRE_MINUTES: int = config("ACCESS_TOKEN_EXPIRE_MINUTES", default=300)
ACCESS_TOKEN_IN_MINUTES: int = config("ACCESS_TOKEN_IN_MINUTES", default=60)
REFRESH_TOKEN_TIME_IN_MINUTES: int = config(
    "REFRESH_TOKEN_TIME_IN_MINUTES", cast=int, default=3600
)
TOKEN_URL: str = config("TOKEN_URL", default="token")

EMAIL_USE_TLS: str = config("EMAIL_USE_TLS", default="")
EMAIL_HOST: str = config("EMAIL_HOST", default="")
EMAIL_PORT: int = int(config("EMAIL_PORT", default=587))
EMAIL_HOST_USER: str = config("EMAIL_HOST_USER", default="")
EMAIL_HOST_PASSWORD: str = config("EMAIL_HOST_PASSWORD", default="")

# Google Calendar
CALENDAR_ID: str = config("CALENDAR_ID", default="")
SERVICE_ACCOUNT_FILE: str = config(
    "SERVICE_ACCOUNT_FILE", default="service_account.json"
)

MEDIA_PATH: str = config("MEDIA", default="media")
ICS_PATH: str = config("ICS_PATH", default="ics")
LOGO_PATH: str = config("LOGO_PATH", default="logo")
VIDEO_PATH: str = config("VIDEO_PATH", default="video")
CHART_PATH: str = config("CHART_PATH", default="chart")
HERO_PATH: str = config("HERO_PATH", default="logo/hero")
BLOG: str = config("BLOG", default="logo/blog")

TEMPLATE_DIR: str = config("TEMPLATE_DIR", default="apps/templates")
DEFAULT_TEMPLATE_DIR: str = config(
    "DEFAULT_TEMPLATE_DIR", default="apps/default_templates"
)

SERVER_URL: str = config("SERVER_URL", default="http://localhost:8000")

# OTP Length in digits
OTP_LENGTH: int = config("OTP_LENGTH", cast=int, default=4)

# Fernet Key
FERNET_KEY: str = config("FERNET_KEY", default="")
