from pydantic import BaseModel, EmailStr
from typing import Optional

from datetime import date

from apps.common.enum import RoleEnum
from apps.core.schemas.common import UserBasicInformationResponseSchema


class PermitInformationBase(BaseModel):
    permit_number: Optional[str] = None
    permit_issue_date: Optional[date] = None
    permit_expiration_date: Optional[date] = None
    permit_endorse_date: Optional[date] = None
    permit_endorse_by_id: Optional[int] = None


class PermitInformationResponseSchema(PermitInformationBase):
    id: Optional[int] = None


class PermitInformationUserResponseSchema(PermitInformationBase):
    id: Optional[int] = None
    permit_endorse_by: Optional[UserBasicInformationResponseSchema] = None
