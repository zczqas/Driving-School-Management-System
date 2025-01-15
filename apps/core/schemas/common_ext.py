from datetime import date
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from apps.common.enum import RoleEnum
from apps.core.schemas.profile import ContactInformationResponse

"""
this module is created as an extension of common.py module
in order to avoid circular import error
"""


class BaseProfileResponseSchema(BaseModel):
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None
    dob: Optional[date] = None
    cell_phone: Optional[str] = None
    contact_information: Optional[List[ContactInformationResponse]] = []


class UserAdditionalResponseSchema(BaseModel):
    id: Optional[int] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[RoleEnum] = None
    profile: Optional[BaseProfileResponseSchema] = None
