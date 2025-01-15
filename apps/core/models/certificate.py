from sqlalchemy.orm import relationship
from sqlalchemy import (
    Boolean,
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
from apps.common.enum import CertificateTypeEnum, UserCertificateStatusEnum


class UserCertificate(Base, TimeStampMixin):
    __tablename__ = "user_certificates"

    certificate_id = Column(
        BigInteger, ForeignKey("dmv_certificates.id"), nullable=False
    )
    certificate = relationship("Certificate", backref="user_certificates")

    user_profiles_id = Column(
        BigInteger, ForeignKey("user_profiles.id"), nullable=False
    )
    user_profiles = relationship(
        "Profile",
        backref="user_certificates",
        foreign_keys=[user_profiles_id],
    )

    instructor_id = Column(BigInteger, ForeignKey("user_profiles.id"), nullable=True)
    instructor = relationship(
        "Profile",
        backref="instructor_certificates",
        foreign_keys=[instructor_id],
    )

    status = Column(
        SQLAlchemyEnum(UserCertificateStatusEnum),
        nullable=False,
        default=UserCertificateStatusEnum.ASSIGNED,
    )
    assigned_date = Column(
        DateTime(timezone=True), default=func.now()  # pylint: disable=not-callable
    )
    issued_date = Column(DateTime(timezone=True), nullable=True, default=func.now())


class Certificate(Base, TimeStampMixin):
    __tablename__ = "dmv_certificates"

    certificate_number = Column(String(50), nullable=True, index=True)
    is_assigned = Column(Boolean, default=False)
    status = Column(
        SQLAlchemyEnum(UserCertificateStatusEnum),
        nullable=True,
        default=UserCertificateStatusEnum.NOT_ASSIGNED,
    )
    batch_id = Column(String(50), nullable=False, index=True)
    certificate_type = Column(
        SQLAlchemyEnum(CertificateTypeEnum),
        nullable=False,
        default=CertificateTypeEnum.GOLD,
    )
