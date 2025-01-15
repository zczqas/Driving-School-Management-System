from fastapi import (
    APIRouter,
    Depends,
    status,
)
from fastapi.exceptions import HTTPException

from sqlalchemy.orm import Session

from apps.apis.v1.appointment_status.filter_sort import SortAppointmentStatus
from apps.core.models.appointment_status import AppointmentStatus
from apps.core.schemas.appointment_status import (
    AppointmentStatusCreateSchema,
    AppointmentStatusFilterSchema,
    AppointmentStatusResponseSchema,
    AppointmentStatusResponseSchemaTotal,
    AppointmentStatusUpdateSchema,
)
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db


router = APIRouter(prefix="/appointment_status", tags=["appointment_status"])


@router.get("/get", response_model=AppointmentStatusResponseSchemaTotal)
def get_appointment_status(
    filter_data: AppointmentStatusFilterSchema = Depends(),
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = db.query(AppointmentStatus)

    filter_params = {
        "id": filter_data.id,
    }

    if filter_params["id"]:
        query = query.filter(AppointmentStatus.id == filter_params["id"])

    query = SortAppointmentStatus().sorting_statuses(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(AppointmentStatus.id).count()

    response = {
        "total": total,
        "appointment_status": query.limit(limit).offset(offset).all(),
    }

    return response


@router.get("/get/{status_id}", response_model=AppointmentStatusResponseSchema)
def get_appointment_status_by_id(
    status_id: int,
    db: Session = Depends(get_db),
):
    status_exist = (
        db.query(AppointmentStatus).filter(AppointmentStatus.id == status_id).first()
    )

    if not status_exist:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment status not found",
        )

    return status_exist


@router.post("/create")
def create_appointment_status(
    status_data: AppointmentStatusCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    try:
        statuses = AppointmentStatus(**status_data.model_dump())
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
    status_data: AppointmentStatusUpdateSchema,
    status_id: int,
    db: Session = Depends(get_db),
):
    status_exist = (
        db.query(AppointmentStatus).filter(AppointmentStatus.id == status_id).first()
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
        db.query(AppointmentStatus).filter(AppointmentStatus.id == status_id).first()
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
