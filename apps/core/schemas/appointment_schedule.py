from datetime import date, time
from typing import List, Optional

from pydantic import BaseModel

from apps.common.enum import (
    AppointmentScheduleSortEnum,
    OrderEnum,
)
from apps.core.schemas.appointment_schedule_status import (
    AppointmentScheduleStatusResponseSchema,
)
from apps.core.schemas.availability import AvailabilityResponseSchema

# from apps.core.schemas.common import UserBasicInformationResponseSchema
from apps.core.schemas.city import CityResponseSchema
from apps.core.schemas.common import BaseCreatedByResponseSchema
from apps.core.schemas.common_ext import UserAdditionalResponseSchema
from apps.core.schemas.driving_school import DrivingSchoolResponseSchema
from apps.core.schemas.instructor_notes import InstructorNotesScheduleResponseSchema
from apps.core.schemas.lesson import LessonResponseSchema
from apps.core.schemas.package import PackageResponseSchema

# from apps.core.schemas.pickup_location import PickupLocationTypeResponseSchema
# from apps.core.schemas.profile import PickupLocationResponse


class AppointmentScheduleBaseSchema(BaseModel):
    availability_id: Optional[int] = None
    student_id: Optional[int] = None
    scheduled_date: Optional[date] = None
    lesson_id: Optional[int] = None
    package_id: Optional[int] = None
    driving_school_id: Optional[int] = None
    pickup_location_id: Optional[int] = None
    pickup_location_type_id: Optional[int] = None
    pickup_location_text: Optional[str] = None
    notes: Optional[str] = None
    status_id: Optional[int] = None
    start_mileage: Optional[int] = None
    end_mileage: Optional[int] = None


class AppointmentScheduleCreateSchema(AppointmentScheduleBaseSchema):
    transaction_id: Optional[int] = None
    pass


class AppointmentScheduleResponseSchema(BaseModel):
    id: Optional[int] = None
    availability_id: Optional[int] = None
    availability: Optional[AvailabilityResponseSchema] = None
    scheduled_date: Optional[date] = None

    student_id: Optional[int] = None
    student: Optional[UserAdditionalResponseSchema] = None

    lesson_id: Optional[int] = None
    lesson: Optional[LessonResponseSchema] = None

    package_id: Optional[int] = None
    package: Optional[PackageResponseSchema] = None

    city_id: Optional[int] = None
    city: Optional[CityResponseSchema] = None

    pickup_location_id: Optional[int] = None
    # pickup_location: Optional[PickupLocationResponse] = None

    pickup_location_type_id: Optional[int] = None
    # pickup_location_type: Optional[PickupLocationTypeResponseSchema] = None

    driving_school_id: Optional[int] = None
    driving_school: Optional[DrivingSchoolResponseSchema] = None

    pickup_location_text: Optional[str] = None
    notes: Optional[str] = None
    instructor_notes: Optional[list[InstructorNotesScheduleResponseSchema]] = None

    time_in: Optional[time] = None
    time_out: Optional[time] = None

    start_mileage: Optional[int] = None
    end_mileage: Optional[int] = None

    status_id: Optional[int] = None
    status: Optional[AppointmentScheduleStatusResponseSchema] = None

    created_by: Optional[BaseCreatedByResponseSchema] = None


class AppointmentScheduleResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    appointment_schedule: Optional[List[AppointmentScheduleResponseSchema]] = None


class AppointmentScheduleFilterSchema(BaseModel):
    name: Optional[str] = None
    # email: Optional[str] = None
    student_id: Optional[int] = None
    instructor_id: Optional[int] = None
    availability_id: Optional[int] = None
    lesson_id: Optional[int] = None
    package_id: Optional[int] = None
    driving_school_id: Optional[int] = None
    pickup_location_id: Optional[int] = None
    pickup_location_type_id: Optional[int] = None
    created_by_id: Optional[int] = None
    city_id: Optional[int] = None
    month: Optional[int] = None
    scheduled_date: Optional[date] = None
    schedule_date_from: Optional[date] = None
    available_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    status_id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: AppointmentScheduleSortEnum = AppointmentScheduleSortEnum.CREATED_AT


# class AppointmentScheduleUpdateSchema(BaseModel):
#     time_in: Optional[time] = None
#     time_out: Optional[time] = None
#     status: Optional[AppointmentScheduleStatusEnum] = None
#     driving_school_id: Optional[int] = None


class AppointmentScheduleUpdateSchema(AppointmentScheduleBaseSchema):
    time_in: Optional[time] = None
    time_out: Optional[time] = None
    pass
