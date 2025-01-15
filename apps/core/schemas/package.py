from typing import Optional

from pydantic import BaseModel

from apps.common.enum import OrderEnum, PackageSortEnum, PackageTypeEnum
from apps.core.schemas.driving_school import DrivingSchoolResponseSchema
from apps.core.schemas.lesson import LessonResponseSchema


class PackageBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    package_type: Optional[PackageTypeEnum] = None
    lesson_order: Optional[list[int]] = None
    is_active: bool = True
    is_private: Optional[bool] = None
    permit: Optional[bool] = False


class PackageCategoryBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    driving_school_id: Optional[int] = None
    is_active: bool = True


class PackageCreate(PackageBase):
    category_id: Optional[int] = None
    lesson_id: Optional[list[int]] = None
    driving_school_id: Optional[int] = None

    class Config:
        orm_mode = True


class PackageFilterSchema(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    price: Optional[float] = None
    type: Optional[PackageTypeEnum] = None
    permit: Optional[bool] = None
    is_private: Optional[bool] = None
    order: OrderEnum = OrderEnum.DESC
    sort: PackageSortEnum = PackageSortEnum.PRICE


class PackageCategoryResponseSchema(PackageCategoryBase):
    id: int

    class Config:
        orm_mode = True


class PackageResponseSchema(PackageBase):
    id: int
    total_duration: Optional[float] = None
    category: Optional[PackageCategoryResponseSchema]
    lessons: list[LessonResponseSchema]
    driving_school_id: Optional[int] = None
    driving_school: Optional[DrivingSchoolResponseSchema] = None

    class Config:
        orm_mode = True


class PackageResponseCategorySchema(PackageBase):
    id: int
    total_duration: Optional[float] = None
    lessons: list[LessonResponseSchema]
    driving_school_id: Optional[int] = None

    class Config:
        orm_mode = True


class PackageResponseSchemaTotal(BaseModel):
    total_count: int
    packages: list[PackageResponseSchema]


class PackageCategoryCreate(PackageCategoryBase):
    class Config:
        orm_mode = True


class PackageCategoryResponseCategorySchema(PackageCategoryBase):
    id: Optional[int] = None
    packages: Optional[list[PackageResponseCategorySchema]] = None

    class Config:
        orm_mode = True


class PackageUpdateSchema(PackageBase):
    category_id: Optional[int] = None
