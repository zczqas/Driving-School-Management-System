from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.course.course_log import CourseLessonLog
from apps.core.schemas.course.course_lesson_log import CourseLessonLogResponseSchema
from apps.security.auth import jwt_service

router = APIRouter(prefix="/course/lesson/log", tags=["course lesson log"])


@router.get("/get/{user_id}", response_model=list[CourseLessonLogResponseSchema])
def get_course_lesson_log(
    user_id: int,
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lesson_log = (
        db.query(CourseLessonLog)
        .filter(CourseLessonLog.user_id == user_id)
        .order_by(CourseLessonLog.lesson_id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return lesson_log
