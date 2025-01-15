from typing import Optional

from pydantic import BaseModel

from apps.core.schemas.course.course_unit import CourseUnitResponseSchema


class CourseQuizSchema(BaseModel):
    question_id: int
    selected_option: str


class CourseQuizDisplaySchema(BaseModel):
    id: Optional[int] = None

    question: Optional[str] = None
    a: Optional[str] = None
    b: Optional[str] = None
    c: Optional[str] = None
    d: Optional[str] = None
    e: Optional[str] = None

    correct_answer: Optional[str] = None

    weight: Optional[int] = None
    unit_id: Optional[int] = None
    unit: Optional[CourseUnitResponseSchema] = None
