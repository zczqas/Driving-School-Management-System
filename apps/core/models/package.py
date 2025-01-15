from sqlalchemy import ARRAY, Boolean, Column
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from apps.common.enum import PackageTypeEnum
from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class Package(Base, TimeStampMixin):
    __tablename__ = "packages"

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    is_private = Column(Boolean, default=False)
    permit = Column(Boolean, default=False)

    lessons = relationship(
        "Lesson",
        secondary="package_lessons",
        back_populates="packages",
        order_by="Lesson.created_at",
    )
    lesson_order = Column(ARRAY(Integer), nullable=True)
    package_type = Column(
        SQLAlchemyEnum(PackageTypeEnum), default=PackageTypeEnum.OFFLINE
    )

    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"), nullable=True)
    driving_school = relationship("DrivingSchool", backref="packages")

    category_id = Column(Integer, ForeignKey("package_categories.id"), nullable=True)
    category = relationship("PackageCategory", backref="packages")


class UserPackage(Base):
    __tablename__ = "user_packages"
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    package_id = Column(Integer, ForeignKey("packages.id"), primary_key=True)


class Lesson(Base, TimeStampMixin):
    __tablename__ = "lessons"

    lesson_no = Column(Integer, unique=True, nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    alias = Column(String(255), nullable=True)
    duration = Column(Float, nullable=True)
    price = Column(Float, nullable=True, default=0.0)
    is_active = Column(Boolean, default=True)
    is_online = Column(Boolean, default=False)

    packages = relationship(
        "Package", secondary="package_lessons", back_populates="lessons"
    )


class PackageLesson(Base, TimeStampMixin):
    __tablename__ = "package_lessons"

    package_id = Column(Integer, ForeignKey("packages.id"), nullable=False)
    lesson_id = Column(Integer, ForeignKey("lessons.id"), nullable=False)

    package = relationship("Package")
    lesson = relationship("Lesson")


class PackageCategory(Base, TimeStampMixin):
    __tablename__ = "package_categories"

    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)

    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"), nullable=True)
    driving_school = relationship("DrivingSchool", backref="package_categories")
