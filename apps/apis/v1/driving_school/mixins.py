import re
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from apps.core.models.school_organization import DrivingSchool, URLs


def check_existence_and_raise(db, model, field, value, field_name):
    if value is not None:
        exists = db.query(model).filter(field == value).first()
        if exists:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"{field_name} {value} already exists",
            )


def is_valid_domain(domain):
    regex = re.compile(
        r"^(?:[a-zA-Z0-9]"  # First character of the domain
        r"(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)"  # Sub domain + hostname
        r"+[a-zA-Z]{2,6}$"  # First level TLD
    )
    return re.match(regex, domain) is not None


def get_or_create_urls(db: Session, driving_school: DrivingSchool) -> URLs:
    if driving_school.driving_school_urls_id is None:
        try:
            driving_school_urls = URLs()
            db.add(driving_school_urls)
            db.commit()
            db.refresh(driving_school_urls)
            driving_school.driving_school_urls_id = driving_school_urls.id  # type: ignore
            db.add(driving_school)
            db.commit()
            db.refresh(driving_school)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error occurred while creating driving school urls: {e}",
            )
    else:
        driving_school_urls = (
            db.query(URLs)
            .filter(URLs.id == driving_school.driving_school_urls_id)
            .first()
        )
    return driving_school_urls  # type: ignore
