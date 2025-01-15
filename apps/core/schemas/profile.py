from datetime import date
from typing import List, Optional

from pydantic import BaseModel, EmailStr

from apps.common.enum import (
    AdditionalRoleEnum,
    ContacTypEnum,
    GenderEnum,
    OrderEnum,
    RoleEnum,
    RoleFilterEnum,
    UserProfileSortEnum,
)
from apps.core.schemas.document import DocumentResponseSchema
from apps.core.schemas.instructor_notes import InstructorNotesResponseSchema
from apps.core.schemas.package import PackageResponseSchema
from apps.core.schemas.permit_information import PermitInformationUserResponseSchema
from apps.core.schemas.pickup_location import PickupLocationTypeResponseSchema
from apps.core.schemas.school_organization import (
    SchoolOrganizationBase,
    SchoolResponseSchema,
)
from apps.core.schemas.transaction import TransactionUserResponseSchema


class AdditionalRoleResponseSchema(BaseModel):
    id: Optional[int] = None
    role: Optional[AdditionalRoleEnum] = None


class AdditionalRoleUpdateSchema(BaseModel):
    role: Optional[AdditionalRoleEnum] = None


class ContactInformationBase(BaseModel):
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    contact_relationship: Optional[str] = None
    contact_type: Optional[str] = None


class ContactInformationCreate(ContactInformationBase):
    pass


class ContactInformationResponse(ContactInformationBase):
    id: Optional[int] = None


class ContactInformationUpdateSchema(ContactInformationResponse):
    pass


class ContactInformationResponseSchemaTotal(BaseModel):
    total: int
    contact_information: List[ContactInformationResponse]


class PickupLocationBase(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    pickup_location_type_id: Optional[int] = None
    pickup_location_type: Optional[PickupLocationTypeResponseSchema] = None


class PickupLocationCreate(PickupLocationBase):
    pass


class PickupLocationResponse(PickupLocationBase):
    id: int


class PickupLocationResponseSchemaTotal(BaseModel):
    total: int
    pickup_location: List[PickupLocationResponse]


class PickupLocationUpdateSchema(PickupLocationResponse):
    pass


class UserResponse(BaseModel):
    id: int
    email: EmailStr


class UserResponseSchema(BaseModel):
    id: int
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr | None = None
    role: Optional[str] = None
    additional_roles: Optional[list[AdditionalRoleResponseSchema]] = None
    transactions: Optional[List[TransactionUserResponseSchema]] = None
    permit_information: Optional[list[PermitInformationUserResponseSchema]] = None
    is_verified: Optional[bool] = False
    school: Optional[SchoolOrganizationBase] = None
    driving_school: Optional[List[SchoolResponseSchema]] = None
    package: Optional[list[PackageResponseSchema]] = None
    has_paid: Optional[bool] = False
    driver_ed: Optional[bool] = False
    is_active: Optional[bool] = None

    class Config:
        orm_mode = True


class ProfileResponseSchema(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    lesson_duration: Optional[int] = 0
    office_note: Optional[str] = None
    cell_phone: Optional[str] = None
    gender: Optional[GenderEnum] = None
    dob: Optional[date] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None
    certificate_received: Optional[bool] = False
    lesson_assigned: Optional[List[int]] = None
    scheduled_lesson: Optional[List[int]] = None
    is_active: Optional[bool] = None
    document_url: Optional[list[DocumentResponseSchema]] = None
    notes: Optional[list[InstructorNotesResponseSchema]] = None


class UserProfileResponse(BaseModel):
    user: UserResponseSchema
    profile: ProfileResponseSchema


class ProfileResponse(ProfileResponseSchema):
    contact_information: Optional[List[ContactInformationResponse]] = []
    pickup_location: Optional[List[PickupLocationResponse]] = []


class UserProfileGetResponse(BaseModel):
    user: Optional[UserResponseSchema] = None
    profile: Optional[ProfileResponse] = None


class UserProfileListResponse(ProfileResponseSchema):
    pickup_location: Optional[List[PickupLocationResponse]] = None
    user: Optional[UserResponseSchema] = None


class UserProfileGetResponseTotal(BaseModel):
    total: Optional[int] = None
    profiles: List[UserProfileListResponse]


class ContactInformationProfileSchema(BaseModel):
    contact_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None
    contact_relationship: Optional[str] = None
    contact_type: Optional[ContacTypEnum] = None


class UserProfileUpdateSchema(BaseModel):
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None
    role: Optional[RoleEnum] = None
    additional_roles: Optional[List[AdditionalRoleUpdateSchema]] = None
    office_note: Optional[str] = None
    cell_phone: Optional[str] = None
    gender: Optional[GenderEnum] = None
    dob: Optional[date] = None
    school_id: Optional[int] = None
    driving_school_id: Optional[List[int]] = None
    address: Optional[str] = None
    apartment: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[int] = None
    is_active: Optional[bool] = None

    # Pickup Location
    pickup_location_title: Optional[str] = None
    pickup_location_name: Optional[str] = None
    pickup_location_address: Optional[str] = None
    pickup_location_apartment: Optional[str] = None
    pickup_location_city: Optional[str] = None
    pickup_location_type_id: Optional[int] = None

    contacts: Optional[List[ContactInformationProfileSchema]] = None

    # Permit Information
    permit_number: Optional[str] = None
    permit_issue_date: Optional[date] = None
    permit_expiration_date: Optional[date] = None
    permit_endorse_date: Optional[date] = None
    permit_endorse_by_id: Optional[int] = None


# good response
# class AppointmentUserStudentResponseSchema(BaseModel):
#     id: Optional[int] = None
#     first_name: Optional[str] = None
#     middle_name: Optional[str] = None
#     last_name: Optional[str] = None
#     email: Optional[EmailStr] = None
#     school_id: Optional[int] = None
#     school: Optional[SchoolOrganizationBase] = None


# old response needed because of frontend
class AppointmentUserStudentResponseSchema(UserResponseSchema):
    package: Optional[List[PackageResponseSchema]] = []


class UserProfileFilterSchema(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None
    order: OrderEnum = OrderEnum.DESC
    sort: UserProfileSortEnum = UserProfileSortEnum.UPDATED_AT
    role: RoleFilterEnum = RoleFilterEnum.ALL
