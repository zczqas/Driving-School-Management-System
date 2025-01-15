from typing import Optional

from pydantic import BaseModel, EmailStr
from pydantic_core import Url


class DMVBaseSchema(BaseModel):
    """Base DMV schema"""

    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[Url] = None


class DMVResponseSchema(DMVBaseSchema):
    """Response DMV schema"""

    id: Optional[int] = None


class DMVResponseSchemaTotal(BaseModel):
    """Response DMV schema with total count"""

    total: int
    data: list[DMVResponseSchema]


class DMVCreateSchema(DMVBaseSchema):
    """Create DMV schema"""

    pass


class DMVUpdateSchema(DMVBaseSchema):
    """Update DMV schema"""

    pass
