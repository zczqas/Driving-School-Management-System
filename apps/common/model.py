from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, func
from sqlalchemy.ext.declarative import declared_attr
from sqlalchemy.orm import relationship


class TimeStampMixin:
    """Timestamping mixin"""

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    created_at = Column(DateTime(timezone=True), default=func.now())
    updated_at = Column(
        DateTime(timezone=True), default=func.now(), onupdate=func.now()
    )
    is_active = Column(Boolean, default=True)
    is_deleted = Column(Boolean, default=False)


class TimeStampCreatedByMixin(TimeStampMixin):
    """Same as TimeStampMixin but with created_by and updated_by fields"""

    created_by_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)
    updated_by_id = Column(BigInteger, ForeignKey("users.id"), nullable=True)

    @declared_attr
    def created_by(cls):
        return relationship("Users", foreign_keys=[cls.created_by_id])

    @declared_attr
    def updated_by(cls):
        return relationship("Users", foreign_keys=[cls.updated_by_id])
