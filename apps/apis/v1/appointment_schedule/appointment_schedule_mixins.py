from datetime import date, datetime, timedelta
from typing import Optional, Tuple

from fastapi import HTTPException, Query, status
from sqlalchemy import Column, or_
from sqlalchemy.orm import Session, aliased

from apps.common.enum import CertStatusEnum, CertTypeEnum
from apps.core.models.appointment_schedule import (
    AppointmentSchedule,
    AppointmentScheduleStatus,
)
from apps.core.models.availability import Availability
from apps.core.models.city import City
from apps.core.models.package import Lesson, Package
from apps.core.models.transaction import Transaction
from apps.core.models.users import Profile, Users
from apps.core.schemas.appointment_schedule import (
    AppointmentScheduleCreateSchema,
    AppointmentScheduleUpdateSchema,
)
from apps.apis.v1.cert.cert_mixins import CertMixins
from apps.core.schemas.cert import CertCreateSchema


class AppointmentScheduleFilterMixins:
    student = aliased(Users)
    instructor = aliased(Users)
    availability = aliased(Availability)

    @staticmethod
    def join_users_availability_table(query: Query) -> Query:
        query = query.join(
            AppointmentScheduleFilterMixins.student,
            AppointmentScheduleFilterMixins.student.id
            == AppointmentSchedule.student_id,
        )
        query = query.join(
            AppointmentScheduleFilterMixins.availability,
            AppointmentScheduleFilterMixins.availability.id
            == AppointmentSchedule.availability_id,
        )
        query = query.join(
            AppointmentScheduleFilterMixins.instructor,
            AppointmentScheduleFilterMixins.instructor.id
            == AppointmentScheduleFilterMixins.availability.user_id,
        )
        return query


class AppointmentScheduleMixins:
    @staticmethod
    def update_stale_appointments(db: Session) -> None:
        stale_appointments = (
            db.query(AppointmentSchedule)
            .filter(
                (AppointmentSchedule).scheduled_date < date.today() - timedelta(days=2)
            )
            .all()
        )
        if stale_appointments:
            complete_status = (
                db.query(AppointmentScheduleStatus)
                .filter(
                    or_(
                        AppointmentScheduleStatus.name.ilike("complete"),
                        AppointmentScheduleStatus.name.ilike("completed"),
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

    @staticmethod
    def validate_availability(db: Session, availability_id: int) -> Availability:
        availability = (
            db.query(Availability).filter(Availability.id == availability_id).first()
        )
        if not availability:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Availability with id {availability_id} not found",
            )
        return availability

    @staticmethod
    def validate_student(db: Session, student_id: int) -> Users:
        user = db.query(Users).filter(Users.id == student_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Student with id {student_id} not found",
            )
        if user.is_active is False:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account has been locked. Please pay fee to unlock.",
            )
        return user

    @staticmethod
    def validate_lesson(db: Session, lesson_id: Optional[int]) -> Optional[Lesson]:
        if lesson_id is None:
            return None
        lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lesson with id {lesson_id} not found",
            )
        return lesson

    @staticmethod
    def validate_package_and_user_permit(
        db: Session, package: Package, user: Users
    ) -> None:
        if package.permit and not user.permit_information:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please update your profile and provide permit information",
            )

    @staticmethod
    def validate_package(db: Session, package_id: Optional[int]) -> Optional[int]:
        if package_id is None:
            return None
        package = db.query(Package).filter(Package.id == package_id).first()
        if not package:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Package with id {package_id} not found",
            )
        return package

    @staticmethod
    def check_existing_appointment(
        db: Session, student_id: int, scheduled_date: date
    ) -> None:
        existing_appointment = (
            db.query(AppointmentSchedule)
            .filter(
                AppointmentSchedule.student_id == student_id,
                AppointmentSchedule.scheduled_date == scheduled_date,
            )
            .first()
        )
        if existing_appointment:
            user = db.query(Users).filter(Users.id == student_id).first()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"The following date is already scheduled for {user.first_name} {user.last_name}",  # type: ignore
            )

    @staticmethod
    def check_existing_instructor_appointment(
        db: Session,
        availability: Availability,
        appointment: AppointmentScheduleCreateSchema | AppointmentScheduleUpdateSchema,
    ) -> None:
        query = (
            db.query(AppointmentSchedule)
            .join(Availability, AppointmentSchedule.availability_id == Availability.id)
            .filter(
                AppointmentSchedule.availability_id == availability.id,
                AppointmentSchedule.scheduled_date == appointment.scheduled_date,
            )
        )

        if availability.available_date is not None:
            query = query.filter(
                AppointmentSchedule.scheduled_date == availability.available_date,
                # Availability.is_booked == True,  # noqa
            )

        if query.first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Instructor already has an appointment scheduled for this availability",
            )

    @staticmethod
    def check_existing_lesson_appointment(
        db: Session, student_id: int, lesson_id: int, package_id: int
    ) -> None:
        appointment_lesson = (
            db.query(AppointmentSchedule)
            .filter(
                AppointmentSchedule.student_id == student_id,
                AppointmentSchedule.lesson_id == lesson_id,
                AppointmentSchedule.package_id == package_id,
            )
            .first()
        )
        if appointment_lesson:
            user = db.query(Users).filter(Users.id == student_id).first()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Lesson already scheduled for {user.first_name} {user.last_name}",  # type: ignore
            )

    @staticmethod
    def check_time_conflict(
        db: Session, student_id: int, availability: Availability
    ) -> None:
        check_time = (
            db.query(AppointmentSchedule)
            .join(Availability, AppointmentSchedule.availability_id == Availability.id)
            .filter(
                AppointmentSchedule.student_id == student_id,
                Availability.start_time <= availability.start_time,
                Availability.end_time >= availability.end_time,
                AppointmentSchedule.scheduled_date == availability.available_date,
            )
            .first()
        )
        if check_time:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Time already scheduled for student",
            )

    @staticmethod
    def update_profile_lesson_assigned(
        db: Session, student_id: int, lesson_id: int
    ) -> None:
        user = db.query(Users).filter(Users.id == student_id).first()
        profile = user.profile  # type: ignore
        if profile.scheduled_lesson is None:
            profile.scheduled_lesson = []
        profile.scheduled_lesson.append(lesson_id)
        try:
            db.add(user)
            db.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    @staticmethod
    def update_transaction_lesson_assigned(
        db: Session, transaction_id: int, lesson_id: int
    ) -> None:
        transaction = (
            db.query(Transaction).filter(Transaction.id == transaction_id).first()
        )
        if not transaction:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Transaction not found"
            )

        if transaction.scheduled_lesson is None:
            transaction.scheduled_lesson = []  # type: ignore
        transaction.scheduled_lesson.append(lesson_id)
        try:
            db.add(transaction)
            db.commit()
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    @staticmethod
    def update_appointment_city(
        db: Session, appointment: AppointmentSchedule, student_id: int
    ) -> None:
        profile = db.query(Profile).filter(Profile.user_id == student_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Profile not found"
            )
        city = db.query(City).filter(City.name.ilike(profile.city)).first()
        if not city:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Profile doesn't have city. Please update.",
            )
        appointment.city_id = city.id
        try:
            db.add(appointment)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    @classmethod
    def validate_appointment(
        cls,
        db: Session,
        appointment: AppointmentScheduleCreateSchema | AppointmentScheduleUpdateSchema,
    ) -> Tuple[Availability, Users, Optional[Lesson]]:
        availability = cls.validate_availability(db, appointment.availability_id)  # type: ignore
        student = cls.validate_student(db, appointment.student_id)  # type: ignore
        lesson = cls.validate_lesson(db, appointment.lesson_id)
        package = cls.validate_package(db, appointment.package_id)

        cls.check_existing_appointment(
            db, appointment.student_id, appointment.scheduled_date  # type: ignore
        )

        if package:
            cls.validate_package_and_user_permit(db, package, student)

        if appointment.scheduled_date is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide scheduled date",
            )

        cls.check_existing_instructor_appointment(db, availability, appointment)

        if appointment.lesson_id:
            cls.check_existing_lesson_appointment(
                db, appointment.student_id, appointment.lesson_id, appointment.package_id  # type: ignore
            )

        cls.check_time_conflict(db, appointment.student_id, availability)  # type: ignore
        return availability, student, lesson

    @classmethod
    def validate_time_in_time_out(
        cls, time_in: Optional[str], time_out: Optional[str]
    ) -> None:
        if not time_in and time_out:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide time in",
            )

        if not time_out and time_in:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please provide time out",
            )

        if time_in >= time_out:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Time in should be less than time out",
            )

    def calculate_two_working_weeks(self, start_date: date) -> date:
        """This function calculates two working weeks from the given date

        Args:
            start_date (date): The date from which the two working weeks should be calculated

        Returns:
            date: calculated date
        """
        days_added = 0
        current_date = start_date
        while days_added < 10:
            current_date += timedelta(days=1)
            if current_date.weekday() < 5:  # Monday to Friday are 0-4
                days_added += 1
        return current_date


class AppointmentScheduleCertificateMixins:
    @staticmethod
    def get_appointment_schedule(
        db: Session, appointment_id: int
    ) -> AppointmentSchedule:
        appointment_schedule = (
            db.query(AppointmentSchedule)
            .filter(AppointmentSchedule.id == appointment_id)
            .first()
        )
        if not appointment_schedule:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Appointment schedule with id {appointment_id} not found",
            )
        return appointment_schedule

    @staticmethod
    def get_completed_status_id(db: Session) -> Column[int]:
        complete_status = (
            db.query(AppointmentScheduleStatus)
            .filter(AppointmentScheduleStatus.name.ilike("completed"))
            .first()
        )
        if not complete_status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Status 'completed' not found",
            )
        return complete_status.id

    @staticmethod
    def update_profile_lesson_duration(
        db: Session, profile_id: int, lesson_duration: int
    ) -> int:
        profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="Profile not found"
            )
        profile.lesson_duration += lesson_duration  # type: ignore
        try:
            db.add(profile)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e
        return profile.lesson_duration  # type: ignore

    @classmethod
    def assign_certificate(
        cls, db: Session, appointment_id: int, user_id: int
    ) -> str | None:
        user = db.query(Users).filter(Users.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail="User not found"
            )
        profile_id = user.profile.id

        appointment_schedule = cls.get_appointment_schedule(db, appointment_id)
        complete_status_id = cls.get_completed_status_id(db)
        if appointment_schedule.status_id == complete_status_id:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Appointment already completed",
            )
        lesson_duration = appointment_schedule.lesson.duration

        completed_duration = cls.update_profile_lesson_duration(
            db, profile_id, lesson_duration
        )
        existing_cert = CertMixins.existing_certificate(db, profile_id)
        right_age = CertMixins.check_user_age(user.profile)

        if completed_duration >= 6 and not existing_cert and not right_age:
            # Get the instructor ID from the appointment where the student crossed 6 hours.
            last_appointment = (
                db.query(AppointmentSchedule)
                .filter(AppointmentSchedule.id == appointment_id)
                .first()
            )
            if not last_appointment:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="No appointments found",
                )
            instructor_id = last_appointment.availability.user_id
            passed_instructor = (
                db.query(Profile).filter(Profile.user_id == instructor_id).first()
            )
            passed_instructor_id = passed_instructor.id
            try:
                cert = CertCreateSchema(
                    user_profiles_id=profile_id,
                    instructor_id=passed_instructor_id,
                    status=CertStatusEnum.NOT_ISSUED,
                    assigned_date=datetime.now(),
                    certificate_type=CertTypeEnum.GOLD,
                )
                CertMixins.create_cert(
                    db=db,
                    cert=cert,
                )
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
                ) from e

            return "You have successfully completed 6 hours of driving lessons. You have been assigned a certificate."

        return None
