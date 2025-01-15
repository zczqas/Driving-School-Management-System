from sqlalchemy.orm import relationship
from sqlalchemy import (
    String,
    ForeignKey,
    Column,
    DateTime,
    BigInteger,
    Enum as SQLAlchemyEnum,
    func,
)

from apps.config.db.base import Base
from apps.common.model import TimeStampMixin
from apps.common.enum import CertStatusEnum, CertTypeEnum


class Cert(Base, TimeStampMixin):
    __tablename__ = "certificates"
    certificate_id = Column(String, nullable=True)
    user_profiles_id = Column(
        BigInteger, ForeignKey("user_profiles.id"), nullable=False
    )
    user_profiles = relationship(
        "Profile",
        backref="cert_user_profiles",
        foreign_keys=[user_profiles_id],
    )
    instructor_id = Column(BigInteger, ForeignKey("user_profiles.id"), nullable=False)
    instructor = relationship(
        "Profile",
        backref="cert_instructor",
        foreign_keys=[instructor_id],
    )
    status = Column(
        SQLAlchemyEnum(CertStatusEnum),
        nullable=False,
        default=CertStatusEnum.NOT_ISSUED,
    )
    certificate_type = Column(SQLAlchemyEnum(CertTypeEnum), nullable=False)
    assigned_date = Column(DateTime(timezone=True), default=func.now())
    issued_date = Column(DateTime(timezone=True), nullable=True)
