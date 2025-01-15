from typing import Optional

from pydantic import BaseModel, field_validator

from apps.common.enum import OrderEnum, SchoolSortEnum
from apps.common.exception import ValidationErrorException


class SchoolOrganizationBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    zipcode: Optional[str] = None

    @field_validator("name")
    def must_not_be_empty(cls, value):  # pylint: disable=no-self-argument
        """Validate that the school name is not empty."""
        if not value:
            raise ValidationErrorException("School name is required")
        return value


class SchoolOrganizationCreate(SchoolOrganizationBase):
    pass


class SchoolUpdateSchema(SchoolOrganizationBase):
    pass


class SchoolResponseSchema(SchoolOrganizationBase):
    id: Optional[int] = None

    class Config:
        form_attributes = True


class SchoolResponseSchemaTotal(BaseModel):
    total_count: int
    school: list[SchoolResponseSchema]

    class Config:
        form_attributes = True


class SchoolFilterSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    zipcode: Optional[str] = None
    order: OrderEnum = OrderEnum.DESC
    sort: SchoolSortEnum = SchoolSortEnum.CREATED_AT

    class Config:
        form_attributes = True
