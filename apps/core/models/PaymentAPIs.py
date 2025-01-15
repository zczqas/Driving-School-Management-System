from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy.orm import relationship
from enum import Enum

from apps.common.enum import PaymentAPIsTypeEnum
from apps.common.model import TimeStampMixin
from apps.config.db.base import Base


class PaymentAPIs(Base, TimeStampMixin):
    __tablename__ = "payment_apis"
    name = Column(String(255), nullable=False)

    sandbox_api_key_id = Column(String(255), nullable=False)
    sandbox_transaction_key = Column(String(255), nullable=False)
    sandbox_is_active = Column(Boolean, default=False)

    production_api_key_id = Column(String(255), nullable=False)
    production_transaction_key = Column(String(255), nullable=False)
    production_is_active = Column(Boolean, default=False)

    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"), nullable=True)
    driving_school = relationship(
        "DrivingSchool", backref="payment_apis", lazy="joined"
    )
