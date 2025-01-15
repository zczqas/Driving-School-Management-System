from sqlalchemy import (
    Column,
    String,
)

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class AppointmentStatus(Base, TimeStampMixin):
    __tablename__ = "appointment_status"

    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
