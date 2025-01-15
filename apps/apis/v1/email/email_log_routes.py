from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.email_log import EmailLog

router = APIRouter(prefix="/email_log", tags=["email log"])


@router.get("/get")
def get_email_logs(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    email_logs = (
        db.query(EmailLog)
        .order_by(EmailLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": len(email_logs),
        "offset": offset,
        "limit": limit,
        "email_logs": [
            {
                "id": email_log.id,
                "name": email_log.name,
                "user_profiles_id": email_log.user_profiles_id,
                "user": {
                    "id": email_log.user_profiles.user.id,
                    "first_name": email_log.user_profiles.user.first_name,
                    "middle_name": email_log.user_profiles.user.middle_name,
                    "last_name": email_log.user_profiles.user.last_name,
                    "email": email_log.user_profiles.user.email,
                    "role": email_log.user_profiles.user.role,
                },
                "html_file_name": email_log.html_file_name,
                "content": email_log.content,
                "created_at": email_log.created_at,
            }
            for email_log in email_logs
        ],
    }


@router.get("/get/{user_profiles_id}")
def get_email_logs_by_user_profiles_id(
    user_profiles_id: int,
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    email_logs = (
        db.query(EmailLog)
        .filter(EmailLog.user_profiles_id == user_profiles_id)
        .order_by(EmailLog.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )

    return {
        "total": len(email_logs),
        "offset": offset,
        "limit": limit,
        "email_logs": [
            {
                "id": email_log.id,
                "name": email_log.name,
                "user_profiles_id": email_log.user_profiles_id,
                "user": {
                    "id": email_log.user_profiles.user.id,
                    "first_name": email_log.user_profiles.user.first_name,
                    "middle_name": email_log.user_profiles.user.middle_name,
                    "last_name": email_log.user_profiles.user.last_name,
                    "email": email_log.user_profiles.user.email,
                    "role": email_log.user_profiles.user.role,
                },
                "html_file_name": email_log.html_file_name,
                "content": email_log.content,
                "created_at": email_log.created_at,
            }
            for email_log in email_logs
        ],
    }
