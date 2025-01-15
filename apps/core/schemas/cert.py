from datetime import date, datetime
from typing import Optional

from pydantic import BaseModel

from apps.common.enum import (
    CertStatusEnum,
    CertTypeEnum,
)
from apps.common.enum import CertSortEnum, OrderEnum
from apps.core.schemas.common import CertProfileResponseSchema


class CertBaseSchema(BaseModel):
    certificate_id: Optional[str] = None
    user_profiles_id: Optional[int] = None
    instructor_id: Optional[int] = None
    status: Optional[CertStatusEnum] = CertStatusEnum.NOT_ISSUED
    certificate_type: Optional[CertTypeEnum] = CertTypeEnum.GOLD
    assigned_date: Optional[datetime] = None
    issued_date: Optional[datetime] = None


class CertResponseSchema(CertBaseSchema):
    id: Optional[int] = None
    user_profiles: Optional[CertProfileResponseSchema] = None
    instructor: Optional[CertProfileResponseSchema] = None


class CreateResponseSchemaTotal(BaseModel):
    total: int
    certs: list[CertResponseSchema]


class CertCreateSchema(CertBaseSchema):
    pass


class CertUpdateSchema(CertBaseSchema):
    pass


class CertFilterSchema(BaseModel):
    certificate_id: Optional[str] = None
    user_profiles_id: Optional[int] = None
    instructor_id: Optional[int] = None
    status: Optional[CertStatusEnum] = None
    certificate_type: Optional[CertTypeEnum] = None
    assigned_date: Optional[date] = None
    issued_date: Optional[date] = None
    order: Optional[OrderEnum] = OrderEnum.ASC
    sort: Optional[CertSortEnum] = CertSortEnum.ISSUED_DATE
