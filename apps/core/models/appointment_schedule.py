from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from sqlalchemy import (
    String,
    Column,
    ForeignKey,
    Integer,
    Text,
    Time,
    Date,
    Boolean,
)
from sqlalchemy.orm import relationship


class AppointmentScheduleStatus(Base, TimeStampMixin):
    __tablename__ = "appointment_schedule_statuses"

    name = Column(String(255), nullable=False)
    description = Column(String(255), nullable=True)
    apply_fine = Column(Boolean, default=False)


class AppointmentSchedule(Base, TimeStampMixin):
    __tablename__ = "appointment_schedules"

    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    student = relationship(
        "Users", backref="appointment_schedules", foreign_keys=[student_id]
    )
    availability_id = Column(Integer, ForeignKey("availabilities.id"), nullable=False)
    availability = relationship("Availability", backref="appointment_schedules")
    scheduled_date = Column(Date, nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    lesson = relationship("Lesson", backref="appointment_schedules")
    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True)
    package = relationship("Package", backref="appointment_schedules")
    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    city = relationship("City", backref="appointment_schedules")
    pickup_location_id = Column(
        Integer, ForeignKey("pickup_locations.id"), nullable=True
    )
    pickup_location = relationship("PickupLocation", backref="appointment_schedules")
    pickup_location_type_id = Column(
        Integer, ForeignKey("pickup_location_types.id"), nullable=True
    )
    pickup_location_type = relationship(
        "PickupLocationType", backref="appointment_schedules"
    )
    pickup_location_text = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)

    instructor_notes = relationship(
        "InstructorNotes",
        backref="appointment_schedules",
        lazy="joined",
    )

    time_in = Column(Time, nullable=True)
    time_out = Column(Time, nullable=True)

    status_id = Column(
        Integer, ForeignKey("appointment_schedule_statuses.id"), nullable=True
    )
    status = relationship("AppointmentScheduleStatus", backref="appointment_schedules")

    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"), nullable=True)
    driving_school = relationship("DrivingSchool", backref="appointment_schedules")

    start_mileage = Column(Integer, nullable=True)
    end_mileage = Column(Integer, nullable=True)

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])
