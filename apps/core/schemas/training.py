from typing import Optional, List
from pydantic import BaseModel

from apps.common.enum import OrderEnum, TrainingSortEnum
from apps.core.schemas.common import BaseResponseSchema


class TrainingBaseSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class TrainingCreateSchema(TrainingBaseSchema):
    pass


class TrainingResponseSchema(TrainingBaseSchema, BaseResponseSchema):
    pass


class TrainingResponseSchemaTotal(BaseModel):
    total_count: int
    trainings: List[TrainingResponseSchema]


class TrainingUpdateSchema(TrainingBaseSchema):
    pass


class TrainingFilterSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    sort: TrainingSortEnum = TrainingSortEnum.CREATED_AT
    order: OrderEnum = OrderEnum.DESC
