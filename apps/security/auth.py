import time
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from jose.exceptions import ExpiredSignatureError
from passlib.context import CryptContext
from pydantic import EmailStr
from sqlalchemy.orm import Session
from starlette import status

from apps.common.exception import InvalidCredentialsException, UserNotFoundException
from apps.config import settings
from apps.config.db.conn import get_db
from apps.core.models import Users
from apps.core.models.otp_storage import OTPStorage

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


class JWTSecurity(object):
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.SECRET_KEY = settings.SECRET_KEY
        self.ALGORITHM = settings.ALGORITHM
        self.ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
        self.REFRESH_TOKEN_TIME_IN_MINUTES = settings.REFRESH_TOKEN_TIME_IN_MINUTES

        # self.db: Session = get_db()

    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def get_password_hash(self, password):
        return self.pwd_context.hash(password)

    def get_user(self, email: str, db: Session):
        return db.query(Users).filter(Users.email == email).first()

    def authenticate_user(self, email: str, password: str, db: Session):
        user = self.get_user(email=email, db=db)

        if not user:
            raise UserNotFoundException(message="User not found")

        if not self.verify_password(password, str(user.password)):
            raise InvalidCredentialsException(message="Invalid credentials")

        return user

    def create_access_token(self, data: dict, expires_delta: timedelta = None):  # type: ignore
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=60)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)  # type: ignore
        return encoded_jwt

    def create_refresh_token(self, data: dict, expires_delta: timedelta = None):  # type: ignore
        to_encode = data.copy()
        to_encode.update({"token": "refresh"})
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(days=40)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)  # type: ignore
        return encoded_jwt

    def create_verification_token(self, data: dict) -> str:
        to_encode = data.copy()
        # Token does not expire (Why? Because i was told)
        # expire = datetime.utcnow() + timedelta(
        #     minutes=60
        # )
        # to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, self.SECRET_KEY, algorithm=self.ALGORITHM)  # type: ignore
        return encoded_jwt

    def get_current_user(
        self, db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
    ):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            email: Optional[str] = self.decode_access_token_and_return_email(token)
            if email is None:
                raise credentials_exception
        except JWTError as e:
            raise credentials_exception from e
        user = self.get_user(email=email, db=db)
        if user is None:
            raise credentials_exception
        return user

    def decode_access_token_and_return_email(self, token: str):
        payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])  # type: ignore
        email: Optional[str] = payload.get("email")
        return email

    def decode_verification_token(self, token: str) -> dict[str, int]:
        try:
            payload = jwt.decode(token, self.SECRET_KEY, algorithms=[self.ALGORITHM])  # type: ignore
            return payload
        except JWTError as e:
            raise ExpiredSignatureError("Token is expired") from e
            # raise jwt.ExpiredSignatureError("Token is expired") from e

    def validate_refresh_access_token(self, db: Session, refresh_token: str):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            payload = jwt.decode(
                refresh_token, self.SECRET_KEY, algorithms=[self.ALGORITHM]  # type: ignore
            )
            email: str = payload.get("email")  # type: ignore
            if email is None:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        try:
            refresh_token = payload.get("token")  # type: ignore
            if not refresh_token:
                raise credentials_exception
        except JWTError:
            raise credentials_exception

        user = self.get_user(email=email, db=db)

        if user is None:
            raise credentials_exception

        return user

    async def verify_otp(self, otp: str, db: Session) -> bool:
        if not otp:
            return False
        stored_otp_data = db.query(OTPStorage).filter(OTPStorage.otp == otp).first()

        if stored_otp_data:
            expiration_time = stored_otp_data.expiration_time
            current_time = int(time.time())
            if current_time < expiration_time.value:
                return True
        return False

    async def save_otp(
        self, email: EmailStr, otp: str, expiration_time: int, db: Session
    ):
        try:
            db_item = OTPStorage(email=email, otp=otp, expiration_time=expiration_time)
            db.add(db_item)
            db.commit()
            db.refresh(db_item)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e

    async def update_otp(
        self, email: EmailStr, otp: str, expiration_time: int, db: Session
    ):
        try:
            db_item = db.query(OTPStorage).filter(OTPStorage.email == email).first()
            setattr(db_item, "otp", otp)
            setattr(db_item, "expiration_time", expiration_time)
            db.commit()
            db.refresh(db_item)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
            ) from e


jwt_service = JWTSecurity()
