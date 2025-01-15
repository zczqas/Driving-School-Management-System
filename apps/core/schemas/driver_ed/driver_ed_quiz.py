from pydantic import BaseModel
from typing import Optional


class DriverEdQuiz(BaseModel):
    question_id: int
    selected_option: str


class DriverEdQuizDisplaySchema(BaseModel):
    id: Optional[int] = None

    question: Optional[str] = None
    a: Optional[str] = None
    b: Optional[str] = None
    c: Optional[str] = None
    d: Optional[str] = None
    e: Optional[str] = None

    weight: Optional[int] = None
    unit_id: Optional[int] = None
