from typing import List, Optional
from datetime import date, time
from pydantic import (
    BaseModel,
    field_validator,
    root_validator,
)

from apps.common.enum import InstructorAvailabilitySortEnum, OrderEnum
from apps.common.exception import RequestValidationError


class InstructorAvailabilityBase(BaseModel):
    availability_date: Optional[date]
    start_time: Optional[time]
    end_time: Optional[time]

    @field_validator("availability_date")
    def availability_date_must_be_valid(cls, v):  # pylint: disable=no-self-argument
        if v is not None:
            if v < date.today():
                raise RequestValidationError("availability_date must be a future date")
        return v

    @root_validator(pre=True, skip_on_failure=True)
    def end_time_must_be_after_start_time(
        cls, values
    ):  # pylint: disable=no-self-argument
        start_time = values.get("start_time")
        end_time = values.get("end_time")
        if start_time and end_time:
            if start_time >= end_time:
                raise RequestValidationError("end_time must be after start_time")
        return values


class InstructorAvailabilityCreate(InstructorAvailabilityBase):
    pass


class InstructorAvailabilityUpdate(BaseModel):
    availability_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class InstructorAvailabilityResponse(InstructorAvailabilityBase):
    id: int

    class Config:
        form_attributes = True


class InstructorAvailabilityResponseSchema(InstructorAvailabilityBase):
    id: int
    instructor_id: int

    class Config:
        form_attributes = True


class InstructorAvailabilityFilterSchema(BaseModel):
    availability_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    instructor_id: Optional[int] = None
    sort: InstructorAvailabilitySortEnum = InstructorAvailabilitySortEnum.UPDATED_AT
    order: OrderEnum = OrderEnum.DESC

    class Config:
        form_attributes = True


class InstructorAvailabilityResponseTotal(BaseModel):
    total: int
    instructor_slots: List[InstructorAvailabilityResponseSchema]
