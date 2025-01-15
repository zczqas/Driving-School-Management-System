from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from apps.common.enum import (
    GenderEnum,
    OrderEnum,
    RoleEnum,
    RoleFilterEnum,
    UserSortEnum,
)
from apps.core.schemas.package import PackageResponseSchema
from apps.core.schemas.permit_information import PermitInformationUserResponseSchema
from apps.core.schemas.profile import (
    AdditionalRoleResponseSchema,
    ProfileResponseSchema,
)
from apps.core.schemas.school_organization import (
    SchoolOrganizationBase,
    SchoolResponseSchema,
)
from apps.core.schemas.transaction import TransactionResponseUserSchema


class UserCreateSchema(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    cell_phone: Optional[str] = None
    password: str
    school_id: Optional[int] = None
    driving_school_id: Optional[list[int]] = None
    role: RoleEnum = RoleEnum.STUDENT


class AdminUserCreateSchema(UserCreateSchema):
    cell_phone: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    gender: Optional[GenderEnum] = None
    dob: Optional[date] = None
    school_id: Optional[int] = None
    address: Optional[str] = None


class UserResponseSchema(BaseModel):
    id: Optional[int] = None
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    is_active: Optional[bool] = None
    role: Optional[RoleEnum] = None
    additional_roles: Optional[list[AdditionalRoleResponseSchema]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    school: Optional[SchoolOrganizationBase] = None
    driving_school: Optional[List[SchoolResponseSchema]] = None
    package: Optional[list[PackageResponseSchema]] = None
    transactions: Optional[list[TransactionResponseUserSchema]] = None
    permit_information: Optional[list[PermitInformationUserResponseSchema]] = None


class UserResponseSchemaTotal(BaseModel):
    total_count: int
    users: Optional[list[UserResponseSchema]] = []


class UserFilterSchema(BaseModel):
    name: Optional[str] = None
    first_name: Optional[str] = None
    email: Optional[str] = None
    driving_school_id: Optional[int] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None
    order: OrderEnum = OrderEnum.DESC
    sort: UserSortEnum = UserSortEnum.UPDATED_AT
    role: RoleFilterEnum = RoleFilterEnum.ALL


class WebUserCreateSchema(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    password: str
    package_id: Optional[List[int]] = None
    dob: Optional[date] = None
    school_id: Optional[int] = None
    gender: Optional[GenderEnum] = None
    role: RoleEnum = RoleEnum.STUDENT
    cell_phone: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None


class AdminUserCreateResponseSchema(BaseModel):
    message: Optional[str] = None
    user: Optional[UserResponseSchema] = None
    profile: Optional[ProfileResponseSchema] = None
