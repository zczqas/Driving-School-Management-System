from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship


class DriverEdImagesSection(Base, TimeStampMixin):
    __tablename__ = "driver_ed_images_section"

    title = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)


class DriverEdImages(Base, TimeStampMixin):
    __tablename__ = "driver_ed_images"

    name = Column(String(255), nullable=True)
    url = Column(String(255), nullable=False)
    section_id = Column(
        Integer,
        ForeignKey("driver_ed_images_section.id"),
        nullable=False,
    )
    section = relationship("DriverEdImagesSection", backref="images")
