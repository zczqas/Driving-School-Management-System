import asyncio
from functools import wraps

from fastapi import HTTPException, Response, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models import APILog


def log_activity(action: str, description: str):
    """
    - action: the function being decorated
    - description: description of what the function is used for
    - routes that directly return status_code 201 or 204 will be logged accordingly
    - please sir may i have some status_code
    - Example usage: @log_activity(action="get_package", description="Get package Test")
    """

    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get("current_user")
            if current_user is None or current_user.role is None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not validate credentials",
                    headers={"WWW-Authenticate": "Bearer"},
                )
            db: Session = next(get_db())
            log = APILog(
                name=(
                    f"{current_user.first_name} {current_user.last_name}"
                    if current_user
                    else "Anonymous"
                ),
                email=current_user.email if current_user else "N/A",
                action=action,
                description=description,
                status_code=0,
            )
            try:
                if asyncio.iscoroutinefunction(func):
                    response = await func(*args, **kwargs)
                else:
                    response = func(*args, **kwargs)

                if isinstance(response, Response) or isinstance(response, JSONResponse):
                    log.status_code = response.status_code  # type: ignore
                elif isinstance(response, dict):
                    log.status_code = status.HTTP_200_OK  # type: ignore
                else:
                    log.status_code = 0  # type: ignore

                db.add(log)
                db.commit()
                db.refresh(log)
                return response
            except HTTPException as e:
                log.status_code = e.status_code  # type: ignore
                db.add(log)
                db.commit()
                db.refresh(log)
                raise e
            except Exception as e:
                db.rollback()
                log.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR  # type: ignore
                db.add(log)
                db.commit()
                db.refresh(log)
                print(f"Error logging activity: {str(e)}")
                raise

        return wrapper

    return decorator
