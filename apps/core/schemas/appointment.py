from datetime import date, time
from typing import List, Optional

from pydantic import BaseModel, field_validator

from apps.common.enum import AppointmentSortEnum, OrderEnum
from apps.common.exception import ValidationErrorException
from apps.core.schemas.appointment_status import AppointmentStatusResponseSchema
from apps.core.schemas.common import BaseCreatedByResponseSchema, BaseResponseSchema
from apps.core.schemas.instructor_notes import InstructorNotesResponseSchema
from apps.core.schemas.lesson import LessonResponseSchema
from apps.core.schemas.package import PackageResponseSchema
from apps.core.schemas.pickup_location import PickupLocationTypeResponseSchema
from apps.core.schemas.profile import (
    AppointmentUserStudentResponseSchema,
    PickupLocationResponse,
)
from apps.core.schemas.transaction import TransactionResponseSchema
from apps.core.schemas.vehicle import VehicleResponseSchema


class AppointmentBase(BaseModel):
    student_id: Optional[int] = None
    instructor_id: Optional[int] = None
    appointment_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    lesson_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    city_id: Optional[int] = None
    pickup_location_id: Optional[int] = None
    pickup_location_type_id: Optional[int] = None

    status_id: Optional[int] = None
    note: Optional[str] = None
    pickup_text: Optional[str] = None

    actual_start_time: Optional[time] = None
    actual_end_time: Optional[time] = None

    mileage = Optional[int] = None


class AppointmentCreateSchema(AppointmentBase):
    package_id: Optional[int] = None
    transaction_id: Optional[int] = None

    @field_validator("start_time", "end_time", "appointment_date")
    def not_empty(cls, v):  # pylint: disable=no-self-argument
        """Validate start time, end time and appointment date"""
        if not v:
            raise ValidationErrorException(
                "Start time, end time and appointment date are required"
            )
        return v

    @field_validator("appointment_date")
    def appointment_date_validator(cls, v):  # pylint: disable=no-self-argument
        """Validate appointment date"""
        if v < date.today():
            raise ValidationErrorException("Appointment date cannot be in the past")
        return v

    @field_validator("instructor_id", "student_id")
    def instruction_student_id_validator(cls, v):  # pylint: disable=no-self-argument
        """Validate instruction and student id"""
        if not v:
            raise ValidationErrorException("Instruction and student id cannot be empty")
        return v


class AppointmentFilterSchema(BaseModel):
    appointment_id: Optional[int] = None

    student_id: Optional[int] = None
    student_name: Optional[str] = None

    instructor_id: Optional[int] = None
    instructor_name: Optional[str] = None

    name: Optional[str] = None

    appointment_date: Optional[date] = None
    appointment_date_from: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

    order: OrderEnum = OrderEnum.DESC
    sort: AppointmentSortEnum = AppointmentSortEnum.CREATED_AT


class AppointmentStudentResponseSchema(BaseModel):
    id: int
    first_name: str
    middle_name: Optional[str] = None
    last_name: str
    email: str


class AppointmentResponseSchema(AppointmentBase, BaseResponseSchema):
    note: Optional[str] = None
    pickup_text: Optional[str] = None

    instructor: Optional[AppointmentUserStudentResponseSchema] = None
    student: Optional[AppointmentUserStudentResponseSchema] = None

    package_id: Optional[int] = None
    package: Optional[PackageResponseSchema] = None
    lesson: Optional[LessonResponseSchema] = None

    vehicle: Optional[VehicleResponseSchema] = None

    pickup_location: Optional[PickupLocationResponse] = None
    pickup_location_type: Optional[PickupLocationTypeResponseSchema] = None

    status_id: Optional[int] = None
    status: Optional[AppointmentStatusResponseSchema] = None

    instructor_notes: Optional[list[InstructorNotesResponseSchema]] = None
    created_by: Optional[BaseCreatedByResponseSchema] = None

    transaction_id: Optional[int] = None
    transactions: Optional[TransactionResponseSchema] = None


class AppointmentResponseSchemaTotal(BaseModel):
    total_count: int
    appointments: Optional[List[AppointmentResponseSchema]]


class AppointmentUpdateSchema(BaseModel):
    vehicle_id: Optional[int] = None
    appointment_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status_id: Optional[int] = None
    actual_start_time: Optional[time] = None
    actual_end_time: Optional[time] = None
    mileage: Optional[int] = None
    odometer: Optional[int] = None
    lesson_id: Optional[int] = None
