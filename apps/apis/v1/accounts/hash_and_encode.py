from cryptography.fernet import Fernet
from fastapi import HTTPException, status

from apps.config.settings import FERNET_KEY

fernet = Fernet(FERNET_KEY)


def encrypt_value(value: str) -> str:
    try:
        return fernet.encrypt(value.encode()).decode()
    except HTTPException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error while encrypting value",
        ) from e


def decrypt_value(encrypted_value: str) -> str:
    try:
        return fernet.decrypt(encrypted_value.encode()).decode("utf-8")
    except HTTPException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="error while decrypting value",
        ) from e
