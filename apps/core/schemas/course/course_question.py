from typing import Optional
from pydantic import BaseModel


class CourseQuestionBaseSchema(BaseModel):
    question: Optional[str] = None
    a: Optional[str] = None
    b: Optional[str] = None
    c: Optional[str] = None
    d: Optional[str] = None
    e: Optional[str] = None
    correct_answer: Optional[str] = None
    image: Optional[str] = None
    unit_id: Optional[int] = None


class CourseQuestionCreateSchema(CourseQuestionBaseSchema):
    pass
