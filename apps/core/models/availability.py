from sqlalchemy import Boolean, Column, Date, ForeignKey, Integer, Time, Text
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class Availability(Base, TimeStampMixin):
    # this is not good and needs to split into two weekly and date availability
    # i might do that if i have time
    __tablename__ = "availabilities"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", backref="availabilities", foreign_keys=[user_id])
    from_ = Column(Date, nullable=True)
    to_ = Column(Date, nullable=True)
    available_date = Column(Date, nullable=True)
    available_day = Column(
        Integer,
        nullable=True,
        default=None,
        comment="0: Sunday, 1: Monday, ..., 6: Saturday",
    )
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_booked = Column(Boolean, nullable=True, default=False)
    is_recurring = Column(Boolean, nullable=True, default=False)
    is_public = Column(Boolean, nullable=True, default=True)
    notes = Column(Text, nullable=True)

    city = relationship(
        "City", secondary="availability_cities", backref="availabilities"
    )
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    vehicle = relationship(
        "Vehicle", backref="availabilities", foreign_keys=[vehicle_id]
    )

    created_by_id = Column("Users", ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class AvailabilityCity(Base):
    __tablename__ = "availability_cities"

    availability_id = Column(Integer, ForeignKey("availabilities.id"), primary_key=True)
    city_id = Column(Integer, ForeignKey("cities.id"), primary_key=True)

    availability = relationship("Availability")
    city = relationship("City")
