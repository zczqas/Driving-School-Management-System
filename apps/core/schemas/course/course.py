from typing import List, Optional
from pydantic import BaseModel

from apps.common.enum import CourseSortEnum, OrderEnum


class CourseBaseSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None


class CourseFilterSchema(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    # unit_id: Optional[int] = None
    # lesson_id: Optional[int] = None
    # subunit_id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: CourseSortEnum = CourseSortEnum.UPDATED_AT


class CourseCreateSchema(CourseBaseSchema):
    pass


class CourseResponseSchema(CourseBaseSchema):
    id: Optional[int] = None
    # unit: Optional[CourseUnitResponseSchema] = None
    # lesson: Optional[CourseLessonResponseSchema] = None
    # subunit: Optional[CourseSubunitResponseSchema] = None

    class Config:
        orm_mode = True


class CourseResponseSchemaTotal(BaseModel):
    total: int
    courses: List[CourseResponseSchema] = []

    class Config:
        orm_mode = True
