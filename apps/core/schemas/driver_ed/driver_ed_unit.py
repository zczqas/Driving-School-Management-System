from typing import List, Optional

from pydantic import BaseModel


class DriverEdUnitBaseSchema(BaseModel):
    title: Optional[str] = None
    purpose: Optional[str] = None


class DriverEdUnitResponseSchema(DriverEdUnitBaseSchema):
    # sections: Optional[List[DriverEdSectionResponseSchema]] = None
    # questions: Optional[List[DriverEdQuestionResponseSchema]] = None
    id: int


class DriverEdUnitResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    units: Optional[List[DriverEdUnitResponseSchema]] = None


class DriverEdUnitCreateSchema(DriverEdUnitBaseSchema):
    pass


class DriverEdUnitUpdateSchema(DriverEdUnitBaseSchema):
    pass
