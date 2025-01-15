from sqlalchemy import Column, String, Text

from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class DMV(Base, TimeStampMixin):
    __tablename__ = "dmv"

    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(String(100), nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    zip_code = Column(String(10), nullable=True)
    phone = Column(String(15), nullable=True)
    email = Column(String(150), nullable=True)
    website = Column(String(255), nullable=True)
