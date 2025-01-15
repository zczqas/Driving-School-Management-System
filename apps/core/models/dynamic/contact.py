from sqlalchemy import Column, String, Text

from apps.common.model import TimeStampMixin
from apps.core.models import Base


class ContactForm(Base, TimeStampMixin):
    __tablename__ = "contact_form"

    name = Column(String(50), nullable=True)
    email = Column(String(50), nullable=True)
    phone = Column(String(50), nullable=True)
    message = Column(Text, nullable=True)
