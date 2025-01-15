from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from apps.apis.v1.appointment_schedule_status.filter_sort import (
    SortAppointmentScheduleStatus,
)
from apps.config.db.conn import get_db
from apps.core.models.appointment_schedule import AppointmentScheduleStatus
from apps.core.schemas.appointment_schedule_status import (
    AppointmentScheduleStatusCreateSchema,
    AppointmentScheduleStatusFilterSchema,
    AppointmentScheduleStatusResponseSchema,
    AppointmentScheduleStatusResponseSchemaTotal,
    AppointmentScheduleStatusUpdateSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(
    prefix="/appointment_schedule/status", tags=["appointment schedule status"]
)


@router.get("/get", response_model=AppointmentScheduleStatusResponseSchemaTotal)
def get_appointment_sschedule_status(
    filter_data: AppointmentScheduleStatusFilterSchema = Depends(),
    offset: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(AppointmentScheduleStatus)

    filter_params = {
        "id": filter_data.id,
    }

    if filter_params["id"]:
        query = query.filter(AppointmentScheduleStatus.id == filter_params["id"])

    query = SortAppointmentScheduleStatus().sorting_statuses(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(AppointmentScheduleStatus.id).count()

    response = {
        "total": total,
        "appointment_schedule_status": query.limit(limit).offset(offset).all(),
    }

    return response


@router.get("/get/{status_id}", response_model=AppointmentScheduleStatusResponseSchema)
def get_appointment_status_by_id(
    status_id: int,
    db: Session = Depends(get_db),
):
    status_exist = (
        db.query(AppointmentScheduleStatus)
        .filter(AppointmentScheduleStatus.id == status_id)
        .first()
    )

    if not status_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment status not found",
        )

    return status_exist


@router.post("/create")
def create_appointment_status(
    status_data: AppointmentScheduleStatusCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    try:
        statuses = AppointmentScheduleStatus(**status_data.model_dump())
        db.add(statuses)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Appointment status created successfully"}


@router.put("/update/{status_id}")
def update_appointment_status(
    status_data: AppointmentScheduleStatusUpdateSchema,
    status_id: int,
    db: Session = Depends(get_db),
):
    status_exist = (
        db.query(AppointmentScheduleStatus)
        .filter(AppointmentScheduleStatus.id == status_id)
        .first()
    )

    if not status_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment status not found",
        )

    try:
        attributes = [
            "name",
            "description",
        ]

        for attr in attributes:
            value = getattr(status_data, attr)
            if value:
                setattr(status_exist, attr, value)

        db.add(status_exist)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Appointment status updated successfully"}


@router.delete("/delete/{status_id}")
def delete_appointment_status(
    status_id: int,
    db: Session = Depends(get_db),
):
    status_exist = (
        db.query(AppointmentScheduleStatus)
        .filter(AppointmentScheduleStatus.id == status_id)
        .first()
    )

    if not status_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment status not found",
        )

    try:
        db.delete(status_exist)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Appointment status deleted successfully"}
