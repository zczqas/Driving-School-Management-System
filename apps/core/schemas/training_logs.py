from typing import Optional
from pydantic import (
    BaseModel,
)

from apps.common.enum import OrderEnum, TrainingLogsSortEnum
from apps.core.schemas.common import BaseResponseSchema


class TrainingLogBaseSchema(BaseModel):
    training_id: Optional[int] = None
    lesson_id: Optional[int] = None
    user_id: Optional[int] = None
    is_completed: Optional[bool] = None


class TrainingLogFilterSchema(BaseModel):
    training_id: Optional[int] = None
    lesson_id: Optional[int] = None
    user_id: Optional[int] = None
    is_completed: Optional[bool] = None
    sort: TrainingLogsSortEnum = TrainingLogsSortEnum.CREATED_AT
    order: OrderEnum = OrderEnum.DESC


class TrainingLogCreateSchema(TrainingLogBaseSchema):
    pass


class TrainingLogResponseSchema(TrainingLogBaseSchema, BaseResponseSchema):
    pass


class TrainingLogResponseSchemaTotal(BaseModel):
    total_count: int
    training_logs: list[TrainingLogResponseSchema]


class TrainingLogUpdateSchema(TrainingLogBaseSchema):
    pass
