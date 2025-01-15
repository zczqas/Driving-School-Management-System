from apps.config.db.base import Base
from sqlalchemy import (
    Column,
    String,
    Integer,
    ForeignKey,
    Text,
)
from sqlalchemy.orm import relationship
from apps.common.model import TimeStampMixin


class EmailLog(Base, TimeStampMixin):
    __tablename__ = "email_log"

    name = Column(String(50), nullable=False)
    html_file_name = Column(String, nullable=True)
    content = Column(Text, nullable=True)

    user_profiles_id = Column(Integer, ForeignKey("user_profiles.id"), nullable=False)
    user_profiles = relationship(
        "Profile",
        backref="email_logs",
        lazy="joined",
    )
