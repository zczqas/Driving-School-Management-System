from functools import wraps
from typing import List

from fastapi import HTTPException, status


def check_role_permissions(allowed_roles: List[str]):
    """Decorator to check role permissions

    Args:
        allowed_roles (List[str]): List of allowed roles to perform action
    """

    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if current_user is None or current_user.role is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )

            if current_user.role not in allowed_roles:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to perform this action",
                )
            return func(*args, **kwargs)

        return wrapper

    return decorator
