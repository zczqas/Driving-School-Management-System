import requests
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def get_health(
    db: Session = Depends(get_db),
):
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database is not connected.",
        ) from e

    response = requests.get("https://sfds.usualsmart.com/", timeout=5)
    if response.status_code != 200:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="External API is not reachable.",
        )

    # From here, you can add more health checks for other services.

    return {"status": "All services are okay."}
