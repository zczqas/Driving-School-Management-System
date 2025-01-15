from apps.config.db.base import Base
from sqlalchemy import (
    Column,
    Date,
    String,
    Integer,
    ForeignKey,
    Float,
    Enum as SQLAlchemyEnum,
)
from sqlalchemy import CheckConstraint
from sqlalchemy.orm import relationship
from apps.common.model import TimeStampMixin

from apps.common.enum import CouponAssignableTypeEnum


class Coupon(Base, TimeStampMixin):
    __tablename__ = "coupons"

    code = Column(String(length=20), nullable=False, unique=True)
    amount = Column(Float, nullable=False)
    min_purchase = Column(Float, nullable=True)
    uses = Column(Integer(), nullable=True, default=0)
    max_uses = Column(Integer(), nullable=True, default=0)
    expiration = Column(Date(), nullable=True)
    type = Column(
        SQLAlchemyEnum(CouponAssignableTypeEnum),
        nullable=False,
        default=CouponAssignableTypeEnum.MULTIPLE_USER,
    )
    notes = Column(String(), nullable=True)
    created_by_id = Column("Users", ForeignKey("users.id"), nullable=True)
    created_by = relationship("Users", foreign_keys=[created_by_id])

    coupon_users = relationship("UsersCoupon", back_populates="coupon")

    CheckConstraint(uses <= max_uses, name="Used should not exceed assigned.")


class UsersCoupon(Base):
    __tablename__ = "users_coupon"

    user_id = Column(ForeignKey("users.id"), primary_key=True)
    coupon_id = Column(ForeignKey("coupons.id"), primary_key=True)
    used = Column(Integer(), nullable=False, default=0)
    assigned = Column(Integer(), nullable=False, default=0)

    coupon = relationship(
        "Coupon",
        back_populates="coupon_users",
    )

    CheckConstraint(used <= assigned, name="Used should not exceed assigned.")
