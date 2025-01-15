from sqlalchemy import Column, String

from apps.core.models import Base
from apps.common.model import TimeStampMixin


class City(Base, TimeStampMixin):
    __tablename__ = "cities"

    name = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    country = Column(String(50), nullable=True)
    city_abbreviation = Column(String(10), nullable=True, unique=True)
