from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    Boolean,
)

from apps.config.db.base import Base
from apps.common.model import TimeStampMixin


class Training(Base, TimeStampMixin):
    __tablename__ = "trainings"

    name = Column(String(255), nullable=True)
    description = Column(String(255), nullable=True)


class TrainingLogs(Base, TimeStampMixin):
    __tablename__ = "training_logs"

    training_id = Column(Integer, ForeignKey("trainings.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    user_id = Column(Integer, ForeignKey("users.id"))

    is_completed = Column(Boolean, default=False)
