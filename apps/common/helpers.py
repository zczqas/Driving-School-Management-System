from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from apps.core.models import Profile
from apps.security.auth import jwt_service


def get_user_and_profile(current_user, db: Session):
    user = jwt_service.get_user(email=current_user.email, db=db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    return user, user_profile
