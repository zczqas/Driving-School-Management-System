from datetime import date
from typing import List, Optional

from pydantic import BaseModel

from apps.common.enum import CouponAssignableTypeEnum, OrderEnum


class UsersCouponBaseSchema(BaseModel):
    user_id: int
    coupon_id: int
    assigned: int


class UsersCouponCreateSchema(UsersCouponBaseSchema):
    pass


class UsersCouponRetrieveSchema(UsersCouponBaseSchema):
    used: int


class CouponBaseSchema(BaseModel):
    code: Optional[str] = None
    amount: Optional[float] = None
    min_purchase: Optional[float] = None
    max_uses: Optional[int] = None
    expiration: Optional[date] = None
    notes: Optional[str] = None
    type: Optional[CouponAssignableTypeEnum] = None


class CouponCreateSchema(CouponBaseSchema):
    pass


class CouponResponseSchema(CouponBaseSchema):
    id: int
    uses: int
    is_active: bool


class UpdateCouponSchema(CouponCreateSchema):
    is_active: Optional[bool] = None
    is_deleted: Optional[bool] = None


class RetrieveCouponResponseSchema(BaseModel):
    coupon: CouponResponseSchema
    coupon_users: List[UsersCouponRetrieveSchema]


class CouponFilterSchema(BaseModel):
    order: OrderEnum = OrderEnum.DESC
    user_id: Optional[int] = None
    available: Optional[bool] = None
    include_deleted: Optional[bool] = None
