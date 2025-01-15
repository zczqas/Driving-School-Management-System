from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.course.course import CourseLesson, CourseSubunit, CourseUnit
from apps.core.models.course.course_log import CourseLessonLog
from apps.core.schemas.course.course_subunit import (
    CourseSubunitCreateSchema,
    CourseSubunitGetSchema,
    CourseSubunitResponseSchema,
    CourseSubunitResponseSchemaTotal,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/course/subunit", tags=["course subunit"])


@router.get("/get", response_model=CourseSubunitResponseSchemaTotal)
def get_course_subunits(
    data: CourseSubunitGetSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    course_lesson = (
        db.query(CourseLesson).filter(CourseLesson.id == data.lesson_id).first()
    )
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Lesson not found.",
        )

    course_unit = db.query(CourseUnit).filter(CourseUnit.id == data.unit_id).first()
    if not course_unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Unit not found.",
        )

    course_subunit = (
        db.query(CourseSubunit)
        .filter(
            CourseSubunit.unit_id == data.unit_id,
            CourseSubunit.lesson_id == data.lesson_id,
        )
        .all()
    )

    try:
        existing_log = (
            db.query(CourseLessonLog)
            .filter(
                CourseLessonLog.lesson_id == course_lesson.id,
                CourseLessonLog.unit_id == course_unit.id,
                CourseLessonLog.user_id == current_user.id,
            )
            .first()
        )
        if existing_log:
            existing_log.is_passed = True  # type: ignore
            existing_log.lesson_id = course_lesson.id
            existing_log.unit_id = course_unit.id
            db.add(existing_log)
        else:
            lesson_log = CourseLessonLog(
                lesson_id=course_lesson.id,
                unit_id=course_unit.id,
                user_id=current_user.id,
                is_passed=True,
            )
            db.add(lesson_log)

        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error creating lesson log: {str(e)}",
        )

    return {
        "total": len(course_subunit),
        "course_subunit": course_subunit,
    }


@router.get("/get/{course_subunit_id}", response_model=CourseSubunitResponseSchema)
def get_course_subunit(
    course_subunit_id: int,
    db: Session = Depends(get_db),
):
    course_subunit = (
        db.query(CourseSubunit).filter(CourseSubunit.id == course_subunit_id).first()
    )
    if not course_subunit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Subunit not found.",
        )

    return course_subunit


@router.post("/create")
def create_course_subunit(
    data: list[CourseSubunitCreateSchema],
    db: Session = Depends(get_db),
):
    course_subunit = [CourseSubunit(**item.model_dump()) for item in data]

    try:
        db.add_all(course_subunit)
        db.commit()
        return {"message": "Course Subunit created successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong. Please try again. {str(e)}",
        ) from e


@router.put("/update/{course_subunit_id}")
def update_course_subunit(
    course_subunit_id: int,
    data: CourseSubunitCreateSchema,
    db: Session = Depends(get_db),
):
    course_subunit = (
        db.query(CourseSubunit).filter(CourseSubunit.id == course_subunit_id).first()
    )
    if not course_subunit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Subunit not found.",
        )

    for key, value in data.model_dump().items():
        if value is not None:
            setattr(course_subunit, key, value)

    try:
        db.add(course_subunit)
        db.commit()
        db.refresh(course_subunit)
        return course_subunit
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e


@router.delete("/delete/{course_subunit_id}")
def delete_course_subunit(
    course_subunit_id: int,
    db: Session = Depends(get_db),
):
    course_subunit = (
        db.query(CourseSubunit).filter(CourseSubunit.id == course_subunit_id).first()
    )
    if not course_subunit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Subunit not found.",
        )

    try:
        db.delete(course_subunit)
        db.commit()
        return {"message": "Course Subunit deleted successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e
