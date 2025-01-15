from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from apps.common.model import TimeStampCreatedByMixin, TimeStampMixin
from apps.core.models import Base


class Blog(Base, TimeStampCreatedByMixin):
    __tablename__ = "blog"

    title = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)

    # This is a foreign key to the driving school
    # that the blog belongs to
    driving_school_id = Column(Integer, ForeignKey("driving_schools.id"))
    driving_school = relationship(
        "DrivingSchool", backref="blogs", foreign_keys=[driving_school_id]
    )

    # SEO
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    keywords = Column(String, nullable=True)

    # Image
    blog_images = relationship("BlogImage", back_populates="blog")

    # Category
    category_id = Column(Integer, ForeignKey("blog_category.id"))
    category = relationship("BlogCategory", backref="blogs", foreign_keys=[category_id])


class BlogImage(Base, TimeStampMixin):
    __tablename__ = "blog_image"

    url = Column(String(255), nullable=True)

    blog_id = Column(Integer, ForeignKey("blog.id"))
    blog = relationship("Blog", back_populates="blog_images", foreign_keys=[blog_id])


class BlogCategory(Base, TimeStampMixin):
    __tablename__ = "blog_category"

    name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
