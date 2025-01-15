from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from apps.core.models.driver_ed_log import DriverEdLog
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_quiz/log", tags=["driver_ed_quiz"])


@router.get("/unit/{unit_id}")
def get_quiz_log_by_unit_id(
    unit_id: int,
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    quiz_log = (
        db.query(DriverEdLog)
        .filter(DriverEdLog.unit_id == unit_id)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "quiz_log": [
            {
                "id": log.id,
                "user_id": log.user_id,
                "marks": log.marks,
                "percentage": log.percentage,
                "detail": log.detail,
                "remarks": log.remarks,
                "progress_date": log.progress_date,
            }
            for log in quiz_log
        ]
    }


@router.get("/user/{user_id}")
def get_quiz_log_by_user_id(
    user_id: int,
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    quiz_log = (
        db.query(DriverEdLog)
        .filter(DriverEdLog.user_id == user_id)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "quiz_log": [
            {
                "id": log.id,
                "unit_id": log.unit_id,
                "marks": log.marks,
                "percentage": log.percentage,
                "detail": log.detail,
                "remarks": log.remarks,
                "progress_date": log.progress_date,
            }
            for log in quiz_log
        ]
    }
