from pydantic import BaseModel
from typing import Optional
from datetime import date

from apps.common.enum import DayOffSortEnum, OrderEnum


class DayOffBaseSchema(BaseModel):
    user_id: Optional[int] = None
    from_: Optional[date] = None
    to_: Optional[date] = None
    day_: Optional[int] = None
    reason: Optional[str] = None


class DayOffFilterSchema(BaseModel):
    user_id: Optional[int] = None
    from_: Optional[date] = None
    to_: Optional[date] = None
    day_: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: DayOffSortEnum = DayOffSortEnum.CREATED_AT


class DayOffCreateSchema(DayOffBaseSchema):
    pass


class DayOffResponseSchema(DayOffBaseSchema):
    id: Optional[int] = None


class DayOffListResponseSchema(BaseModel):
    total: Optional[int] = None
    day_offs: Optional[list[DayOffResponseSchema]] = None


class DayOffUpdateSchema(DayOffBaseSchema):
    pass


class DayOffDeleteFromRangeSchema(BaseModel):
    from_: Optional[date] = None
    to_: Optional[date] = None
