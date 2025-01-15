from typing import Optional
from datetime import datetime

from pydantic import BaseModel

from apps.core.schemas.common import BaseResponseSchema


class PickupLocationBaseSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class PickupLocationTypeCreateSchema(PickupLocationBaseSchema):
    pass


class PickupLocationTypeResponseSchema(PickupLocationBaseSchema, BaseResponseSchema):
    pass


class PickupLocationTypeResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    pickup_location_types: Optional[list[PickupLocationTypeResponseSchema]] = None


class PickupLocationTypeCreateResponseSchema(BaseModel):
    message: Optional[str] = None
    data: Optional[PickupLocationTypeResponseSchema] = None


class PickupLocationUpdateSchema(PickupLocationBaseSchema):
    pass
