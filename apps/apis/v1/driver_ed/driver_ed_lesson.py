from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from apps.core.models.driver_ed import DriverEdLesson, DriverEdLessonLog
from apps.core.schemas.driver_ed.driver_ed_lesson import (
    DriverEdLessonResponseLogSchema,
    DriverEdLessonResponseSchema,
)


from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_lesson", tags=["driver_ed_lesson"])


@router.get("/get", response_model=list[DriverEdLessonResponseSchema])
def get_driver_ed_lessons(
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    questions = db.query(DriverEdLesson).limit(limit).offset(offset).all()
    return questions


# @router.get("/get/{unit_id}", response_model=DriverEdLessonResponseLogSchema)
@router.get("/get/{unit_id}")
def get_driver_ed_lessons_by_unit_id(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lessons = (
        db.query(DriverEdLesson)
        .filter(DriverEdLesson.unit_id == unit_id)
        .order_by(DriverEdLesson.id.asc())
        .all()
    )
    if not lessons:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found",
        )

    lesson_log = (
        db.query(DriverEdLessonLog)
        .filter(DriverEdLessonLog.user_id == current_user.id)
        .all()
    )

    return {
        "lesson": [
            {
                "id": lesson.id,
                "unit_id": lesson.unit_id,
                "ed_id": lesson.ed_id,
                "title": lesson.title,
                "is_passed": any(
                    log.lesson_ed_id == lesson.ed_id for log in lesson_log
                ),
            }
            for lesson in lessons
        ],
    }


@router.post("/create")
def create_driver_ed_lesson(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": "Driver ed question created"}


@router.put("/update/{lesson_id}")
def update_driver_ed_lesson(
    lesson_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": f"Update driver ed question {lesson_id}"}


@router.delete("/delete/{lesson_id}")
def delete_driver_ed_lesson(
    lesson_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):

    return {"message": f"Delete driver ed question {lesson_id}"}
