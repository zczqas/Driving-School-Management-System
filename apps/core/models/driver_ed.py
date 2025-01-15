from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from sqlalchemy import BigInteger, Boolean, Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship


class DriverEdUnits(Base, TimeStampMixin):
    __tablename__ = "driver_ed_units"

    title = Column(String(255), nullable=False)
    purpose = Column(String(255), nullable=False)


class DriverEdLesson(Base):
    """
    yes, this table makes no sense, but it is like this in the original table from old database
    and i am too lazy to change it or make it better
    """

    __tablename__ = "driver_ed_lessons"

    ed_id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    # ed_id is the primary key, but it is not the id that is used in the code

    id = Column(Integer, nullable=False)
    # id is used in the code, but it is not the primary key
    title = Column(String(255), nullable=False)

    unit_id = Column(Integer, ForeignKey("driver_ed_units.id"), nullable=False)
    unit = relationship("DriverEdUnits", backref="lessons")


class DriverEdLessonLog(Base, TimeStampMixin):
    __tablename__ = "driver_ed_lesson_logs"

    lesson_id = Column(Integer, nullable=False)
    lesson_ed_id = Column(
        Integer, ForeignKey("driver_ed_lessons.ed_id"), nullable=False
    )

    unit_id = Column(Integer, ForeignKey("driver_ed_units.id"), nullable=False)
    unit = relationship("DriverEdUnits", backref="lesson_logs")

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", backref="driver_ed_lesson_logs")

    is_passed = Column(Boolean, default=False, nullable=False)


class DriverEdSection(Base, TimeStampMixin):
    __tablename__ = "driver_ed_sections"

    title = Column(String(255), nullable=True)
    text = Column(String(255), nullable=True)
    reference = Column(String(255), nullable=True)
    section_id_1 = Column(String(255), nullable=True)
    section_id_2 = Column(String(255), nullable=True)

    unit_id = Column(Integer, ForeignKey("driver_ed_units.id"), nullable=False)
    unit = relationship("DriverEdUnits", backref="sections")

    # yes, this makes no sense, but it's the original table from old database
    # i cannot do anything about it
    lesson_id = Column(Integer, nullable=True)  # help me


class DriverEdQuestion(Base, TimeStampMixin):
    __tablename__ = "driver_ed_questions"

    question = Column(String(255), nullable=False)
    a = Column(String(255), nullable=True)
    b = Column(String(255), nullable=True)
    c = Column(String(255), nullable=True)
    d = Column(String(255), nullable=True)
    e = Column(String(255), nullable=True)
    correct_answer = Column(String(1), nullable=False)

    image = Column(String(255), nullable=True)

    weight = Column(Integer, nullable=True)

    unit_id = Column(Integer, ForeignKey("driver_ed_units.id"), nullable=True)
    unit = relationship("DriverEdUnits", backref="questions")
