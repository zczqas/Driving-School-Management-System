from sqlalchemy import ARRAY, Boolean, Column, Date, DateTime
from sqlalchemy import Enum as SQLAlchemyEnum
from sqlalchemy import Float, ForeignKey, Integer, String, func
from sqlalchemy.orm import relationship

from apps.common.enum import TransactionMethodEnum, TransactionStatusEnum
from apps.common.model import TimeStampMixin
from apps.config.db.base import Base
from apps.core.models import package


class Transaction(Base, TimeStampMixin):
    __tablename__ = "transactions"

    transaction_id = Column(String, nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship(
        "Users", backref="transactions", lazy="joined", foreign_keys=[user_id]
    )

    package_id = Column(Integer, ForeignKey("packages.id"))
    package = relationship(package.Package, backref="transactions", lazy="joined")

    amount = Column(Float, nullable=False)
    additional_amount = Column(Float, nullable=True)
    discount = Column(Float, nullable=True)
    method = Column(
        SQLAlchemyEnum(TransactionMethodEnum),
        nullable=True,
    )  # nullable is True because of unclear requirement

    location = Column(String, nullable=True)

    total_lesson = Column(Integer, nullable=True)
    scheduled_lesson = Column(ARRAY(Integer), nullable=True)
    # __table_args__ = (
    #     CheckConstraint(
    #         "scheduled_lesson <= total_lesson", name="check_scheduled_lesson"
    #     ),
    # )

    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])

    date_charged = Column(
        Date, nullable=True, default=func.now()
    )  # pylint: disable=not-callable

    refund = Column(Boolean, nullable=True, default=False)

    coupon_id = Column(Integer, ForeignKey("coupons.id"), nullable=True)
    coupon = relationship("Coupon", foreign_keys=[coupon_id])

    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"), nullable=True)
    driving_school = relationship(
        "DrivingSchool", backref="transactions", lazy="joined"
    )
    status = Column(
        SQLAlchemyEnum(TransactionStatusEnum),
        default=TransactionStatusEnum.SETTLED,
    )


class Refund(Base, TimeStampMixin):
    __tablename__ = "refunds"

    transaction_id = Column(Integer, ForeignKey("transactions.id"))

    user_id = Column(Integer, ForeignKey("users.id"))

    refund_amount = Column(Float, nullable=False)
    refund_date = Column(
        DateTime(timezone=True), nullable=False, default=func.now()
    )  # pylint: disable=not-callable
    reason = Column(String, nullable=False)
