from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, model_validator

from apps.common.enum import (
    CertificateTypeEnum,
    DMVCertificateSortEnum,
    OrderEnum,
    UserCertificateSortEnum,
    UserCertificateStatusEnum,
    UserCertificateStatusFilterEnum,
)
from apps.common.exception import ValidationErrorException
from apps.core.schemas.common import UserBasicInformationResponseSchema


class DMVCertificateCreateSchema(BaseModel):
    prefix_text: str
    start_number: int
    end_number: int
    certificate_type: CertificateTypeEnum = CertificateTypeEnum.GOLD

    @model_validator(mode="before")
    @classmethod
    def start_end_number_validator(cls, data):
        """Validate start and end number"""
        start_number = data.get("start_number")
        end_number = data.get("end_number")
        if (
            start_number is not None
            and end_number is not None
            and start_number >= end_number
        ):
            raise ValidationErrorException(
                "End number must be greater than start number"
            )
        return data


class DMVCertificateResponseSchema(BaseModel):
    id: Optional[int] = None
    certificate_number: Optional[str] = None
    is_assigned: Optional[bool] = None
    status: Optional[UserCertificateStatusEnum] = None
    certificate_type: Optional[CertificateTypeEnum] = CertificateTypeEnum.GOLD
    created_at: Optional[datetime] = None
    batch_id: Optional[str] = None


class DMVCertificateUpdateSchema(BaseModel):
    is_assigned: Optional[bool] = None
    status: Optional[UserCertificateStatusEnum] = UserCertificateStatusEnum.NOT_ASSIGNED
    batch_id: Optional[str] = None

    @model_validator(mode="before")
    @classmethod
    def is_assigned_validator(cls, data):
        """Validate is_assigned and status"""
        is_assigned = data.get("is_assigned")
        status = data.get("status")
        if is_assigned is None or status is None:
            raise ValidationErrorException(
                "Both Status and is_assigned is required to be assigned"
            )
        if is_assigned and status != UserCertificateStatusEnum.ASSIGNED:
            raise ValidationErrorException(
                "Status ASSIGNED requires is_assigned to be True"
            )

        return data


class DMVCertificateResponseSchemaTotal(BaseModel):
    total: int
    dmv_certificates: List[DMVCertificateResponseSchema]


class DMVCertificateFilterSchema(BaseModel):
    batch_id: Optional[str] = None
    certificate_number: Optional[str] = None
    is_assigned: Optional[bool] = None
    status: UserCertificateStatusFilterEnum = (
        UserCertificateStatusFilterEnum.NOT_ASSIGNED
    )
    certificate_id: Optional[int] = None
    certificate_type: Optional[CertificateTypeEnum] = CertificateTypeEnum.GOLD
    sort: DMVCertificateSortEnum = DMVCertificateSortEnum.ID
    order: OrderEnum = OrderEnum.ASC


class BatchIDResponseSchema(BaseModel):
    batch_id: Optional[str] = None
    certificate_type: Optional[CertificateTypeEnum] = CertificateTypeEnum.PINK
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    total: Optional[int] = None
    assigned: Optional[int] = None
    not_assigned: Optional[int] = None
    void: Optional[int] = None
    lost: Optional[int] = None


class BatchIDFilterSchema(BaseModel):
    certificate_type: Optional[CertificateTypeEnum] = CertificateTypeEnum.PINK


class UserCertificateUserResponseSchema(BaseModel):
    user: Optional[UserBasicInformationResponseSchema] = None
    cell_phone: Optional[str] = None


class UserCertificateResponseSchema(BaseModel):
    id: Optional[int] = None
    certificate_id: Optional[int] = None
    user_profiles_id: Optional[int] = None
    instructor_id: Optional[int] = None
    status: Optional[str] = None
    assigned_date: Optional[datetime] = None
    issued_date: Optional[datetime] = None
    is_deleted: Optional[bool] = None
    certificate: Optional[DMVCertificateResponseSchema] = None
    user_profiles: Optional[UserCertificateUserResponseSchema] = None


class UserCertificateFilterSchema(BaseModel):
    user_profile_id: Optional[int] = None
    certificate_id: Optional[int] = None
    assigned_date: Optional[datetime] = None
    issued_date: Optional[datetime] = None
    status: UserCertificateStatusFilterEnum = UserCertificateStatusFilterEnum.ASSIGNED
    certificate_type: CertificateTypeEnum = CertificateTypeEnum.GOLD
    sort: UserCertificateSortEnum = UserCertificateSortEnum.CERTIFICATE_ID
    order: OrderEnum = OrderEnum.ASC


class UserCertificateResponseSchemaTotal(BaseModel):
    total: int
    user_certificates: List[UserCertificateResponseSchema]


class UserCertificateUpdateSchema(BaseModel):
    instructor_id: Optional[int] = None
    status: Optional[UserCertificateStatusEnum] = UserCertificateStatusEnum.ASSIGNED
    issue: Optional[bool] = None
