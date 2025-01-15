from sqlalchemy import Column, String, Integer

from apps.config.db.base import Base


class OTPStorage(Base):
    __tablename__ = "otp_storage"

    email = Column(String, primary_key=True)
    otp = Column(String, index=True)
    expiration_time = Column(Integer, index=True)

    def __repr__(self):
        return f"<OTPStorage: {self.email}-{self.otp}>"
