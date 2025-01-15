from typing import Optional

from pydantic import BaseModel

from apps.core.schemas.driver_ed.driver_ed_unit import DriverEdUnitResponseSchema


class DriverEdSectionBaseSchema(BaseModel):
    title: Optional[str] = None
    text: Optional[str] = None
    reference: Optional[str] = None

    section_id_1: Optional[str] = None
    section_id_2: Optional[str] = None

    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None


class DriverEdSectionGetSchema(BaseModel):
    unit_id: Optional[int] = None
    lesson_id: Optional[int] = None


class DriverEdSectionResponseSchema(DriverEdSectionBaseSchema):
    id: Optional[int] = None
    title: Optional[str] = None
    text: Optional[str] = None
    reference: Optional[str] = None

    section_id_1: Optional[str] = None
    section_id_2: Optional[str] = None
    lesson_id: Optional[int] = None
    unit_id: Optional[int] = None
    unit: Optional[DriverEdUnitResponseSchema] = None


class DriverEdSectionResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    sections: Optional[DriverEdSectionResponseSchema] = None


class DriverEdSectionCreateSchema(DriverEdSectionResponseSchema):
    pass


class DriverEdSectionUpdateSchema(DriverEdSectionResponseSchema):
    pass
