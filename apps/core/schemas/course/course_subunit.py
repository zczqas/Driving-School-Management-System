from typing import List, Optional
from pydantic import BaseModel


class CourseSubunitBaseSchema(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    reference: Optional[str] = None
    section_id_1: Optional[str] = None
    section_id_2: Optional[str] = None
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None


class CourseSubunitCreateSchema(CourseSubunitBaseSchema):
    pass


class CourseSubunitResponseSchema(CourseSubunitBaseSchema):
    id: Optional[int] = None

    class Config:
        orm_mode = True


class CourseSubunitResponseSchemaTotal(BaseModel):
    total: int
    course_subunit: List[CourseSubunitResponseSchema] = []

    class Config:
        orm_mode = True


class CourseSubunitGetSchema(BaseModel):
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None
