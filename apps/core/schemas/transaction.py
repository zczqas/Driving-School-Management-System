from datetime import date
from typing import Optional

from pydantic import BaseModel, ValidationInfo, field_validator

from apps.common.enum import (
    OrderEnum,
    TransactionFilterMethodEnum,
    TransactionMethodEnum,
    TransactionSortEnum,
    TransactionStatusEnum,
)
from apps.common.exception import ValidationErrorException
from apps.core.schemas.common import BaseCreatedByResponseSchema, BaseResponseSchema
from apps.core.schemas.driving_school import DrivingSchoolResponseSchema
from apps.core.schemas.package import PackageResponseSchema
from apps.core.schemas.school_organization import SchoolResponseSchema


class TransactionBase(BaseModel):
    amount: Optional[float] = None
    discount: Optional[float] = None
    additional_amount: Optional[float] = None
    method: TransactionMethodEnum = TransactionMethodEnum.CASH
    location: Optional[str] = None
    total_lesson: Optional[int] = None
    scheduled_lesson: Optional[list[int]] = None
    transaction_id: Optional[int] = None
    status: TransactionStatusEnum = TransactionStatusEnum.SETTLED

    @field_validator("amount", "discount", "additional_amount")
    def check_amount(
        cls, value, info: ValidationInfo
    ):  # pylint: disable=no-self-argument
        if value is not None:
            if value < 0:
                raise ValidationErrorException(
                    f"{info.field_name} must be greater than 0"
                )
            return value
        else:
            return value


class TransactionFilterSchema(BaseModel):
    amount: Optional[float] = None
    discount: Optional[float] = None
    location: Optional[str] = None
    transaction_id: Optional[int] = None
    method: TransactionFilterMethodEnum = TransactionFilterMethodEnum.ALL
    user_id: Optional[int] = None
    user_name: Optional[str] = None
    order: OrderEnum = OrderEnum.DESC
    sort: TransactionSortEnum = TransactionSortEnum.DATE_CHARGED
    is_deleted: Optional[bool] = None
    date_charged: Optional[date] = None
    to: Optional[date] = None
    from_: Optional[date] = None
    status: TransactionStatusEnum = TransactionStatusEnum.SETTLED
    driving_school_id: Optional[int] = None


class TransactionCreate(TransactionBase):
    user_id: Optional[int] = None
    package_id: Optional[int] = None
    coupon_id: Optional[int] = None
    driving_school_id: Optional[int] = None
    cardholder_name: Optional[str] = None
    card_number: Optional[str] = None
    expiration_date: Optional[str] = None
    cvv: Optional[str] = None

    # @field_validator("expiration_date")
    # def validate_expiration_date(cls, v):
    #     try:
    #         datetime.strptime(v, "%Y-%m")
    #     except ValueError:
    #         raise ValueError("expiration date must be in YYYY-MM format")
    #     return v


class TransactionUpdate(TransactionBase):
    driving_school_id: Optional[int] = None
    user_id: Optional[int] = None
    package_id: Optional[int] = None
    date_charged: Optional[date] = None
    refund: Optional[bool] = None
    cardholder_name: Optional[str] = None
    card_number: Optional[str] = None
    expiration_date: Optional[str] = None


class TransactionCreateResponse(TransactionBase):
    id: int
    user_id: Optional[int] = None
    school_id: Optional[int] = None
    school: Optional[SchoolResponseSchema] = None
    date_charged: Optional[date] = None
    refund: Optional[bool] = None
    coupon_info_id: Optional[int] = None


class TransactionUserResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    middle_name: Optional[str] = None
    last_name: Optional[str] = None


class TransactionResponseSchema(TransactionBase, BaseResponseSchema):
    id: Optional[int] = None
    user_id: Optional[int] = None
    date_charged: Optional[date] = None
    refund: Optional[bool] = None
    school_id: Optional[int] = None
    driving_school_id: Optional[int] = None
    driving_school: Optional[DrivingSchoolResponseSchema] = None
    user: Optional[TransactionUserResponse] = None
    package: Optional[PackageResponseSchema] = None
    created_by: Optional[BaseCreatedByResponseSchema] = None
    completed_appointments: Optional[int] = None
    total_appointments: Optional[int] = None


class TransactionResponseUserSchema(TransactionBase):
    date_charged: Optional[date] = None
    refund: Optional[bool] = None
    is_deleted: Optional[bool] = None


class TransactionResponseSchemaTotal(BaseModel):
    total: int
    transactions: list[TransactionResponseSchema]


class TransactionUserResponseSchema(TransactionBase):
    id: int
    date_charged: Optional[date] = None
    refund: Optional[bool] = None
