from typing import Optional
from pydantic import BaseModel

from apps.common.enum import (
    AppointmentStatuSortEnum,
    OrderEnum,
)
from apps.core.schemas.common import BaseResponseSchema


class AppointmentScheduleStatusBaseSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    apply_fine: Optional[bool] = False


class AppointmentScheduleStatusCreateSchema(AppointmentScheduleStatusBaseSchema):
    pass


class AppointmentScheduleStatusUpdateSchema(AppointmentScheduleStatusBaseSchema):
    pass


class AppointmentScheduleStatusFilterSchema(BaseModel):
    id: Optional[int] = None
    apply_fine: Optional[bool] = None
    order: OrderEnum = OrderEnum.DESC
    sort: AppointmentStatuSortEnum = AppointmentStatuSortEnum.CREATED_AT


class AppointmentScheduleStatusResponseSchema(
    AppointmentScheduleStatusBaseSchema, BaseResponseSchema
):
    pass


class AppointmentScheduleStatusResponseSchemaTotal(BaseModel):
    total: int
    appointment_schedule_status: Optional[
        list[AppointmentScheduleStatusResponseSchema]
    ] = None
