from typing import Optional
from pydantic import BaseModel


class DriverEdQuestionBaseSchema(BaseModel):
    question: Optional[str] = None
    a: Optional[str] = None
    b: Optional[str] = None
    c: Optional[str] = None
    d: Optional[str] = None
    e: Optional[str] = None
    correct_answer: Optional[str] = None

    image: Optional[str] = None
    weight: Optional[int] = None

    unit_id: Optional[int] = None


class DriverEdQuestionResponseSchema(DriverEdQuestionBaseSchema):
    id: int

    class Config:
        orm_mode = True


class DriverEdQuestionResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    questions: Optional[DriverEdQuestionResponseSchema] = None


class DriverEdQuestionCreateSchema(DriverEdQuestionBaseSchema):
    pass


class DriverEdQuestionUpdateSchema(DriverEdQuestionBaseSchema):
    pass
