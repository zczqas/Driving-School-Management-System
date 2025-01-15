from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship


class DriverEdOptionalVideoSection(Base, TimeStampMixin):
    __tablename__ = "driver_ed_optional_video_section"

    title = Column(String(255), nullable=True)


class DriverEdOptionalVideo(Base, TimeStampMixin):
    __tablename__ = "driver_ed_optional_video"

    title = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)
    section_id = Column(
        Integer,
        ForeignKey("driver_ed_optional_video_section.id"),
        nullable=False,
    )
    section = relationship("DriverEdOptionalVideoSection", backref="videos")
