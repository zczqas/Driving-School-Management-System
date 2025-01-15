from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from apps.apis.v1.course.util.file import CourseFileUtil
from apps.config.db.conn import get_db
from apps.core.models.course.course import CourseLesson, CourseUnit
from apps.core.models.course.course_log import CourseLessonLog
from apps.core.schemas.course.course_lesson import (
    CourseLessonCreateSchema,
    CourseLessonResponseSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/course/lesson", tags=["course lesson"])


@router.get("/get", response_model=list[CourseLessonResponseSchema])
def get_course_lessons(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    course_lessons = db.query(CourseLesson).all()

    return course_lessons


@router.get("/get/{course_lesson_id}", response_model=CourseLessonResponseSchema)
def get_course_lesson(
    course_lesson_id: int,
    db: Session = Depends(get_db),
):
    course_lesson = (
        db.query(CourseLesson).filter(CourseLesson.id == course_lesson_id).first()
    )
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Lesson not found.",
        )

    return course_lesson


@router.get(
    "/get/unit/{course_unit_id}", response_model=list[CourseLessonResponseSchema]
)
def get_course_lessons_by_unit(
    course_unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    course_lessons = (
        db.query(CourseLesson).filter(CourseLesson.unit_id == course_unit_id).all()
    )
    lesson_log = (
        db.query(CourseLessonLog)
        .filter(CourseLessonLog.user_id == current_user.id)
        .all()
    )

    return [
        {
            "id": course_lesson.id,
            "unit_id": course_lesson.unit_id,
            "title": course_lesson.title,
            "body": course_lesson.body,
            "video_url": course_lesson.video_url,
            "video_name": course_lesson.video_name,
            "image_url": course_lesson.image_url,
            "image_name": course_lesson.image_name,
            "is_passed": any(log.lesson_id == course_lesson.id for log in lesson_log),
        }
        for course_lesson in course_lessons
    ]


@router.post("/create")
def create_course_lesson_form(
    title: Optional[str] = Form(None),
    body: Optional[str] = Form(None),
    unit_id: Optional[int] = Form(None),
    video_name: Optional[str] = Form(None),
    video: Optional[UploadFile] = File(None),
    image_name: Optional[str] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    if not title or title == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lesson title is required.",
        )
    if not body or body == "":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lesson body is required.",
        )
    if not unit_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unit ID is required.",
        )
    if not video_name and video:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Video name is required.",
        )
    if not image_name and image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image name is required.",
        )

    unit = db.query(CourseUnit).filter(CourseUnit.id == unit_id).first()
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found.",
        )
    try:
        if video_name and video:
            course_video_url = CourseFileUtil().save_video_without_compression(video)
        if image_name and image:
            course_chart_url = CourseFileUtil().check_and_get_image_path(image)
        course_lesson = CourseLesson(
            title=title,
            body=body,
            video_name=video_name,
            video_url=course_video_url if video_name else None,
            image_name=image_name,
            image_url=course_chart_url if image_name else None,
            unit_id=unit_id,
        )
        db.add(course_lesson)
        db.commit()
        db.refresh(course_lesson)
        return course_lesson
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error.",
        ) from e


@router.put("/update/{course_lesson_id}")
def update_course_lesson(
    course_lesson_id: int,
    data: CourseLessonCreateSchema,
    db: Session = Depends(get_db),
):
    course_lesson = (
        db.query(CourseLesson).filter(CourseLesson.id == course_lesson_id).first()
    )
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Lesson not found.",
        )

    unit = db.query(CourseUnit).filter(CourseUnit.id == data.unit_id).first()
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found.",
        )

    for key, value in data.model_dump().items():
        if value is not None:
            setattr(course_lesson, key, value)

    try:
        db.add(course_lesson)
        db.commit()
        db.refresh(course_lesson)
        return {"message": "Course Lesson updated."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error.",
        ) from e


@router.delete("/delete/{course_lesson_id}")
def delete_course_lesson(
    course_lesson_id: int,
    db: Session = Depends(get_db),
):
    course_lesson = (
        db.query(CourseLesson).filter(CourseLesson.id == course_lesson_id).first()
    )
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Lesson not found.",
        )

    try:
        db.delete(course_lesson)
        db.commit()
        return {"message": "Course Lesson deleted."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal Server Error.",
        ) from e
