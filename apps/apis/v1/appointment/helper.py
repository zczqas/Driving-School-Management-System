from datetime import timedelta, date
from sqlalchemy.orm import Session

from fastapi import HTTPException, status
from sqlalchemy import or_

from apps.core.models.appointment_status import AppointmentStatus
from apps.core.models.users import StudentAppointment


def calculate_two_working_weeks(start_date):
    days_added = 0
    current_date = start_date
    while days_added < 10:
        current_date += timedelta(days=1)
        if current_date.weekday() < 5:  # Monday to Friday are 0-4
            days_added += 1
    return current_date


def update_stale_appointments(db: Session) -> None:
    stale_appointments = (
        db.query(StudentAppointment)
        .filter(StudentAppointment.appointment_date < date.today() - timedelta(days=2))
        .all()
    )
    if stale_appointments:
        complete_status = (
            db.query(AppointmentStatus)
            .filter(
                or_(
                    AppointmentStatus.name.ilike("complete"),
                    AppointmentStatus.name.ilike("completed"),
                )
            )
            .first()
        )
        if complete_status is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Completed status not found",
            )
        for stale_appointment in stale_appointments:

            setattr(stale_appointment, "status_id", complete_status.id)
            try:
                db.add(stale_appointment)
                db.commit()
            except Exception as e:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error: {e} occurred while updating the appointment",
                ) from e
