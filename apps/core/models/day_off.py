from sqlalchemy import Column, Date, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship
from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class DayOff(Base, TimeStampMixin):
    __tablename__ = "day_offs"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", backref="day_offs")

    to_ = Column(Date, nullable=True)
    from_ = Column(Date, nullable=True)
    day_ = Column(Integer, nullable=True)
    reason = Column(Text, nullable=True)
