from datetime import date, time
from typing import List, Optional

from pydantic import BaseModel

from apps.common.enum import AvailabilitySortEnum, OrderEnum
from apps.core.schemas.city import CityResponseSchema
from apps.core.schemas.common import UserBasicInformationResponseSchema
from apps.core.schemas.vehicle import VehicleResponseSchema


class AvailabilityBaseSchema(BaseModel):
    user_id: Optional[int] = None
    from_: Optional[date] = None
    to_: Optional[date] = None
    available_date: Optional[date] = None
    available_day: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    city_id: Optional[List[int]] = None
    vehicle_id: Optional[int] = None
    is_booked: Optional[bool] = None
    is_recurring: Optional[bool] = False
    is_public: Optional[bool] = True
    is_active: Optional[bool] = True
    notes: Optional[str] = None


class AvailabilityMonthlyGetSchema(BaseModel):
    month: Optional[int] = None
    user_id: Optional[int] = None


class AvailabilityCreateSchema(AvailabilityBaseSchema):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class AvailabilityUpdateSchema(AvailabilityBaseSchema):
    pass


class AvailabilityResponseSchema(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    user: Optional[UserBasicInformationResponseSchema] = None
    available_day: Optional[int] = None
    available_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    notes: Optional[str] = None
    city: Optional[List[CityResponseSchema]] = None
    vehicle: Optional[VehicleResponseSchema] = None
    from_: Optional[date] = None
    to_: Optional[date] = None

    class Config:
        orm_mode = True


class AvailabilityFilterSchema(BaseModel):
    student_id: Optional[int] = None
    available_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    available_day: Optional[int] = None
    month: Optional[int] = None  # 1-12
    # city_id: Optional[int] = None
    created_by_id: Optional[int] = None
    vehicle_id: Optional[int] = None
    is_recurring: Optional[bool] = None
    is_booked: Optional[bool] = None
    is_public: Optional[bool] = None
    order: OrderEnum = OrderEnum.DESC
    sort: AvailabilitySortEnum = AvailabilitySortEnum.CREATED_AT
    is_deleted: Optional[bool] = False
    alternate_location: Optional[bool] = False
    from_: Optional[date] = None
    to_: Optional[date] = None
