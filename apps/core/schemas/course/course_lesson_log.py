from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class CourseLessonLogBaseSchema(BaseModel):
    lesson_id: Optional[int] = None
    unit_id: Optional[int] = None
    user_id: Optional[int] = None
    is_passed: Optional[bool] = None
    updated_at: Optional[datetime] = None
    created_at: Optional[datetime] = None


class CourseLessonLogResponseSchema(CourseLessonLogBaseSchema):
    id: Optional[int] = None
