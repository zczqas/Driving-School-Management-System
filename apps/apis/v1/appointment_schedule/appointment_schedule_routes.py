from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.appointment_schedule.appointment_schedule_mixins import (
    AppointmentScheduleCertificateMixins,
    AppointmentScheduleMixins,
)
from apps.apis.v1.appointment_schedule.filter_sort import (
    FilterAppointmentSchedule,
    SortAppointmentSchedule,
)
from apps.apis.v1.users.profile_routes import lock_profile
from apps.common.enum import RoleEnum, TransactionMethodEnum, TransactionStatusEnum
from apps.config.db.conn import get_db
from apps.core.models.appointment_schedule import (
    AppointmentSchedule,
    AppointmentScheduleStatus,
)
from apps.core.models.package import Package
from apps.core.models.transaction import Transaction
from apps.core.models.vehicle import Vehicle
from apps.core.schemas.appointment_schedule import (
    AppointmentScheduleCreateSchema,
    AppointmentScheduleFilterSchema,
    AppointmentScheduleResponseSchema,
    AppointmentScheduleResponseSchemaTotal,
    AppointmentScheduleUpdateSchema,
)
from apps.security.auth import jwt_service
from apps.services.send_email import send_email

router = APIRouter(prefix="/appointment_schedule", tags=["appointment schedule"])


@router.get("/get", response_model=AppointmentScheduleResponseSchemaTotal)
def get_all_appointment_schedule(
    offset: int = 0,
    limit: int = 10,
    get_filter_params: AppointmentScheduleFilterSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    get all appointment schedule

    args:
    - offset: int >> offset of the query
    - limit: int >> limit of the query
    - get_filter_params: AppointmentScheduleFilterSchema >> filter params
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - response: AppointmentScheduleResponseSchemaTotal >> response schema
    """
    query = db.query(AppointmentSchedule)
    filter_params = get_filter_params.model_dump(exclude_none=True)

    query = FilterAppointmentSchedule().filter_appointment_schedule(
        query, **filter_params
    )
    query = SortAppointmentSchedule().sorting_appointment_schedule(
        query=query, sort=get_filter_params.sort, order=get_filter_params.order
    )

    total = query.with_entities(AppointmentSchedule.id).count()

    AppointmentScheduleMixins.update_stale_appointments(db)

    response = {
        "total": total,
        "appointment_schedule": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{appointment_id}", response_model=AppointmentScheduleResponseSchema)
def get_appointment_schedule_by_id(
    appointment_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    get appointment schedule by id

    args:
    - appointment_id: int >> appointment id >> path param
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - appointment: AppointmentScheduleResponseSchema >> response schema
    """
    appointment = (
        db.query(AppointmentSchedule)
        .filter(AppointmentSchedule.id == appointment_id)
        .first()
    )

    return appointment


@router.get("/get/{student_id}", response_model=List[AppointmentScheduleResponseSchema])
def get_appointment_schedule_by_student_id(
    student_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    get appointment schedule by student id

    args:
    - student_id: int >> student id >> path param
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - appointments: List[AppointmentScheduleResponseSchema] >> response schema
    """
    appointments = (
        db.query(AppointmentSchedule)
        .filter(AppointmentSchedule.student_id == student_id)
        .all()
    )

    return appointments


@router.post("/create", status_code=status.HTTP_201_CREATED)
async def add_appointment_schedule(
    appointments: List[AppointmentScheduleCreateSchema],
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    create appointment schedule

    args:
    - appointments: List[AppointmentScheduleCreateSchema] >> list of appointment schedule
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - message: Appointment scheduled successfully
    - status code: 201 created
    """
    for appointment in appointments:
        availability, student, lesson = AppointmentScheduleMixins.validate_appointment(
            db, appointment
        )
        appointment_schedule = AppointmentSchedule(
            **appointment.model_dump(exclude=["transaction_id", "pickup_location_id"])
        )

        if availability.available_date is not None:
            availability.is_booked = True  # type: ignore
        appointment_schedule.created_by_id = current_user.id
        try:
            AppointmentScheduleMixins.update_profile_lesson_assigned(
                db, student.id, lesson.id  # type: ignore
            )
            if appointment.transaction_id:
                AppointmentScheduleMixins.update_transaction_lesson_assigned(
                    db, appointment.transaction_id  # type: ignore
                )
            db.add(appointment_schedule)
            db.add(availability)
            db.commit()
            db.refresh(appointment_schedule)
            if appointment.pickup_location_id is None:
                AppointmentScheduleMixins.update_appointment_city(
                    db, appointment_schedule, student.id
                )
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error occurred while scheduling appointment {str(e)}",
            ) from e

        email_body = {
            "user_name": f"{student.first_name} {student.last_name}",
            "appointment_date": availability.available_date,
            "start_time": availability.start_time,
            "lesson_name": lesson.name,  # type: ignore
        }

        await send_email(
            subject="Appointment Scheduled",
            receiver=[student.email, current_user.email],  # type: ignore
            body=email_body,
            template_name="appointment_scheduled.html",
            db=db,
            user_profiles_id=student.profile.id,
        )

        return {"message": "Appointment scheduled successfully"}


@router.put("/update/{appointment_id}")
def update_appointment_schedule(
    appointment_id: int,
    appointment: AppointmentScheduleUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    update appointment schedule

    args:
    - appointment_id: int >> appointment id >> path param
    - appointment: AppointmentScheduleUpdateSchema >> appointment schedule
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - message: Appointment updated successfully
    - status code: 200 ok
    """

    # initializing message varibales
    odometer_update_message = None
    student_lock_message = None

    appointment_data = (
        db.query(AppointmentSchedule).filter_by(id=appointment_id).first()
    )
    if not appointment_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    if bool(appointment.time_in) ^ bool(appointment.time_out):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Both time in and time out should be provided",
        )

    if appointment.time_in is not None and appointment.time_out is not None:
        AppointmentScheduleMixins.validate_time_in_time_out(
            time_in=appointment.time_in, time_out=appointment.time_out  # type: ignore
        )

    if appointment.end_mileage is not None and appointment.start_mileage is not None:
        if appointment.end_mileage < appointment.start_mileage:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End mileage should be greater than start mileage",
            )
        if appointment.end_mileage < 0 or appointment.start_mileage < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mileage cannot be negative",
            )

        try:
            availability = (
                db.query(AppointmentSchedule)
                .filter_by(id=appointment_id)
                .first()
                .availability
            )
            if availability:
                vehicle = (
                    db.query(Vehicle).filter_by(id=availability.vehicle_id).first()
                )
            if vehicle:
                if vehicle.odometer is None:
                    vehicle.odometer = 0
                vehicle.odometer = appointment.end_mileage
                db.add(vehicle)
                db.commit()
                odometer_update_message = "Vehicle odometer updated successfully"
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error occurred while updating vehicle odometer: {str(e)}",
            ) from e
    cancelled = (
        db.query(AppointmentScheduleStatus)
        .filter(
            AppointmentScheduleStatus.name.ilike("%Cancelled%")
            | AppointmentScheduleStatus.name.ilike("%cancelled%")
        )
        .first()
    )

    if cancelled:
        if (current_user.role != RoleEnum.ADMIN) and (
            current_user.role != RoleEnum.SUPER_ADMIN
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You are not authorized to cancel the appointment",
            )

    apply_fine_statuses = db.query(AppointmentScheduleStatus).filter(
        AppointmentScheduleStatus.apply_fine.is_(True)
    )

    if appointment.status_id is not None:
        for apply_fine_status in apply_fine_statuses:
            if apply_fine_status.id == appointment.status_id:
                # Lock the student profile and charge him a cancellation fee.
                lock_profile(appointment_data.student_id, db)
                fine_package = (
                    db.query(Package).filter_by(name="Cancellation Fee").first()
                )
                if not fine_package:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Cancellation Fee not found",
                    )
                # Create a new transaction for the student. The transaction will be the cancellation Fee
                new_transaction = Transaction(
                    user_id=appointment_data.student_id,
                    package_id=fine_package.id,
                    amount=fine_package.price,
                    status=TransactionStatusEnum.PENDING,
                    created_by_id=current_user.id,
                    date_charged=appointment_data.updated_at,
                    method=TransactionMethodEnum.CASH,
                )
                db.add(new_transaction)
                db.commit()
                student_lock_message = "Student Profile Locked"

    message = None
    if appointment.status_id:
        message = AppointmentScheduleCertificateMixins.assign_certificate(
            db, appointment_data.id, appointment_data.student_id  # type: ignore
        )

    for key, value in appointment.model_dump().items():
        if value is not None:
            setattr(appointment_data, key, value)

    try:
        db.add(appointment_data)
        db.commit()
        if message is None:
            message = "Appointment updated successfully"
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occured while updating appointment {str(e)}",
        ) from e

    return {
        "message": message,
        "odometer_update_message": odometer_update_message,
        "student_lock_message": student_lock_message,
    }


@router.delete("/delete/{appointment_id}")
def delete_appointment_schedule(
    appointment_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    delete appointment schedule

    args:
    - appointment_id: int >> appointment id >> path param
    - current_user: Users >> current user
    - db: Session >> database connection

    return:
    - message: Appointment deleted successfully
    - status code: 200 ok
    """
    appointment_data = (
        db.query(AppointmentSchedule).filter_by(id=appointment_id).first()
    )
    if not appointment_data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    try:
        db.delete(appointment_data)
        db.commit()
        return {"message": "Appointment deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occured while deleting appointment {str(e)}",
        ) from e
