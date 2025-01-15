from sqlalchemy import (
    Column,
    ForeignKey,
    String,
    Integer,
)
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class GasStation(Base, TimeStampMixin):
    __tablename__ = "gas_stations"

    name = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)

    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    city = relationship("City", backref="gas_stations")

    state = Column(String(255), nullable=True)
    zip_code = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    website = Column(String(255), nullable=True)
    notes = Column(String(255), nullable=True)
