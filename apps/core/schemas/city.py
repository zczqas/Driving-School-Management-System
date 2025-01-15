from typing import Optional
from pydantic import BaseModel

from apps.common.enum import CitySortEnum, OrderEnum
from apps.core.schemas.common import BaseResponseSchema


class CityBaseSchema(BaseModel):
    name: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    city_abbreviation: Optional[str] = None


class CityCreateSchema(CityBaseSchema):
    pass


class CityUpdateSchema(CityBaseSchema):
    pass


class CityResponseSchema(CityBaseSchema, BaseResponseSchema):
    id: Optional[int] = None


class CityResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    city: Optional[list[CityResponseSchema]] = None


class CityFilterSchema(CityBaseSchema):
    city_id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: CitySortEnum = CitySortEnum.UPDATED_AT
