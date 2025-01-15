from datetime import datetime, date, time
from fastapi import HTTPException, status
from google.oauth2 import service_account
from googleapiclient.discovery import build
import pytz

from apps.config import settings

SERVICE_ACCOUNT_FILE = settings.SERVICE_ACCOUNT_FILE
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CALENDAR_ID = settings.CALENDAR_ID


class GoogleCalendarService:
    def __init__(self) -> None:
        self.credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )
        self.service = build("calendar", "v3", credentials=self.credentials)

    def create_calendar_event(
        self,
        summary: str,
        location: str,
        description: str,
        appointment_date: date,
        start_time: time,
        end_time: time,
    ) -> bool:

        tz = pytz.timezone("America/Los_Angeles")
        startDateTime = (
            datetime.combine(appointment_date, start_time, tz)
            .astimezone(tz)
            .isoformat()
        )
        endDateTime = (
            datetime.combine(appointment_date, end_time, tz).astimezone(tz).isoformat()
        )

        try:
            event = {
                "summary": summary,
                "location": location,
                "description": description,
                "start": {"dateTime": startDateTime, "timeZone": "America/Los_Angeles"},
                "end": {"dateTime": endDateTime, "timeZone": "America/Los_Angeles"},
                "reminders": {
                    "useDefault": False,
                    "overrides": [
                        {"method": "email", "minutes": 24 * 60},
                        {"method": "popup", "minutes": 10},
                    ],
                },
            }

            event = (
                self.service.events()
                .insert(calendarId=CALENDAR_ID, body=event)
                .execute()
            )

            return bool(event)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
            ) from e
