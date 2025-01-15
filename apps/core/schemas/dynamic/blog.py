from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class BlogSchema(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    keywords: Optional[str] = None
    category_id: Optional[int] = None
    driving_school_id: Optional[int] = None


class BlogImageSchema(BaseModel):
    url: Optional[str] = None
    blog_id: Optional[int] = None


class BlogCategorySchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class BlogCategoryCreateSchema(BlogCategorySchema):
    pass


class BlogCategoryResponseSchema(BlogCategorySchema):
    id: Optional[int] = None


class BlogImageResponseSchema(BlogImageSchema):
    id: Optional[int] = None


class BlogResponseSchema(BlogSchema):
    id: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    is_active: Optional[bool] = None
    is_deleted: Optional[bool] = None
    blog_images: Optional[list[BlogImageResponseSchema]] = None
    category: Optional[BlogCategoryResponseSchema] = None


class BlogResponseSchemaTotal(BaseModel):
    total: Optional[int] = None
    blogs: Optional[list[BlogResponseSchema]] = None
