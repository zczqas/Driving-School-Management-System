from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.driver_ed import DriverEdLessonLog
from apps.core.schemas.driver_ed.driver_ed_lesson import DriverEdLessonLogResponseSchema
from apps.security.auth import jwt_service

router = APIRouter(prefix="/driver_ed_lesson/log", tags=["driver_ed_lesson"])


@router.get("/get", response_model=list[DriverEdLessonLogResponseSchema])
def get_driver_ed_lesson_log(
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lesson_log = (
        db.query(DriverEdLessonLog)
        .order_by(DriverEdLessonLog.lesson_id.asc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    return lesson_log


# @router.post("/create/{lesson_id}")
# def create_driver_ed_lesson_log(
#     lesson_id: int,
#     current_user=Depends(jwt_service.get_current_user),
#     db: Session = Depends(get_db),
# ):
#     lesson = db.query(DriverEdLesson).filter(DriverEdLesson.id == lesson_id).first()
#     if not lesson:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="Lesson not found",
#         )

#     try:
#         lesson_log = DriverEdLessonLog(
#             lesson_id=lesson_id,
#             unit_id=lesson.unit_id,
#             user_id=current_user.id,
#             is_passed=True,
#         )
#         db.add(lesson_log)
#         db.commit()
#     except Exception as e:
#         raise HTTPException(
#             status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
#             detail=str(e),
#         )

#     return {"message": "Driver ed lesson log created"}
