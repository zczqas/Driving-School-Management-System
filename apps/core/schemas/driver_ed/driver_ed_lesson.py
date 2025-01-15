from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class DriverEdLessonBaseSchema(BaseModel):
    title: Optional[str] = None

    unit_id: Optional[int] = None


class DriverEdLessonLogResponseSchema(BaseModel):
    lesson_id: Optional[int] = None
    unit_id: Optional[int] = None
    user_id: Optional[int] = None
    is_passed: Optional[bool] = None
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class DriverEdLessonResponseSchema(DriverEdLessonBaseSchema):
    id: Optional[int] = None
    ed_id: Optional[int] = None

    class Config:
        orm_mode = True


class DriverEdLessonResponseLogSchema(BaseModel):
    lesson: Optional[list[DriverEdLessonResponseSchema]] = None
    lesson_log: Optional[list[DriverEdLessonLogResponseSchema]] = None


class DriverEdLessonResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    questions: Optional[DriverEdLessonBaseSchema] = None


class DriverEdQuestionCreateSchema(DriverEdLessonBaseSchema):
    pass


class DriverEdQuestionUpdateSchema(DriverEdLessonBaseSchema):
    pass
