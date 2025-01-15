from typing import Optional
from pydantic import BaseModel

from apps.common.enum import (
    AppointmentStatuSortEnum,
    OrderEnum,
)
from apps.core.schemas.common import BaseResponseSchema


class AppointmentStatusBaseSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class AppointmentStatusCreateSchema(AppointmentStatusBaseSchema):
    pass


class AppointmentStatusUpdateSchema(AppointmentStatusBaseSchema):
    pass


class AppointmentStatusFilterSchema(BaseModel):
    id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: AppointmentStatuSortEnum = AppointmentStatuSortEnum.CREATED_AT


class AppointmentStatusResponseSchema(AppointmentStatusBaseSchema, BaseResponseSchema):
    status_id: Optional[int] = None


class AppointmentStatusResponseSchemaTotal(BaseModel):
    total: int
    appointment_status: Optional[list[AppointmentStatusResponseSchema]] = None
