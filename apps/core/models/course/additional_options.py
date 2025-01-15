from apps.common.model import TimeStampMixin
from apps.core.models import Base
from sqlalchemy import Column, String, Integer, ForeignKey

from sqlalchemy.orm import relationship


class CourseQuestions(Base, TimeStampMixin):
    __tablename__ = "course_questions"

    question = Column(String(255), nullable=False)
    a = Column(String(255), nullable=True)
    b = Column(String(255), nullable=True)
    c = Column(String(255), nullable=True)
    d = Column(String(255), nullable=True)
    e = Column(String(255), nullable=True)
    correct_answer = Column(String(1), nullable=False)
    image = Column(String(255), nullable=True)
    # weight = Column(Integer, nullable=True)

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=True)
    unit = relationship("CourseUnit", backref="questions")


class CourseCharts(Base, TimeStampMixin):
    __tablename__ = "course_charts"

    name = Column(String(255), nullable=True)
    url = Column(String(255), nullable=False)

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=False)
    unit = relationship("CourseUnit", backref="charts")


class CourseVideo(Base, TimeStampMixin):
    __tablename__ = "course_video"

    name = Column(String(255), nullable=False)
    url = Column(String(255), nullable=False)

    unit_id = Column(Integer, ForeignKey("course_unit.id"), nullable=False)
    unit = relationship("CourseUnit", backref="videos")
