from sqlalchemy import (
    String,
    Column,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import relationship


from apps.config.db.base import Base
from apps.common.model import TimeStampMixin


class PickupLocation(Base, TimeStampMixin):
    __tablename__ = "pickup_locations"

    title = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    address = Column(String(255), nullable=True)
    apartment = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    city_abbreviation = Column(String(5), nullable=True)

    pickup_location_type_id = Column(
        Integer, ForeignKey("pickup_location_types.id"), nullable=True
    )
    pickup_location_type = relationship(
        "PickupLocationType", backref="pickup_locations", lazy="joined"
    )

    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class PickupLocationType(Base, TimeStampMixin):
    __tablename__ = "pickup_location_types"

    name = Column(String(50), nullable=False)
    description = Column(String(255), nullable=True)
