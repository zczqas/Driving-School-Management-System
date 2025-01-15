from typing import Optional
from fastapi import Form
from pydantic import (
    BaseModel,
    ValidationInfo,
    field_validator,
)

from apps.common.enum import LessonSortEnum, OrderEnum
from apps.common.exception import ValidationErrorException


class LessonBaseSchema(BaseModel):
    lesson_no: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    alias: Optional[str] = None
    duration: Optional[float] = None
    is_active: Optional[bool] = True
    is_online: Optional[bool] = False
    price: Optional[float] = None

    @field_validator("duration", "price")
    def cannot_be_negative(
        cls, value, info: ValidationInfo
    ):  # pylint: disable=no-self-argument
        """Validate duration and price"""
        if value is not None:
            if value < 0:
                raise ValidationErrorException(
                    f"{info.field_name} must be greater than 0"
                )
            return value
        else:
            return value


class LessonCreateSchema(LessonBaseSchema):
    pass


class LessonResponseSchema(LessonBaseSchema):
    id: Optional[int] = None


class LessonResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    lessons: list[LessonResponseSchema] = []


class LessonUpdateSchema(LessonBaseSchema):
    pass


class LessonFilterSchema(BaseModel):
    lesson_no: Optional[int] = Form(None)
    name: Optional[str] = Form(None)
    description: Optional[str] = Form(None)
    price: Optional[float] = Form(None)
    duration: Optional[float] = Form(None)
    is_active: Optional[bool] = Form(None)
    is_online: Optional[bool] = Form(None)
    order: OrderEnum = OrderEnum.DESC
    sort: LessonSortEnum = LessonSortEnum.CREATED_AT
