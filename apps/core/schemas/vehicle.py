from typing import Optional

from pydantic import BaseModel

from apps.common.enum import OrderEnum, VehicleSortEnum
from apps.core.schemas.common import BaseResponseSchema


class VehicleBaseSchema(BaseModel):
    plate_number: Optional[str] = None
    color: Optional[str] = None
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    odometer: Optional[int] = None
    is_available: Optional[bool] = None


class VehicleCreateSchema(VehicleBaseSchema):
    pass


class VehicleUpdateSchema(VehicleBaseSchema):
    pass


class VehicleResponseSchema(VehicleBaseSchema, BaseResponseSchema):
    id: Optional[int] = None


class VehicleResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    vehicle: Optional[list[VehicleResponseSchema]] = None


class VehicleFilterSchema(VehicleBaseSchema):
    order: OrderEnum = OrderEnum.DESC
    sort: VehicleSortEnum = VehicleSortEnum.UPDATED_AT
