from typing import Optional
from pydantic import BaseModel

from apps.common.enum import InstructorNotesSortEnum, OrderEnum
from apps.core.schemas.common import BaseProfileUserResponseSchema, BaseResponseSchema


class InstructorNotesBaseSchema(BaseModel):
    note: Optional[str] = None
    instructor_id: Optional[int] = None
    student_id: Optional[int] = None
    appointment_schedule_id: Optional[int] = None


class InstructorNotesCreateSchema(BaseModel):
    note: Optional[str] = None
    student_id: Optional[int] = None
    appointment_schedule_id: Optional[int] = None


class InstructorNotesScheduleResponseSchema(BaseModel):
    id: Optional[int] = None
    note: Optional[str] = None
    instructor_id: Optional[int] = None
    instructor: Optional[BaseProfileUserResponseSchema] = None
    student_id: Optional[int] = None


class InstructorNotesResponseSchema(InstructorNotesBaseSchema, BaseResponseSchema):
    instructor: Optional[BaseProfileUserResponseSchema] = None


class InstructorNotesResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    instructor_notes: Optional[list[InstructorNotesResponseSchema]] = []


class InstructorNotesUpdateSchema(InstructorNotesBaseSchema):
    pass


class InstructorNotesFilterSchema(BaseModel):
    student_id: Optional[int] = None
    instructor_id: Optional[int] = None
    appointment_schedule_id: Optional[int] = None
    notes_id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: InstructorNotesSortEnum = InstructorNotesSortEnum.CREATED_AT
