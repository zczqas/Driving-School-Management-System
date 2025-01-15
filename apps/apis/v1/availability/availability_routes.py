from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import extract, nullsfirst, or_

from sqlalchemy.orm import Session

from apps.apis.v1.availability.filter_sort import FilterAvailability, SortAvailability
from apps.apis.v1.availability.mixins import AvailabilityMixin
from apps.common.enum import RoleEnum
from apps.config.db.conn import get_db
from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.availability import Availability, AvailabilityCity
from apps.core.models.city import City
from apps.core.models.users import Users
from apps.core.models.vehicle import Vehicle
from apps.core.schemas.availability import (
    AvailabilityCreateSchema,
    AvailabilityFilterSchema,
    AvailabilityMonthlyGetSchema,
    AvailabilityUpdateSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/availability", tags=["availability"])


@router.get("/get")
def get_availability(
    offset: int = 0,
    limit: int = 10,
    get_filter_params: AvailabilityFilterSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get route for availability with filter and sort params for current user

    args:
    - offset: int >> Offset
    - limit: int >> Limit
    - get_filter_params: AvailabilityFilterSchema >> Filter params
    - current_user: User >> Current user
    - db: Session >> Database session

    return:
    - dict >> Total and availability list
    """
    query = db.query(Availability)
    query = query.join(Users, Users.id == Availability.user_id).filter(
        Users.is_active == True,  # noqa
        Users.role == RoleEnum.INSTRUCTOR,
    )
    if get_filter_params.student_id is not None:
        user = db.query(Users).filter(Users.id == get_filter_params.student_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
    else:
        user = current_user

    if get_filter_params.month is not None:
        if get_filter_params.month < 1 or get_filter_params.month > 12:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid month. Month should be between 1 to 12",
            )

    city = None
    if not get_filter_params.alternate_location:
        if user.profile.city:
            city = db.query(City).filter(City.name.ilike(user.profile.city)).first()
    else:
        for location in user.profile.pickup_location:
            city = db.query(City).filter(City.name.ilike(location.city)).first()
            if city:
                break
    if city is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="City not found. Please update your profile",
        )

    query = query.join(AvailabilityCity).filter(AvailabilityCity.city_id == city.id)

    filter_params = get_filter_params.model_dump(
        exclude={"student_id"}, exclude_unset=True
    )

    query = FilterAvailability().filter_availability_schedule(query, **filter_params)
    query = SortAvailability().sorting_availability_schedule(
        query=query, sort=get_filter_params.sort, order=get_filter_params.order
    )
    total = query.with_entities(Availability.id).count()
    availabilities = (
        query.order_by(
            nullsfirst(Availability.available_day.asc()), Availability.start_time.asc()
        )
        .offset(offset)
        .limit(limit)
        .all()
    )
    return {
        "total": total,
        "availability": [
            AvailabilityMixin().format_availability(availability)
            for availability in availabilities
        ],
    }


@router.get("/get/monthly")
def get_monthly_availability(
    data: AvailabilityMonthlyGetSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get monthly availability

    params:
    - month: int >> Month number
    - user_id: int >> User ID
    """
    if data.month is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Month is required"
        )
    if data.month < 1 or data.month > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid month: {data.month}",
        )

    date_filter = or_(
        extract("month", Availability.available_date) == data.month,
        Availability.available_date is not None,  # type: ignore
    )
    if data.user_id is not None:
        availabilities = AvailabilityMixin().get_availabilities_by_user_id(
            db, data.user_id, date_filter
        )
    else:
        availabilities = db.query(Availability).filter(date_filter).all()

    total = len(availabilities)

    return {
        "total": total,
        "availability": [
            AvailabilityMixin().format_availability(availability)
            for availability in availabilities
        ],
    }


@router.get("/get/{user_id}")
def get_availability_by_user_id(
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get availability by user_id

    params:
    - user_id: int >> User ID
    """
    availabilities = AvailabilityMixin().get_availabilities_by_user_id(db, user_id)
    return [
        AvailabilityMixin().format_availability(availability)
        for availability in availabilities
    ]


@router.get("/get/weekly/{user_id}")
def get_availability_weekly(
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get weekly availability by user_id

    params:
    - user_id: int >> User ID
    """
    availabilities = AvailabilityMixin().get_availabilities_by_user_id(
        db, user_id, Availability.available_date == None  # noqa
    )
    return [
        AvailabilityMixin().format_availability(availability)
        for availability in availabilities
    ]


@router.get("/get/date/{user_id}")
def get_availability_date(
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get availability by user_id for specific date availability

    params:
    - user_id: int >> User ID
    """
    availabilities = AvailabilityMixin().get_availabilities_by_user_id(
        db, user_id, Availability.available_date != None  # noqa
    )
    return [
        AvailabilityMixin().format_availability(availability)
        for availability in availabilities
    ]


@router.post("/create")
def set_availability(
    avail: list[AvailabilityCreateSchema],
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Create availability

    args:
    - avail: list[AvailabilityCreateSchema] >> List of availability
    - current_user: User >> get_current_user >> Currently logged in user
    - db: Session >> get_db >> Database session

    return:
        message: Availabilities set successfully
        status_code: 200 OK
    """
    avail.sort(key=lambda x: x.start_time)  # type: ignore

    for i in range(len(avail) - 1):
        if (avail[i].start_time or avail[i].end_time) is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Both start time and end time are required",
            )

        if avail[i].start_time >= avail[i].end_time:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid time slot {avail[i].start_time} to {avail[i].end_time} for {avail[i].available_date if avail[i].available_date else avail[i].available_day}. Start time should be less than end time",
            )

        if avail[i].end_time > avail[i + 1].start_time and (  # type: ignore
            (
                avail[i].available_date
                and avail[i].available_date == avail[i + 1].available_date  # noqa
            )
            or (  # noqa
                avail[i].available_day
                and avail[i].available_day == avail[i + 1].available_day  # noqa
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Input time slot {avail[i].start_time} to {avail[i].end_time} overlaps with {avail[i + 1].start_time} to {avail[i + 1].end_time}. Please check the input",
            )

    for availability_data in avail:
        if availability_data.id is not None:
            update_availability(
                availability_data.id, availability_data, current_user, db  # type: ignore
            )
            continue

        overlaps_query = db.query(Availability).filter(
            Availability.user_id == availability_data.user_id,
            Availability.start_time < availability_data.end_time,
            Availability.end_time > availability_data.start_time,
        )

        if availability_data.available_date:
            overlaps_query = overlaps_query.filter(
                Availability.available_date == availability_data.available_date
            )
        else:
            overlaps_query = overlaps_query.filter(
                Availability.available_date == None  # noqa
            )

        if availability_data.available_day:
            overlaps_query = overlaps_query.filter(
                Availability.available_day == availability_data.available_day
            )
        else:
            overlaps_query = overlaps_query.filter(
                Availability.available_day == None  # noqa
            )

        overlaps = overlaps_query.first()

        if overlaps:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Time slot {availability_data.start_time} to {availability_data.end_time} overlaps with existing availability",
            )
        # Check for Vehicle Overlap
        AvailabilityMixin().vehichle_overlap(db, availability_data)

        if availability_data.available_day is not None:
            if (
                availability_data.available_day < 0
                or availability_data.available_day > 6  # noqa
            ):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid day. Day should be between 0 to 6. 0: Sunday, 1: Monday, ..., 6: Saturday",
                )

        if availability_data.vehicle_id is not None:
            vehicles = (
                db.query(Vehicle)
                .filter(Vehicle.id == availability_data.vehicle_id)
                .first()
            )
            if vehicles is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Vehicle not found",
                )
        existing_availabilities = (
            db.query(Availability)
            .filter(
                Availability.user_id == availability_data.user_id,
                Availability.start_time < availability_data.end_time,
                Availability.end_time > availability_data.start_time,
            )
            .all()
        )

        for existing_availability in existing_availabilities:
            if (
                availability_data.from_ is not None
                and availability_data.to_ is not None
                and existing_availability.from_ is not None
                and existing_availability.to_ is not None
            ):
                if (
                    (
                        availability_data.from_ >= existing_availability.from_
                        and availability_data.to_ <= existing_availability.to_
                    )
                    or (
                        availability_data.from_ <= existing_availability.from_
                        and availability_data.to_ >= existing_availability.to_
                    )
                    or (
                        availability_data.from_ == existing_availability.to_
                        or availability_data.to_ == existing_availability.from_
                    )
                ):
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=(
                            f"Dates {availability_data.from_} to {availability_data.to_} overlap with an existing "
                            f"availability from {existing_availability.from_} to {existing_availability.to_}."
                        ),
                    )

        if availability_data.available_date is None:
            availability_data.is_recurring = True

        if availability_data.available_date is not None:
            availability_data.from_ = availability_data.available_date
            availability_data.to_ = availability_data.available_date

        availability = Availability(
            user_id=availability_data.user_id,
            from_=availability_data.from_,
            to_=availability_data.to_,
            available_date=availability_data.available_date,
            available_day=availability_data.available_day,
            start_time=availability_data.start_time,
            end_time=availability_data.end_time,
            is_recurring=availability_data.is_recurring,
            created_by_id=current_user.id,
            vehicle_id=availability_data.vehicle_id,
            notes=availability_data.notes,
        )

        if availability_data.city_id is not None:
            cities = db.query(City).filter(City.id.in_(availability_data.city_id)).all()
            if len(cities) != len(availability_data.city_id):
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="One or more cities not found",
                )

            for city in cities:
                available_cities = AvailabilityCity(
                    availability=availability, city=city
                )
                db.add(available_cities)

        try:
            db.add(availability)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Something went wrong {str(e)}",
            ) from e

    return {"message": "Availabilities set successfully"}


@router.put("/update/{availability_id}")
def update_availability(
    availability_id: int,
    update_data: AvailabilityUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Update availability

    args:
    - availability_id: int >> Path parameter
    - update_data: AvailabilityUpdateSchema >> Request body
    - current_user: User >> get_current_user >> Currently logged in user
    - db: Session >> get_db >> Database session

    return:
        message: Availability updated successfully
        status_code: 200 OK
    """
    availability = (
        db.query(Availability).filter(Availability.id == availability_id).first()
    )
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found",
        )

    # Validate overlapping time slots
    overlaps_query = db.query(Availability).filter(
        Availability.user_id == availability.user_id,
        Availability.id != availability_id,
        Availability.start_time < availability.end_time,
        Availability.end_time > availability.start_time,
    )

    if availability.available_date:  # type: ignore
        overlaps_query = overlaps_query.filter(
            Availability.available_date == availability.available_date
        )
    else:
        overlaps_query = overlaps_query.filter(
            Availability.available_date == None  # noqa
        )

    if availability.available_day:  # type: ignore
        overlaps_query = overlaps_query.filter(
            Availability.available_day == availability.available_day
        )
    else:
        overlaps_query = overlaps_query.filter(
            Availability.available_day == None  # noqa
        )

    overlaps = overlaps_query.first()

    if overlaps:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Time slot {availability.start_time} to {availability.end_time} overlaps with existing availability when updating",
        )
    # Check for Vehicle Overlap
    AvailabilityMixin().vehichle_overlap(db, update_data)

    if availability.available_day is not None:
        if availability.available_day < 0 or availability.available_day > 6:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid day. Day should be between 0 to 6. 0: Sunday, 1: Monday, ..., 6: Saturday",
            )

    if update_data.city_id is not None:
        cities = db.query(City).filter(City.id.in_(update_data.city_id)).all()
        if len(cities) != len(update_data.city_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more cities not found",
            )

        availability_cities = (
            db.query(AvailabilityCity)
            .filter(AvailabilityCity.availability_id == availability_id)
            .all()
        )
        if availability_cities:
            for city in availability_cities:
                db.delete(city)

        for city in cities:
            available_cities = AvailabilityCity(availability=availability, city=city)
            db.add(available_cities)

    for key, value in update_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(availability, key, value)

    try:
        db.add(availability)
        db.commit()
        db.refresh(availability)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Availability updated successfully"}


@router.delete("/delete/{availability_id}")
def delete_availability(
    availability_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Availability can only be deleted if there are no incomplete schedules

    args:
    - availability_id: int >> Path parameter
    - current_user: User >> get_current_user >> Currently logged in user
    - db: Session >> get_db >> Database session

    return:
        message: Availability deleted successfully
        status_code: 204 No Content
    """
    availability = (
        db.query(Availability).filter(Availability.id == availability_id).first()
    )
    if not availability:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Availability not found",
        )

    schedule = (
        db.query(AppointmentSchedule)
        .filter(
            AppointmentSchedule.availability_id == availability_id,
        )
        .first()
    )

    if schedule:
        availability.is_deleted = True
        db.add(availability)
        db.commit()
        return {"message": "Availability deleted successfully"}
    try:
        db.delete(availability)
        db.commit()
        return {"message": "Availability deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e
