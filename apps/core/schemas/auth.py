from enum import Enum

from pydantic import BaseModel, EmailStr


class RegisterRoleEnum(str, Enum):
    STUDENT = "STUDENT"
    INSTRUCTOR = "INSTRUCTOR"
    CSR = "CSR"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class LoginResponse(BaseModel):
    id: int
    email: EmailStr
    token_type: str
    access_token: str
    refresh_token: str


class RegisterSchema(BaseModel):
    email: EmailStr
    password: str
    role: RegisterRoleEnum


class RegisterResponse(BaseModel):
    pass


class LoginResponseWithTokenType(LoginResponse):
    token_type: str
    role: RegisterRoleEnum
