from sqlalchemy import ARRAY, JSON, BigInteger, Boolean, Column, Date, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import ForeignKey, Integer, String, Time
from sqlalchemy.orm import relationship

from apps.common.enum import AdditionalRoleEnum, GenderEnum, RoleEnum
from apps.common.model import TimeStampCreatedByMixin, TimeStampMixin
from apps.config.db.base import Base


class AdditionalRole(Base, TimeStampMixin):
    __tablename__ = "additional_roles"

    user_id = Column(Integer, ForeignKey("users.id"))
    role = Column(SQLAlchemyEnum(AdditionalRoleEnum), nullable=False)


class InstructorNotes(Base, TimeStampMixin):
    __tablename__ = "instructor_notes"

    note = Column(String, nullable=True)
    instructor_id = Column(Integer, ForeignKey("user_profiles.id"))
    instructor = relationship(
        "Profile", backref="instructor_notes", foreign_keys=[instructor_id]
    )
    student_id = Column(Integer, ForeignKey("user_profiles.id"))
    appointment_schedule_id = Column(Integer, ForeignKey("appointment_schedules.id"))


class UserSchool(Base, TimeStampMixin):
    __tablename__ = "user_schools"

    user_id = Column(BigInteger, ForeignKey("users.id"), primary_key=True)
    school_id = Column(BigInteger, ForeignKey("schools.id"), primary_key=True)


class Users(Base, TimeStampMixin):
    __tablename__ = "users"

    first_name = Column(String(50), nullable=False)
    middle_name = Column(String(50), nullable=True)
    last_name = Column(String(50), nullable=True)
    email = Column(String(255), unique=True)
    password = Column(String(255))
    initial_password = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)

    instructor_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    # instructor = relationship("Users", backref="students")

    role = Column(SQLAlchemyEnum(RoleEnum), nullable=False, default=RoleEnum.STUDENT)
    additional_roles = relationship("AdditionalRole", backref="users")

    has_paid = Column(Boolean, default=False)
    driver_ed = Column(Boolean, default=False)

    school_id = Column(Integer, ForeignKey("schools.id"))
    school = relationship("School", back_populates="users")

    driving_school = relationship("DrivingSchool", secondary="user_driving_school")

    package = relationship("Package", secondary="user_packages")

    profile = relationship("Profile", uselist=False, back_populates="user")
    # organization_id = Column(Integer, ForeignKey("organizations.id"))  # for Instructor
    # organization = relationship("Organization", back_populates="users", secondary="instructor_organizations")

    permit_information = relationship(
        "PermitInformation",
        backref="permit_user",
        join_depth=2,
        foreign_keys="PermitInformation.user_id",
    )
    # contact_information = relationship("ContactInformation", backref='contact_user', join_depth=2, lazy="joined")


class Profile(Base, TimeStampMixin):
    __tablename__ = "user_profiles"

    address = Column(String, nullable=True)
    office_note = Column(String, nullable=True)
    apartment = Column(String, nullable=True)

    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(Integer, nullable=True)
    dob = Column(Date, nullable=True)
    gender = Column(SQLAlchemyEnum(GenderEnum), nullable=True)
    cell_phone = Column(String(50), nullable=True)

    contact_information = relationship(
        "ContactInformation", backref="user_profiles", join_depth=2, lazy="joined"
    )

    document_url = relationship("Document", backref="user_profiles", lazy="joined")

    lesson_assigned = Column(JSON, nullable=True)
    scheduled_lesson = Column(ARRAY(Integer), nullable=True)
    lesson_duration = Column(Integer, nullable=True, default=0)
    certificate_received = Column(Boolean, default=False)

    user_id = Column(Integer, ForeignKey("users.id"))

    user = relationship("Users", back_populates="profile", lazy="joined")

    pickup_location = relationship(
        "PickupLocation",
        backref="user_profile",
        lazy="joined",
    )

    notes = relationship(
        "InstructorNotes",
        backref="user_profile",
        lazy="joined",
        foreign_keys=[InstructorNotes.student_id],
    )


class UserDrivingSchool(Base):
    __tablename__ = "user_driving_school"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    driving_school_id = Column(
        Integer, ForeignKey("driving_schools.id"), primary_key=True
    )


class Document(Base, TimeStampCreatedByMixin):
    __tablename__ = "documents"

    document_url = Column(String, nullable=False)
    user_profiles_id = Column(Integer, ForeignKey("user_profiles.id"))
    name = Column(String(50), nullable=True)
    description = Column(String, nullable=True)


class ContactInformation(Base, TimeStampMixin):
    __tablename__ = "user_contact_informations"

    contact_name = Column(String(255), nullable=True)
    contact_relationship = Column(String(255), nullable=True)
    contact_phone = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    contact_type = Column(String(255), nullable=True)

    user_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=True)
    # users = relationship("Users", backref="user_contacts", foreign_keys=[user_id])

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])


class PermitInformation(Base, TimeStampMixin):
    __tablename__ = "user_permit_informations"

    permit_number = Column(String(255))
    permit_issue_date = Column(Date, nullable=True)
    permit_expiration_date = Column(Date, nullable=True)
    permit_endorse_date = Column(DateTime, nullable=True)

    permit_endorse_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    permit_endorse_by = relationship(
        "Users",
        backref="endorsed_permit_informations",
        join_depth=2,
        lazy="joined",
        foreign_keys=[permit_endorse_by_id],
    )

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)


class InstructorOrganization(Base):
    __tablename__ = "instructor_organizations"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    instructor_id = Column(BigInteger, ForeignKey("users.id"))
    organization_id = Column(BigInteger, ForeignKey("organizations.id"))
    student_id = Column(BigInteger, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)


class StudentAppointment(Base, TimeStampMixin):
    __tablename__ = "student_appointment"

    instructor_id = Column(Integer, ForeignKey("users.id"))
    instructor = relationship(
        "Users",
        backref="instructor_appointment",
        foreign_keys=[instructor_id],
        lazy="joined",
    )
    student_id = Column(Integer, ForeignKey("users.id"))
    student = relationship(
        "Users", backref="student_appointment", foreign_keys=[student_id], lazy="joined"
    )

    appointment_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)

    actual_start_time = Column(Time, nullable=True)
    actual_end_time = Column(Time, nullable=True)

    mileage = Column(Integer, nullable=True)

    package_id = Column(Integer, ForeignKey("packages.id"), nullable=True)
    package = relationship("Package", backref="student_appointment", lazy="joined")

    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=True)
    lesson = relationship("Lesson", backref="student_appointment", lazy="joined")

    vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    vehicle = relationship("Vehicle", backref="student_appointment", lazy="joined")

    city_id = Column(Integer, ForeignKey("cities.id"), nullable=True)
    city = relationship("City", backref="student_appointment", lazy="joined")

    note = Column(String, nullable=True)

    # instructor_notes = relationship(
    #     "InstructorNotes",
    #     backref="student_appointment",
    #     lazy="joined",
    #     foreign_keys=[InstructorNotes.appointment_id],
    # )

    pickup_location_id = Column(
        Integer, ForeignKey("pickup_locations.id"), nullable=True
    )
    pickup_location = relationship(
        "PickupLocation",
        backref="student_appointment",
        join_depth=2,
        lazy="joined",
    )

    pickup_location_type_id = Column(
        Integer, ForeignKey("pickup_location_types.id"), nullable=True
    )
    pickup_location_type = relationship(
        "PickupLocationType",
        backref="student_appointment",
        join_depth=2,
        lazy="joined",
    )

    pickup_text = Column(String, nullable=True)

    status_id = Column(Integer, ForeignKey("appointment_status.id"))
    status = relationship(
        "AppointmentStatus", backref="student_appointment", lazy="joined"
    )

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])

    transaction_id = Column(Integer, ForeignKey("transactions.id"), nullable=True)
    transaction = relationship(
        "Transaction", backref="student_appointment", lazy="joined"
    )


class InstructorAvailability(Base, TimeStampMixin):
    __tablename__ = "instructor_availability"

    instructor_id = Column(Integer, ForeignKey("users.id"))

    availability_date = Column(Date, nullable=True)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
