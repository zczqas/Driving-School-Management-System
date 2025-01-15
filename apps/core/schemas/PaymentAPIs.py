from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel


class PaymentAPIsBaseSchema(BaseModel):
    name: Optional[str] = None
    sandbox_api_key_id: Optional[str] = None
    sandbox_transaction_key: Optional[str] = None
    production_api_key_id: Optional[str] = None
    production_transaction_key: Optional[str] = None
    driving_school_id: Optional[int] = None


class PaymentAPIsCreateSchema(PaymentAPIsBaseSchema):
    pass


class PaymentAPIsResponseSchema(PaymentAPIsBaseSchema):
    sandbox_is_active: Optional[bool] = None
    production_is_active: Optional[bool] = None
    is_active: Optional[bool] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class PaymentAPIsUpdateSchema(PaymentAPIsBaseSchema):
    sandbox_is_active: Optional[bool] = None
    production_is_active: Optional[bool] = None
