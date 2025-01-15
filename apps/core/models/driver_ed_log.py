from sqlalchemy import (
    Column,
    DateTime,
    String,
    Integer,
    ForeignKey,
    func,
    Enum as SQLAlchemyEnum,
)

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base

from apps.common.enum import DriverEdStatusRemarksEnum


class DriverEdLog(Base, TimeStampMixin):
    __tablename__ = "driver_ed_log"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("driver_ed_units.id"), nullable=False)
    marks = Column(Integer, nullable=True)
    percentage = Column(Integer, nullable=True)
    detail = Column(String, nullable=True)
    remarks = Column(
        SQLAlchemyEnum(DriverEdStatusRemarksEnum),
        default=DriverEdStatusRemarksEnum.UNKNOWN,
    )
    progress_date = Column(DateTime(timezone=True), default=func.now())
