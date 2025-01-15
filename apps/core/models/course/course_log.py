from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    String,
    Integer,
    ForeignKey,
    func,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base

from apps.common.enum import CourseStatusRemarksEnum


class CourseQuizLog(Base, TimeStampMixin):
    __tablename__ = "course_quiz_log"

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=True)
    marks = Column(Integer, nullable=True)
    percentage = Column(Integer, nullable=True)
    detail = Column(String, nullable=True)
    remarks = Column(
        SQLAlchemyEnum(CourseStatusRemarksEnum),
        default=CourseStatusRemarksEnum.UNKNOWN,
    )
    progress_date = Column(DateTime(timezone=True), default=func.now())


class CourseLessonLog(Base, TimeStampMixin):
    __tablename__ = "course_lesson_log"

    lesson_id = Column(Integer, ForeignKey("course_lesson.id"), nullable=False)
    lesson = relationship("CourseLesson", backref="lesson_logs")

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=False)
    unit = relationship("CourseUnit", backref="lesson_logs")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", backref="course_lesson_logs")

    is_passed = Column(Boolean, default=False, nullable=False)
