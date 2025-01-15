from typing import Optional

from pydantic import BaseModel

from apps.core.schemas.course.course_unit import CourseUnitResponseSchema


class CourseLessonBaseSchema(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    unit_id: Optional[int] = None
    video_url: Optional[str] = None
    video_name: Optional[str] = None
    image_url: Optional[str] = None
    image_name: Optional[str] = None


class CourseLessonResponseSchema(CourseLessonBaseSchema):
    id: Optional[int] = None
    is_passed: Optional[bool] = None
    unit: Optional[CourseUnitResponseSchema] = None


class CourseLessonCreateSchema(CourseLessonBaseSchema):
    pass


class CourseLessonVideoSchema(BaseModel):
    name: Optional[str] = None
    unit_id: Optional[int] = None
