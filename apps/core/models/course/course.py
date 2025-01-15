from apps.common.model import TimeStampMixin
from apps.core.models import Base
from sqlalchemy import Column, String, Integer, ForeignKey, Text

from sqlalchemy.orm import relationship


class Course(Base, TimeStampMixin):
    __tablename__ = "course"

    title = Column(String(50), nullable=True)
    description = Column(Text, nullable=True)


class CourseUnit(Base, TimeStampMixin):
    __tablename__ = "course_unit"

    title = Column(String(255), nullable=False)
    purpose = Column(String(255), nullable=False)

    course_id = Column(Integer, ForeignKey("course.id"), nullable=False)
    course = relationship("Course", backref="units")


class CourseLesson(Base, TimeStampMixin):
    __tablename__ = "course_lesson"

    title = Column(String(255), nullable=True)
    body = Column(Text, nullable=True)

    video_url = Column(String(255), nullable=True)
    video_name = Column(String(255), nullable=True)

    image_url = Column(String(255), nullable=True)
    image_name = Column(String(255), nullable=True)

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=False)
    unit = relationship("CourseUnit", backref="lessons")


class CourseSubunit(Base, TimeStampMixin):
    __tablename__ = "course_sub_unit"

    title = Column(String(255), nullable=True)
    text = Column(String(255), nullable=True)
    reference = Column(String(255), nullable=True)
    section_id_1 = Column(String(255), nullable=True)
    section_id_2 = Column(String(255), nullable=True)

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=False)
    unit = relationship("CourseUnit", backref="sub_units")

    lesson_id = Column(Integer, ForeignKey("course_lesson.id"), nullable=False)
    lesson = relationship("CourseLesson", backref="sub_units")
