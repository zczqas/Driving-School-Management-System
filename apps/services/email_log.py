from fastapi import Depends, HTTPException, status

from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.email_log import EmailLog


async def log_email(
    name: str,
    user_profiles_id: int,
    html_file_name: str,
    content: str,
    db: Session = Depends(get_db),
) -> bool:
    try:
        email_log = EmailLog(
            name=name,
            user_profiles_id=user_profiles_id,
            html_file_name=html_file_name,
            content=content,
        )
        db.add(email_log)
        db.commit()
        db.refresh(email_log)
        return True
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error while logging email: {str(e)}",
        ) from e
