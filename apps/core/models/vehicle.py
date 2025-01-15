from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from apps.config.db.base import Base
from apps.common.model import TimeStampMixin


class Vehicle(Base, TimeStampMixin):
    __tablename__ = "vehicles"

    plate_number = Column(String(50), nullable=True)
    color = Column(String(50), nullable=True)

    brand = Column(String, nullable=True)
    model = Column(String, nullable=True)
    year = Column(Integer, nullable=True)
    vehicle_type = Column(String, nullable=True)
    odometer = Column(Integer, nullable=True)

    is_available = Column(Boolean, default=True)
