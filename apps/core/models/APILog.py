from sqlalchemy import Column, Integer, String, DateTime, func
from apps.config.db.base import Base


class APILog(Base):
    __tablename__ = "api_logs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    when = Column(DateTime, default=func.now())
    action = Column(String)
    description = Column(String)
    status_code = Column(Integer)
