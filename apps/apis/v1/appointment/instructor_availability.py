from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from apps.apis.v1.appointment.filter_sort import FilterAppointment, SortAppointment
from apps.common.enum import RoleEnum
from apps.config.db.conn import get_db
from apps.core.models.users import InstructorAvailability
from apps.core.schemas.instructor_availability import (
    InstructorAvailabilityCreate,
    InstructorAvailabilityFilterSchema,
    InstructorAvailabilityResponse,
    InstructorAvailabilityResponseSchema,
    InstructorAvailabilityResponseTotal,
    InstructorAvailabilityUpdate,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/instructor/availability", tags=["instructor_availability"])


@router.get("/get", response_model=List[InstructorAvailabilityResponseSchema])
def list_all_instructor_available(
    db: Session = Depends(get_db),
):
    """List all available instructors.

    Args:
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, No instructor available

    Returns:
        List[InstructorAvailability]: List of available instructors
    """
    available_instructors = (
        db.query(InstructorAvailability)
        .filter(
            InstructorAvailability.availability_date != None,
            InstructorAvailability.start_time != None,
            InstructorAvailability.end_time != None,
        )
        .all()
    )

    if not available_instructors:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No instructor available"
        )

    return available_instructors


@router.post("/post", response_model=InstructorAvailabilityResponse)
def add_instructor_slot(
    instructor_slot: InstructorAvailabilityCreate = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new slot for an instructor.

    Args:
        instructor_slot (InstructorAvailabilityCreate): availability date, start time, end time
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 400, Only instructors can add slots
        HTTPException: 400, Slot already exists
        HTTPException: 500, Internal server error

    Returns:
        InstructorAvailability: New slot created
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user.role is RoleEnum.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only instructors can add slots",
        )

    user_slot = (
        db.query(InstructorAvailability)
        .filter(
            InstructorAvailability.instructor_id == current_user.id,
            InstructorAvailability.availability_date
            == instructor_slot.availability_date,
            or_(
                and_(
                    InstructorAvailability.start_time < instructor_slot.end_time,
                    InstructorAvailability.end_time > instructor_slot.start_time,
                ),
                and_(
                    InstructorAvailability.start_time < instructor_slot.start_time,
                    InstructorAvailability.end_time > instructor_slot.end_time,
                ),
            ),
        )
        .first()
    )

    if user_slot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Slot already exists"
        )

    db_data = InstructorAvailability(
        **instructor_slot.model_dump(), instructor_id=current_user.id
    )

    try:
        db.add(db_data)
        db.commit()
        db.refresh(db_data)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return db_data


@router.put("/update/{slot_id}")
def update_instructor_time_slot(
    slot_id: int,
    update_date: InstructorAvailabilityUpdate = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to update an instructor slot

    Args:
        slot_id (int): Slot ID
        update_date (InstructorAvailabilityUpdate, optional):
                availability_date,
                start_time,
                end_time.
            Defaults to Depends().
        current_user (Any, optional):
            Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Slot not found
        HTTPException: 401, You are not authorized to update this slot
        HTTPException: 500, Internal server error

    Returns:
        message: Slot updated successfully
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    slot = (
        db.query(InstructorAvailability)
        .filter(InstructorAvailability.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
        )

    if slot.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to update this slot",
        )

    try:
        if update_date.availability_date:
            setattr(slot, "availability_date", update_date.availability_date)
        if update_date.start_time:
            setattr(slot, "start_time", update_date.start_time)
        if update_date.end_time:
            setattr(slot, "end_time", update_date.end_time)

        db.add(slot)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Slot updated successfully"}


@router.delete("/delete/{slot_id}")
def delete_instructor_time_slot(
    slot_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to delete an instructor slot

    Args:
        slot_id (int): Slot id
        current_user (Any, optional):
                Currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Slot not found
        HTTPException: 401, You are not authorized to delete this slot
        HTTPException: 500, Internal server error

    Returns:
        _type_: _description_
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    slot = (
        db.query(InstructorAvailability)
        .filter(InstructorAvailability.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
        )

    if slot.instructor_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="You are not authorized to delete this slot",
        )

    try:
        db.delete(slot)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Slot deleted successfully"}


@router.get("/filter/get", response_model=InstructorAvailabilityResponseTotal)
def filter_instructor_slots(
    offset: int = 0,
    limit: int = 10,
    filter_data: InstructorAvailabilityFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    """API to filter instructor slots

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        filter_data (InstructorAvailabilityFilterSchema, optional):
                availability_date,
                start_time,
                end_time,
                instructor_id,
                sort,
                order.
            Defaults to Depends().
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Returns:
        response: total, instructor_slots
    """
    query = db.query(InstructorAvailability)

    filter_params = {
        "availability_date": filter_data.availability_date,
        "start_time": filter_data.start_time,
        "end_time": filter_data.end_time,
        "instructor_id": filter_data.instructor_id,
    }

    query = FilterAppointment().filter_instructor_availability(query, **filter_params)
    query = SortAppointment().sort_instructor_availability(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total_count = query.with_entities(InstructorAvailability.id).count()

    response = {
        "total": total_count,
        "instructor_slots": query.offset(offset).limit(limit).all(),
    }

    return response
