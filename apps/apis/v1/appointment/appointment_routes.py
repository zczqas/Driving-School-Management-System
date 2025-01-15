from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from apps.apis.v1.appointment.filter_sort import FilterAppointment, SortAppointment
from apps.apis.v1.appointment.google_calendar_service import GoogleCalendarService
from apps.apis.v1.appointment.helper import update_stale_appointments
from apps.common.enum import CertificateTypeEnum, RoleEnum, UserCertificateStatusEnum
from apps.config.db.conn import get_db
from apps.core.models.appointment_status import AppointmentStatus
from apps.core.models.certificate import Certificate, UserCertificate
from apps.core.models.city import City
from apps.core.models.package import Lesson
from apps.core.models.pickup_location import PickupLocation, PickupLocationType
from apps.core.models.transaction import Transaction
from apps.core.models.users import Profile, StudentAppointment, Users
from apps.core.models.vehicle import Vehicle
from apps.core.schemas.appointment import (
    AppointmentCreateSchema,
    AppointmentFilterSchema,
    AppointmentResponseSchema,
    AppointmentResponseSchemaTotal,
    AppointmentUpdateSchema,
)
from apps.security.auth import jwt_service
from apps.services.ics_generator import create_event
from apps.services.send_email import send_email_with_attachment

router = APIRouter(prefix="/appointment", tags=["appointment"])


@router.get("/get", response_model=AppointmentResponseSchemaTotal)
def list_appointment(
    offset: int = 0,
    limit: int = 10,
    appointment_filter_params: AppointmentFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    """API to list appointments

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        appointment_filter_params (AppointmentFilterSchema, optional):
                student_id,
                instructor_id,
                appointment_date,
                status,
                sort,
                order.
            Defaults to Depends().
        db (Session, optional): CTX database. Defaults to Depends(get_db).
    """

    query = db.query(StudentAppointment)

    filter_params = appointment_filter_params.model_dump(exclude_unset=True)

    query = FilterAppointment().filter_appointment(query, **filter_params)
    query = SortAppointment().sorting_appointment(
        query=query,
        sort=appointment_filter_params.sort,
        order=appointment_filter_params.order,
    )

    total_count = query.with_entities(StudentAppointment.id).count()

    update_stale_appointments(db)

    response = {
        "total_count": total_count,
        "appointments": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{pk}", response_model=AppointmentResponseSchema)
def get_appointment_by_id(
    pk: int,
    db: Session = Depends(get_db),
):
    appointment = (
        db.query(StudentAppointment).filter(StudentAppointment.id == pk).first()
    )

    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    return appointment


@router.post("/post")
async def add_appointment(
    appointment_data: AppointmentCreateSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to request appointment

    Args:
        appointment_data (AppointmentRequestSchema, optional):
                student_id(user_id),
                instructor_id(user_id),
                appointment_date,
                start_time,
                end_time.
            Defaults to Depends().
        current_user (Any, optional): Currently logged in user.
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 406, You have a pending request
        HTTPException: 500, Error occurred while creating the appointment

    Returns:
        message: Appointment request sent successfully
    """
    student = db.query(Users).filter(Users.id == appointment_data.student_id).first()
    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    student_profile = db.query(Profile).filter(Profile.user_id == student.id).first()
    if student_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found"
        )

    if appointment_data.transaction_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Transaction ID is required"
        )
    else:
        transaction = (
            db.query(Transaction)
            .filter(Transaction.id == appointment_data.transaction_id)
            .first()
        )
        if transaction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
            )

        parent_contact = next(
            (
                i.contact_phone
                for i in student_profile.contact_information
                if i.contact_type == "parent"
            ),
            "",
        )

    instructor = (
        db.query(Users).filter(Users.id == appointment_data.instructor_id).first()
    )
    if instructor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found"
        )

    lesson = db.query(Lesson).filter(Lesson.id == appointment_data.lesson_id).first()
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Lesson not found"
        )

    lesson_exists = (
        db.query(StudentAppointment)
        .filter(
            StudentAppointment.student_id == appointment_data.student_id,
            StudentAppointment.lesson_id == appointment_data.lesson_id,
            StudentAppointment.package_id == appointment_data.package_id,
        )
        .first()
    )
    if lesson_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"lesson {lesson.name} has already been scheduled.",
        )

    if appointment_data.pickup_location_id is not None:
        pickup_location = (
            db.query(PickupLocation)
            .filter(PickupLocation.id == appointment_data.pickup_location_id)
            .first()
        )
        if pickup_location is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pickup location not found",
            )
    if appointment_data.pickup_location_type_id is not None:
        pickup_location_type = (
            db.query(PickupLocationType)
            .filter(PickupLocationType.id == appointment_data.pickup_location_type_id)
            .first()
        )
        if pickup_location_type is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Pickup location type not found",
            )

    if appointment_data.status_id is not None:
        status_exists = (
            db.query(AppointmentStatus)
            .filter(AppointmentStatus.id == appointment_data.status_id)
            .first()
        )
        if status_exists is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Status not found"
            )

    if appointment_data.vehicle_id is not None:
        vehicle = (
            db.query(Vehicle).filter(Vehicle.id == appointment_data.vehicle_id).first()
        )
        if vehicle is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found"
            )

    if appointment_data.city_id is not None:
        city = db.query(City).filter(City.id == appointment_data.city_id).first()
        if city is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="City not found"
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="City is required"
        )

    overlapping_appointments = (
        db.query(StudentAppointment)
        .filter(
            or_(
                and_(
                    StudentAppointment.instructor_id == appointment_data.instructor_id,
                    StudentAppointment.appointment_date
                    == appointment_data.appointment_date,
                    StudentAppointment.start_time < appointment_data.end_time,
                    StudentAppointment.end_time > appointment_data.start_time,
                ),
                and_(
                    StudentAppointment.student_id == appointment_data.student_id,
                    StudentAppointment.appointment_date
                    == appointment_data.appointment_date,
                    StudentAppointment.start_time < appointment_data.end_time,
                    StudentAppointment.end_time > appointment_data.start_time,
                ),
            )
        )
        .first()
    )
    if overlapping_appointments:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Appointment overlaps with an existing appointment",
        )

    try:
        if transaction.scheduled_lesson is None:
            transaction.scheduled_lesson = 1  # type: ignore
        else:
            transaction.scheduled_lesson += 1  # type: ignore
        db.add(transaction)

        db_item_data = appointment_data.model_dump(exclude_unset=True)
        db_item_data["student_id"] = appointment_data.student_id
        db_item_data["created_by_id"] = current_user.id
        appointment_db = StudentAppointment(**db_item_data)
        db.add(appointment_db)

        # Update profile lesson_assigned
        if not student_profile.lesson_assigned:  # type: ignore
            student_profile.lesson_assigned = []  # type: ignore
        # Replace the list in database with the new list
        # it is done since simply append was not working
        new_lesson_assigned = student_profile.lesson_assigned + [lesson.id]
        setattr(student_profile, "lesson_assigned", new_lesson_assigned)
        db.add(student_profile)

        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {exc} occurred while creating the appointment",
        ) from exc

    try:
        event_file = await create_event(
            summary=f"{instructor.first_name} {instructor.last_name}/{city.city_abbreviation}/{lesson.name}/{student.first_name} {student.last_name}",
            location=f"{city.name}, {city, city.state}//{city.city_abbreviation}",
            description=f"Student Info:\nEmergency Contact: {parent_contact}\nCellphone: {student_profile.cell_phone}\nEmail: {student.email}\nAddress: {student_profile.address}\nCity: {city.name}\nInstructor Name: {instructor.first_name} {instructor.last_name}#{vehicle.brand} {vehicle.model} {vehicle.color}\nLesson Info:\nName: {lesson.name}\nDuration: {lesson.duration} hours\n\n",
            appointment_date=appointment_data.appointment_date,  # type: ignore
            start_time=appointment_data.start_time,  # type: ignore
            end_time=appointment_data.end_time,  # type: ignore
            attendee=[student.email, instructor.email],  # type: ignore
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while creating ics file",
        ) from e

    # Send email with attachment
    try:
        attachment = None if not event_file else event_file
        await send_email_with_attachment(
            subject="Appointment Notification",
            receiver=[instructor.email, student.email],  # type: ignore
            body={
                "student": student.first_name + " " + student.last_name,
                "instructor": instructor.first_name + " " + instructor.last_name,
                "lesson": lesson.name,
                "appointment_date": appointment_data.appointment_date,
                "start_time": appointment_data.start_time,
                "end_time": appointment_data.end_time,
                # "pickup_location": pickup_location.name,
                "city-abbreviation": city.city_abbreviation,
                "address": appointment_data.pickup_text,
            },
            template_name="appointment_request.html",
            attachment=attachment,
            db=db,
            user_profiles_id=student_profile.id,  # type: ignore
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error occurred while sending the email",
        ) from e

    # Create Calendar Event in Admin's Calendar
    calendar_service = GoogleCalendarService()
    event = calendar_service.create_calendar_event(
        summary=f"{instructor.first_name} {instructor.last_name}/{city.city_abbreviation}/{lesson.alias}/{student.first_name} {student.last_name}",
        location=f"{city.name}, {city.state}//{city.city_abbreviation}",
        description=f"Student Info:\nEmergency Contact: {parent_contact}\nCellphone: {student_profile.cell_phone}\nEmail: {student.email}\nAddress: {student_profile.address}\nCity: {city.name}\nPickup: {appointment_data.pickup_text}\nInstructor Name: {instructor.first_name} {instructor.last_name}#{vehicle.brand} {vehicle.model} {vehicle.color}\n\nLesson Info:\nName: {lesson.name}\nDuration: {lesson.duration} hours\n\n",
        appointment_date=appointment_data.appointment_date,  # type: ignore
        start_time=appointment_data.start_time,  # type: ignore
        end_time=appointment_data.end_time,  # type: ignore
    )
    if not event:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error occurred while creating the calendar event",
        )

    return {"message": "Appointment created successfully"}


@router.put("/update/{pk}")
def update_appointment(
    pk: int,
    appointment_data: AppointmentUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API for updating appointment

    Args:
        pk (int): appointment id
        appointment_data (AppointmentUpdateSchema, optional): Data to update.
        current_user (Any, optional):
            Currently logged_in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Returns:
        message: Appointment updated successfully
    """
    message = {"message": "Appointment updated successfully"}

    # Retrieve the appointment by ID
    appointment = (
        db.query(StudentAppointment).filter(StudentAppointment.id == pk).first()
    )
    if appointment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No appointment found",
        )

    # Update Odometer if provided
    if appointment_data.odometer is not None:
        vehicle_id = (
            db.query(Vehicle).filter(Vehicle.id == appointment.vehicle_id).first()
        )
        if vehicle_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Vehicle not found",
            )
        try:
            setattr(vehicle_id, "odometer", appointment_data.odometer)
            db.add(vehicle_id)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} occurred while updating the vehicle odometer",
            ) from e

    # Update Status if provided
    if appointment_data.status_id is not None:
        status_exists = (
            db.query(AppointmentStatus)
            .filter(AppointmentStatus.id == appointment_data.status_id)
            .first()
        )
        if status_exists is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Status not found",
            )
            # Retrieve the status cancelled
        cancelled_status = (
            db.query(AppointmentStatus)
            .filter(AppointmentStatus.name.lower().ilike("cancelled"))
            .first()
        )
        if (
            current_user.role != RoleEnum.ADMIN
            or RoleEnum.SUPER_ADMIN
            and appointment_data.status_id == cancelled_status
        ):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="You are not authorized to cancel the appointment",
            )

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
        if complete_status is not None:
            COMPLETED_STATUS_ID = complete_status.id
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Completed status not found",
            )
        if appointment.status_id == COMPLETED_STATUS_ID:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Appointment is already completed",
            )
        if appointment_data.status_id == COMPLETED_STATUS_ID:
            profile = (
                db.query(Profile)
                .filter(Profile.user_id == appointment.student_id)
                .first()
            )
            if profile is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Student not found",
                )
            duration = appointment.lesson.duration
            profile.lesson_duration = profile.lesson_duration + duration
            try:
                db.add(profile)
                db.commit()
            except Exception as e:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error: {e} occurred while updating the lesson duration",
                ) from e
            if profile.lesson_duration >= 6 and profile.lesson_duration < 8:
                certificate = (
                    db.query(Certificate)
                    .filter(
                        Certificate.certificate_type == CertificateTypeEnum.GOLD,
                        Certificate.is_assigned == False,  # noqa
                        Certificate.status == "NOT_ASSIGNED",
                    )
                    .first()
                )
                if certificate is None:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Unassigned certificate not found",
                    )
                try:
                    db.add(
                        UserCertificate(
                            user_profiles_id=profile.id,
                            certificate_id=certificate.id,
                        )
                    )
                    setattr(certificate, "is_assigned", True)
                    setattr(certificate, "status", UserCertificateStatusEnum.ASSIGNED)
                    db.add(certificate)
                    db.commit()
                except Exception as e:
                    db.rollback()
                    raise HTTPException(
                        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                        detail=f"Error: {e} occurred while creating certificate",
                    ) from e

                message = {
                    "message": "You have successfully completed 6 hours of driving lessons. "
                    "You have been assigned a certificate."
                }

    # Update other fields in appointment_data
    try:
        for attr in vars(appointment_data):
            if getattr(appointment_data, attr) is not None:
                setattr(appointment, attr, getattr(appointment_data, attr))

        db.add(appointment)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while updating the appointment",
        ) from e

    return message


@router.delete("/delete/{pk}")
def delete_appointment(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to delete appointment

    Args:
        pk (int): appointment id
        current_user (Any, optional):
            Currently logged_in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Appointment not found
        HTTPException: 500, Error occurred while deleting the appointment

    Returns:
        appointment_db: Deleted appointment
    """
    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    appointment_db = (
        db.query(StudentAppointment).filter(StudentAppointment.id == pk).first()
    )

    if appointment_db is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found"
        )

    try:
        db.delete(appointment_db)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e} occurred while deleting the appointment",
        ) from e

    return appointment_db
