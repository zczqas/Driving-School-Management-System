from typing import List, Optional
from pydantic import BaseModel

from apps.core.schemas.course.course import CourseResponseSchema


class CourseUnitBaseSchema(BaseModel):
    title: Optional[str] = None
    purpose: Optional[str] = None
    course_id: Optional[int] = None


class CourseUnitCreateSchema(CourseUnitBaseSchema):
    pass


class CourseUnitResponseSchema(CourseUnitBaseSchema):
    id: Optional[int] = None
    course: Optional[CourseResponseSchema] = None

    class Config:
        orm_mode = True


class CourseUnitResponseSchemaTotal(BaseModel):
    total: int
    course_unit: List[CourseUnitResponseSchema] = []

    class Config:
        orm_mode = True
