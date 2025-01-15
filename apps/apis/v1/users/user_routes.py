from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apps.apis.v1.users.filter_sort import FilterUser, SortUser
from apps.common.enum import RoleEnum, RoleFilterEnum, RoleUpdateEnum
from apps.config.db.conn import get_db
from apps.core.models.pickup_location import PickupLocation
from apps.core.models.school_organization import School
from apps.core.models.users import Profile, UserDrivingSchool, Users
from apps.core.schemas.profile import PickupLocationResponseSchemaTotal
from apps.core.schemas.user import (
    AdminUserCreateResponseSchema,
    AdminUserCreateSchema,
    UserFilterSchema,
    UserResponseSchema,
    UserResponseSchemaTotal,
)
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.services.send_email import send_email

router = APIRouter(prefix="/user", tags=["user"])


@router.post("/verify")
async def verify_user(
    current_user: Users = Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    user = jwt_service.get_user(db=db, email=current_user.email)  # type: ignore
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.is_verified:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User already verified"
        )

    token = jwt_service.create_verification_token(data={"user_id": user.id})

    # For Development
    # verification_link = f"https://sfds.usualsmart.com/api/auth/verify?token={token}"

    verification_link = (
        f"https://sfds.usualsmart.com/verify?token={token}"  # For production
    )

    email_body = {
        "username": user.first_name.capitalize(),
        "verification_link": verification_link,
    }

    await send_email(
        subject="Verification email",
        receiver=[user.email],  # type: ignore
        body=email_body,
        template_name="verification_user_template.html",
        db=db,
    )

    return {"message": "Verification email sent successfully"}


@router.post("/verify/password")
def verify_user_and_change_password(
    token: str,
    new_password: str = Form(...),
    db: Session = Depends(get_db),
):
    try:
        payload = jwt_service.decode_verification_token(token)
        user_id = payload.get("user_id")

        user = db.query(Users).filter(Users.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid token"
        ) from e

    try:
        setattr(user, "is_verified", True)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=f"{str(e)}"
        ) from e

    try:
        hash_password = jwt_service.get_password_hash(new_password)
        setattr(user, "password", hash_password)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password updated successfully"}


@router.get("/get", response_model=UserResponseSchemaTotal)
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"]) # Disabled for now
def get_user_sort_filter(
    offset: int = 0,
    limit: int = 10,
    user_filter_params: UserFilterSchema = Depends(),
    # current_user = Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to get user profile(for CSR, ADMIN, INSTRUCTOR)

    Args:
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """
    query = db.query(Users)

    filter_params = user_filter_params.model_dump(exclude_unset=True)

    query = FilterUser().filter_users(query, **filter_params)
    query = SortUser().sorting_users(
        query=query, sort=user_filter_params.sort, order=user_filter_params.order
    )

    total_count = query.with_entities(Users.id, Users.role)

    if user_filter_params.role in [RoleFilterEnum.ALL, RoleFilterEnum.NOT_STUDENT]:
        total_count = query.count()
    else:
        total_count = query.filter(Users.role == user_filter_params.role).count()

    response = {
        "total_count": total_count,
        "users": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{pk}", response_model=UserResponseSchema)
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"])  # Disabled for now
def get_user_by_id(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to get user by ID

    Args:
        pk (int): User ID
        current_user (Object): currently logged in user.
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        User object: User object
    """
    user = db.query(Users).filter(Users.id == pk).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    return user


@router.get("/get/pickup/{pk}", response_model=PickupLocationResponseSchemaTotal)
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"])  # Disabled for now
def get_pickup_from_user_id(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to get pickup location by user ID

    Raises:
        HTTPException: 404, User not found
        HTTPException: 404, Pickup not found
    """
    user = db.query(Users).filter(Users.id == pk).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    pickup = db.query(PickupLocation).filter(PickupLocation.user_id == pk).all()
    if not pickup:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Pickup not found"
        )

    total_count = (
        db.query(PickupLocation)
        .with_entities(PickupLocation.id)
        .filter(PickupLocation.user_id == pk)
        .count()
    )

    return {"total": total_count, "pickup_location": pickup}


@router.patch("/update/role/{pk}")
# @check_role_permissions(["ADMIN", "CSR"]) # Disabled for now
def update_user_role(
    pk: int,
    role: RoleUpdateEnum = RoleUpdateEnum.STUDENT,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to change user role

    Args:
        pk (int): User ID
        role (RoleEnum, optional):
            Roles are
                STUDENT,
                INSTRUCTOR,
                CSR,
                ADMIN. Defaults to RoleEnum.STUDENT.
        current_user (Object, optional):
            currently logged in user. Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): Database. Defaults to Depends(get_db).

    Returns:
        success message: Role updated successfully
    """
    if role not in [
        RoleUpdateEnum.STUDENT,
        RoleUpdateEnum.INSTRUCTOR,
        RoleUpdateEnum.CSR,
        RoleUpdateEnum.ADMIN,
    ]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role"
        )

    db.query(Users).filter(Users.id == pk).update({"role": role})
    db.commit()

    return {"message": "Role updated successfully"}


@router.post("/post", response_model=AdminUserCreateResponseSchema)
# @check_role_permissions(["ADMIN", "CSR"])  # Disabled for now
async def create_user_admin(
    user_data: AdminUserCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to create user profile(for ADMIN, CSR)
    :param current_user:
    :param db:
    :return:
    """

    db_item_data = user_data.model_dump(
        exclude_unset=True, exclude={"school", "email", "driving_school_id"}
    )
    password = db_item_data.pop("password")
    hash_password = jwt_service.get_password_hash(password)
    db_item_data["password"] = hash_password
    db_item_data["email"] = user_data.email.lower()

    profile_data = {
        k: db_item_data.pop(k)
        for k in [
            "cell_phone",
            "address",
            "apartment",
            "city",
            "state",
            "dob",
            "gender",
        ]
        if k in db_item_data and db_item_data[k] is not None
    }

    obj = Users(**db_item_data)

    if user_data.school_id is not None:
        schools = db.query(School).filter(School.id == user_data.school_id).first()

        if not schools:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="School does not exist",
            )

        setattr(obj, "school_id", user_data.school_id)

    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)

        profile_data["user_id"] = obj.id
        user_profile = Profile(**profile_data)
        db.add(user_profile)
        db.commit()
        db.refresh(user_profile)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists"
        ) from e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    if user_data.driving_school_id is not None:
        for driving_school_id in user_data.driving_school_id:
            user_driving_school = UserDrivingSchool(
                user_id=obj.id,
                driving_school_id=driving_school_id,
            )
            try:
                db.add(user_driving_school)
                db.commit()
            except Exception as e:
                db.rollback()
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error creating user driving school: {str(e)}",
                ) from e

    try:
        if obj.role is RoleEnum.STUDENT:
            token = jwt_service.create_verification_token(data={"user_id": obj.id})

            redirect_link = (
                # For Development
                # f"http://localhost:8000/docs/api/user/verify/password?token={token}"
                f"https://sfds.usualsmart.com/password/change?token={token}&isNewUser=true"  # For production
            )

            email_body = {
                "username": obj.first_name.capitalize(),
                "redirect_link": redirect_link,
            }

            await send_email(
                subject="Verification email",
                receiver=[obj.email],  # type: ignore
                user_profiles_id=user_profile.id,  # type: ignore
                body=email_body,
                template_name="verification_student_template.html",
                db=db,
            )

        if obj.role is not RoleEnum.STUDENT:
            email_body = {
                "username": obj.first_name.capitalize(),
                "email": obj.email,
                "password": password,
            }

            await send_email(
                subject="Verification email",
                receiver=[obj.email],  # type: ignore
                user_profiles_id=user_profile.id,  # type: ignore
                body=email_body,
                template_name="verification_admin_template.html",
                db=db,
            )
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to send email",
        ) from e

    return {
        "message": "User created successfully",
        "user": obj,
        "profile": user_profile,
    }


@router.delete("/delete/{pk}", status_code=status.HTTP_204_NO_CONTENT)
@check_role_permissions(["ADMIN"])
def delete_user(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """Route to delete user

    Args:
        pk (int): user id
        current_user (_type_, optional): Used for role permission decorator DO NOT remove.
                                        Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).
    """

    user = db.query(Users).filter(Users.id == pk).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_profile = db.query(Profile).filter(Profile.user_id == pk).first()
    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    try:
        db.delete(user)
        db.commit()

        db.delete(user_profile)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e
