from typing import Optional

from pydantic import BaseModel, EmailStr


class DrivingSchoolBaseSchema(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    domain: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None

    # Additional info
    license_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    banner: Optional[str] = None
    title: Optional[str] = None
    operating_hours: Optional[str] = None
    established_year: Optional[int] = None
    footer_banner: Optional[str] = None
    hero_text: Optional[str] = None

    # Internal SFDS webapp URLs
    sign_in_url: Optional[str] = None
    sign_up_url: Optional[str] = None
    pricing_url: Optional[str] = None

    # Social media URLs
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None

    # Frontend traffic school tab urls
    traffic_online_url: Optional[str] = None
    traffic_booklet_url: Optional[str] = None


class DrivingSchoolURLsSchema(BaseModel):
    sign_in_url: Optional[str] = None
    sign_up_url: Optional[str] = None
    pricing_url: Optional[str] = None
    hero_image_url: Optional[str] = None
    logo_url: Optional[str] = None
    logo_url_dark: Optional[str] = None

    # Social media URLs
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None


class DrivingSchoolCreateSchema(DrivingSchoolBaseSchema):
    pass


class DrivingSchoolUpdateSchema(DrivingSchoolBaseSchema):
    pass


class DrivingSchoolResponseSchema(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    secondary_phone: Optional[str] = None
    email: Optional[EmailStr] = None
    website: Optional[str] = None
    domain: Optional[str] = None
    primary_color: Optional[str] = None
    secondary_color: Optional[str] = None

    # Additional info
    license_number: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    banner: Optional[str] = None
    title: Optional[str] = None
    operating_hours: Optional[str] = None
    established_year: Optional[int] = None
    footer_banner: Optional[str] = None
    hero_text: Optional[str] = None

    # Frontend traffic school tab urls
    traffic_online_url: Optional[str] = None
    traffic_booklet_url: Optional[str] = None

    driving_school_urls_id: Optional[int] = None
    driving_school_urls: Optional[DrivingSchoolURLsSchema] = None

    class Config:
        orm_mode = True
