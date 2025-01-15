from datetime import datetime, date
from typing import Optional

from pydantic import BaseModel, EmailStr

from apps.common.enum import RoleEnum


class BaseResponseSchema(BaseModel):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    is_deleted: Optional[bool] = None


class BaseCreatedByResponseSchema(BaseModel):
    id: Optional[int] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None


class UserBasicInformationResponseSchema(BaseModel):
    id: Optional[int] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[RoleEnum] = None


class BaseProfileUserResponseSchema(BaseModel):
    user: Optional[UserBasicInformationResponseSchema] = None


class CertProfileResponseSchema(BaseProfileUserResponseSchema):
    dob: Optional[date] = None
