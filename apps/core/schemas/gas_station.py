from typing import Optional
from pydantic import BaseModel, EmailStr

from apps.common.enum import GasStationSortEnum, OrderEnum
from apps.core.schemas.city import CityResponseSchema
from apps.core.schemas.common import BaseResponseSchema


class GasStationBaseSchema(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city_id: Optional[int] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    notes: Optional[str] = None


class GasStationCreateSchema(GasStationBaseSchema):
    pass


class GasStationUpdateSchema(GasStationBaseSchema):
    pass


class GasStationResponseSchema(GasStationBaseSchema, BaseResponseSchema):
    id: Optional[int] = None
    city: Optional[CityResponseSchema] = None


class GasStationResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    gas_station: Optional[list[GasStationResponseSchema]] = None


class GasStationFilterSchema(GasStationBaseSchema):
    id: Optional[int] = None
    order: OrderEnum = OrderEnum.DESC
    sort: GasStationSortEnum = GasStationSortEnum.CREATED_AT
