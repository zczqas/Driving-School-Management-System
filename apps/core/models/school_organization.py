from sqlalchemy import Boolean, Column, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class Organization(Base, TimeStampMixin):
    __tablename__ = "organizations"

    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    zipcode = Column(String, nullable=True)

    # instructor = relationship("User", back_populates="organization", secondary="instructor_organizations")


class School(Base, TimeStampMixin):
    __tablename__ = "schools"

    name = Column(String, unique=True, nullable=True)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    zipcode = Column(String, nullable=True)
    is_deleted = Column(Boolean, default=False, nullable=False)

    users = relationship("Users", back_populates="school")


class DrivingSchool(Base, TimeStampMixin):
    __tablename__ = "driving_schools"

    name = Column(String, nullable=True, index=True)
    description = Column(Text, nullable=True)
    address = Column(String, nullable=True)
    phone = Column(String(50), nullable=True)
    secondary_phone = Column(String(50), nullable=True)
    email = Column(String(255), nullable=True, index=True)
    website = Column(String(255), nullable=True)
    domain = Column(String(255), nullable=True, index=True)

    # Appearance
    primary_color = Column(String(7), nullable=True)
    secondary_color = Column(String(7), nullable=True)

    # Additional info (Created according to the design)
    # idk what some of these fields are for
    license_number = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    banner = Column(String(255), nullable=True)
    title = Column(String(255), nullable=True)
    operating_hours = Column(String(255), nullable=True)
    established_year = Column(Integer, nullable=True)
    footer_banner = Column(String(255), nullable=True)
    hero_text = Column(String(255), nullable=True)

    # Frontend traffic school tab urls
    traffic_online_url = Column(String(255), nullable=True)
    traffic_booklet_url = Column(String(255), nullable=True)

    driving_school_urls_id = Column(Integer, ForeignKey("driving_schools_urls.id"))
    driving_school_urls = relationship("URLs", backref="driving_school")


class URLs(Base, TimeStampMixin):
    __tablename__ = "driving_schools_urls"

    hero_image_url = Column(String(255), nullable=True)
    logo_url = Column(String(255), nullable=True)
    logo_url_dark = Column(String(255), nullable=True)
    # Internal SFDS webapp URLs
    sign_in_url = Column(String(255), nullable=True)
    sign_up_url = Column(String(255), nullable=True)
    pricing_url = Column(String(255), nullable=True)
    # Social media URLs
    facebook_url = Column(String(255), nullable=True)
    twitter_url = Column(String(255), nullable=True)
    instagram_url = Column(String(255), nullable=True)
    linkedin_url = Column(String(255), nullable=True)
