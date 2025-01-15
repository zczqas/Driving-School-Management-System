import uuid
from datetime import date, datetime, time

import pytz

from apps.config.settings import ICS_PATH
from ics import Calendar, Event


async def create_event(
    summary: str,
    location: str,
    description: str,
    appointment_date: date,
    start_time: time,
    end_time: time,
    attendee: list[str],
    timezone: str = "America/Los_Angeles",
):
    cal = Calendar()

    event = Event()
    event.name = summary
    event.location = location
    event.description = description

    tz = pytz.timezone(timezone)
    start_datetime = datetime.combine(appointment_date, start_time, tz)
    end_datetime = datetime.combine(appointment_date, end_time, tz)

    event.begin = start_datetime
    event.end = end_datetime

    for attendee_email in attendee:
        event.add_attendee(attendee_email)  # type: ignore

    cal.events.add(event)

    file_path = ICS_PATH + "/" + str(uuid.uuid4()) + ".ics"

    with open(file_path, "w") as f:
        f.writelines(cal)  # type: ignore
    print("Event created successfully!")

    return file_path
