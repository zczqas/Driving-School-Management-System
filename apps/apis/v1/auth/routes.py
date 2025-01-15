import time

from fastapi import Depends, Form, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import EmailStr
from sqlalchemy import and_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from apps.common.exception import (
    UserNotFoundException,
    InvalidCredentialsException,
)
from apps.config import settings

from apps.config.db.conn import get_db
from apps.core.models import Users
from apps.core.models.otp_storage import OTPStorage
from apps.core.models.package import UserPackage
from apps.core.models.users import Profile, UserDrivingSchool
from apps.core.schemas.auth import LoginResponseWithTokenType
from apps.core.schemas.user import UserCreateSchema, WebUserCreateSchema

# from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.services.send_email import send_email
from apps.utils.generate_otp import generate_numeric_otp


router = APIRouter(prefix="/auth")


@router.post("/login", response_model=LoginResponseWithTokenType)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    """Login route"""
    try:
        user = jwt_service.authenticate_user(
            email=form_data.username, password=form_data.password, db=db
        )
    except (UserNotFoundException, InvalidCredentialsException) as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e)
        ) from e

    if user.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Your account has been lock. Please contact support",
        )

    basic_user_information = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }

    if user.is_verified is not True:
        try:
            token = jwt_service.create_verification_token(data={"user_id": user.id})
            verification_link = (
                f"https://sfds.usualsmart.com/api/v1/auth/verify?token={token}"
            )
            email_body = {
                "username": user.first_name.capitalize(),
                "verification_link": verification_link,
            }
            await send_email(
                subject="Verification email",
                receiver=[user.email],
                body=email_body,
                template_name="verification_login_template.html",
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    return LoginResponseWithTokenType(
        id=user.id,
        email=user.email,
        role=user.role,
        access_token=jwt_service.create_access_token(basic_user_information),
        refresh_token=jwt_service.create_refresh_token(basic_user_information),
        token_type="Bearer",
    )


@router.post("/register")
async def register_user(user: UserCreateSchema, db: Session = Depends(get_db)):
    """Register route"""

    db_item_data = user.model_dump(
        exclude_unset=True,
        exclude={
            "password",
            "role",
            "school",
            "email",
            "cell_phone",
            "driving_school_id",
        },
    )
    password = user.password
    hash_password = jwt_service.get_password_hash(password)
    db_item_data["password"] = hash_password
    db_item_data["email"] = user.email.lower()
    role = user.role
    obj = Users(**db_item_data)

    try:
        try:
            db.add(obj)
            db.commit()
            db.refresh(obj)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error occurred while creating user {e}",
            ) from e

        try:
            user_profile = Profile(user_id=obj.id, cell_phone=user.cell_phone)
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"lmao {e}"
            ) from e

        if user.driving_school_id is not None:
            for driving_school_id in user.driving_school_id:
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

    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail already exists"
        ) from exc
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    token = jwt_service.create_verification_token(data={"user_id": obj.id})

    verification_link = (
        f"https://sfds.usualsmart.com/verify?token={token}&email={obj.email}"
    )

    # verification_link = (
    #     f"http://localhost:8000/api/auth/verify?token={token}"  # for dev
    # )

    email_body = {
        "username": user.first_name.capitalize(),
        "verification_link": verification_link,
    }

    await send_email(
        subject="Verification email",
        receiver=[user.email],
        body=email_body,
        template_name="verification_template.html",
        db=db,
        user_profiles_id=user_profile.id,
    )

    return {
        "message": "User created successfully, please check your email to verify your account"
    }


@router.post("/register/web")
async def register_web_user(
    user_data: WebUserCreateSchema,
    db: Session = Depends(get_db),
):
    db_item_data = user_data.model_dump(
        exclude_unset=True,
        exclude={
            "email",
            "password",
            "role",
            "cell_phone",
            "apartment",
            "city",
            "state",
            "gender",
            "dob",
            "package_id",
        },
    )
    password = user_data.password
    hash_password = jwt_service.get_password_hash(password)
    db_item_data["password"] = hash_password
    db_item_data["email"] = user_data.email.lower()
    role = user_data.role
    obj = Users(**db_item_data)

    try:
        db.add(obj)
        db.commit()
        db.refresh(obj)

        try:
            user_profile = Profile(
                user_id=obj.id,
                cell_phone=user_data.cell_phone,
                apartment=user_data.apartment,
                city=user_data.city,
                state=user_data.state,
                dob=user_data.dob,
            )
            db.add(user_profile)
            db.commit()
            db.refresh(user_profile)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user profile: {str(e)}",
            ) from e

        try:
            if user_data.package_id is not None:
                user_package = UserPackage(
                    user_id=obj.id,
                    package_id=user_data.package_id,
                )
                db.add(user_package)
                db.commit()
                db.refresh(user_package)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error creating user package: {str(e)}",
            ) from e

    except IntegrityError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="E-mail already exists"
        ) from e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error createing user: {str(e)}",
        ) from e

    token = jwt_service.create_verification_token(data={"user_id": obj.id})

    verification_link = (
        f"https://sfds.usualsmart.com/verify?token={token}&email={obj.email}"
    )

    # verification_link = (
    #     f"http://localhost:8000/api/auth/verify?token={token}"  # for dev
    # )

    email_body = {
        "username": user_data.first_name.capitalize(),
        "verification_link": verification_link,
    }

    await send_email(
        subject="Verification email",
        receiver=[user_data.email],
        user_profiles_id=user_profile.id,
        body=email_body,
        template_name="verification_template.html",
        db=db,
    )

    return {
        "message": "User created successfully, please check your email to verify your account"
    }


@router.get("/resend-verification-email")
async def resend_verification_email(
    email: EmailStr,
    db: Session = Depends(get_db),
):
    token = jwt_service.create_verification_token(data={"email": email})

    verification_link = (
        f"https://sfds.usualsmart.com/verify?token={token}&email={email}"
    )

    email_body = {
        "verification_link": verification_link,
    }

    try:
        await send_email(
            subject="Verification email",
            receiver=[email],
            body=email_body,
            template_name="verification_template.html",
            db=db,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Verification email sent successfully"}


@router.get("/verify")
async def verify(token: str, db: Session = Depends(get_db)):
    """Route to verify user through email when registering

    Args:
        token (str): Token from email

    Raises:
        HTTPException: 404, User not found
        HTTPException: 500, str(e)
        HTTPException: 400, Token might have been already used. Please try again.

    Returns:
        message: User verified successfully
    """

    try:
        payload = jwt_service.decode_verification_token(token)
        user_id = payload.get("user_id")

        user = db.query(Users).filter(Users.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        try:
            setattr(user, "is_verified", True)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
            ) from e

        return {"message": "User verified successfully"}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Token might have been already used. Please try again.",
        ) from e


@router.post("/token/refresh-token", response_model=dict)
async def refresh_access_token(refresh_token: str, db: Session = Depends(get_db)):
    """
    Get access token using refresh token

    :param refresh_token: secret refresh token
    :param db: Optional, database connection default: Depends(get_db)
    :return: access token and token type
    """

    user = jwt_service.validate_refresh_access_token(db=db, refresh_token=refresh_token)
    data = {
        "id": user.id,
        "email": user.email,
        "role": user.role,
    }
    return {
        "access_token": jwt_service.create_access_token(data),
        "token_type": "Bearer",
    }


@router.get("/password/forget", response_model=dict)
async def forget_password(email: EmailStr, db: Session = Depends(get_db)):
    """
    Forget password rest api

    :param email: EmailStr
    :param db: Database connection
    :return: dict, success message
    """

    user = jwt_service.get_user(db=db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")

    otp = await generate_numeric_otp(length=settings.OTP_LENGTH)
    expiration_time = int(time.time()) + 600

    email_exists = db.query(OTPStorage).filter(OTPStorage.email == email).first()
    if email_exists:
        await jwt_service.update_otp(
            db=db, email=email, otp=otp, expiration_time=expiration_time
        )
    else:
        await jwt_service.save_otp(
            db=db, email=email, otp=otp, expiration_time=expiration_time
        )

    await send_email(
        subject="OTP for password reset",
        receiver=[email],
        user_profiles_id=user.profile.id,
        body={"otp": otp},
        template_name="otp_template.html",
        db=db,
    )

    return {"message": "Successfully send password reset link in your mail."}


@router.post("/password/verify-otp")
async def verify_otp(
    otp: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Verify OTP rest api

    :param email: EmailStr
    :param otp: str
    :param db: Database connection
    :return: dict, success message
    """

    verified_otp = await jwt_service.verify_otp(db=db, otp=otp)

    if not verified_otp:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="OTP doesn't match or expired. Please try again.",
        )

    return {"message": "OTP verified successfully"}


@router.post("/password/reset", response_model=dict)
async def reset_password(
    otp: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
    db: Session = Depends(get_db),
):
    """
    Reset password rest api

    :param email: EmailStr
    :param new_password: str
    :param db: Database connection
    :return: dict, success message
    """

    user = (
        db.query(Users)
        .join(OTPStorage, Users.email == OTPStorage.email)
        .filter(and_(OTPStorage.otp == otp, Users.email == OTPStorage.email))
        .first()
    )

    verified_otp = await jwt_service.verify_otp(db=db, otp=otp)

    if not verified_otp:
        raise HTTPException(
            status_code=404, detail="OTP doesn't match or expired. Please try again."
        )

    if new_password != confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Password doesn't match"
        )

    new_hash_password = jwt_service.get_password_hash(new_password)

    try:
        setattr(user, "password", new_hash_password)
        db.add(user)
        db.commit()

        db.query(OTPStorage).filter(OTPStorage.otp == otp).delete()
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password reset successfully"}


@router.post("/password/change", response_model=dict)
async def change_password(
    old_password: str = Form(...),
    new_password: str = Form(...),
    user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    if not jwt_service.verify_password(old_password, user.password):
        raise HTTPException(status_code=404, detail="Incorrect Old Password")

    new_hash_password = jwt_service.get_password_hash(new_password)

    user.password = new_hash_password

    try:
        db.add(user)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Password changed successfully"}
