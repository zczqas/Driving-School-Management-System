from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from apps.apis.v1.users.filter_sort import FilterUser, SortUser
from apps.apis.v1.users.mixins import update_user_profile
from apps.config.db.conn import get_db
from apps.core.models import Profile
from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.package import Package, UserPackage
from apps.core.models.users import Users
from apps.core.schemas.profile import (
    UserProfileFilterSchema,
    UserProfileGetResponse,
    UserProfileGetResponseTotal,
    UserProfileUpdateSchema,
)

# from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("/get", response_model=UserProfileGetResponse)
async def get_current_user_profile(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Router to get user profile

    Args:
        current_user (Any, optional): Get current logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """
    user_profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()

    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    return {"user": current_user, "profile": user_profile}


@router.get("/get/list", response_model=UserProfileGetResponseTotal)
def get_filter_sort_user_profile(
    offset: int = 0,
    limit: int = 10,
    filter_data: UserProfileFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    """Router to get user profile

    Args:
        current_user (Any, optional): Get current logged in user.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """
    query = db.query(Profile).join(Users)

    filter_params = filter_data.model_dump(exclude_unset=True)

    query = FilterUser().filter_users(query, **filter_params)
    query = SortUser().sorting_users(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(Profile.id).count()

    return {
        "total": total,
        "profiles": query.offset(offset).limit(limit).all(),
    }


@router.get("/get/{user_id}", response_model=UserProfileGetResponse)
# @check_role_permissions(["ADMIN","CSR"])
async def get_user_profile_by_id(
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Router to get user profile by id

    Args:
        user_id (int): User id
        db: database

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Profile not found

    Returns:
        "user": user, "profile": user_profile: User and profile
    """

    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = (
        db.query(Profile).filter(Profile.user_id == user.profile.user_id).first()
    )

    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    packages = (
        db.query(Package)
        .join(UserPackage, UserPackage.package_id == Package.id)
        .options(joinedload(Package.lessons))
        .filter(UserPackage.user_id == user_id)
        .all()
    )

    for package in packages:
        booked_lesson_ids = (
            db.query(AppointmentSchedule.lesson_id)
            .filter(
                AppointmentSchedule.student_id == user_id,
                AppointmentSchedule.package_id == package.id,
            )
            .all()
        )
        booked_lesson_ids = [lesson_id for (lesson_id,) in booked_lesson_ids]

        package.lessons = [
            lesson for lesson in package.lessons if lesson.id not in booked_lesson_ids
        ]

    return {"user": user, "profile": user_profile, "packages": packages}


@router.put("/update")
def update_current_user_profile(
    updated_data: UserProfileUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    user = jwt_service.get_user(email=current_user.email, db=db)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )
    return update_user_profile(user.id, updated_data, db, current_user)  # type: ignore


@router.put("/update/{user_id}")
# @check_role_permissions(["ADMIN","CSR"])
def update_profile_by_id(
    user_id: int,
    updated_data: UserProfileUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return update_user_profile(user_id, updated_data, db, current_user)


@router.patch("/lock/{user_id}")
def lock_profile(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User id is required",
        )

    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.id == user.profile.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )
    try:
        if user.is_active:
            user.is_active = False

        db.add(user)
        db.add(user_profile)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong",
        ) from e

    return {"message": "Profile locked successfully"}


@router.patch("/unlock/{user_id}")
def unlock_profile(
    user_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User id is required",
        )

    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.id == user.profile.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    try:
        if not user.is_active:
            user.is_active = True

        db.add(user)
        db.add(user_profile)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong",
        ) from e

    return {"message": "Profile unlocked successfully"}
