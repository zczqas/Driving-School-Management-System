from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.course.filter.course import FilterCourse, SortCourse
from apps.config.db.conn import get_db
from apps.core.models.course.course import (
    Course,
    CourseLesson,
    CourseSubunit,
    CourseUnit,
)
from apps.core.schemas.course.course import (
    CourseCreateSchema,
    CourseFilterSchema,
    CourseResponseSchema,
    CourseResponseSchemaTotal,
)
from apps.security.auth import jwt_service  # noqa

router = APIRouter(prefix="/course", tags=["course"])


@router.get("/get", response_model=CourseResponseSchemaTotal)
def get_courses(
    offset: int = 0,
    limit: int = 10,
    filter: CourseFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(Course)
    filter_param = filter.model_dump(exclude_unset=True)

    query = FilterCourse().filter_course(query, **filter_param)
    query = SortCourse().sorting_course(
        query=query, sort=filter.sort, order=filter.order
    )

    total = query.with_entities(Course.id).count()
    courses = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "courses": courses,
    }


@router.get("/get/{course_id}", response_model=CourseResponseSchema)
def get_course(
    course_id: int,
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    return course


@router.post("/create")
def create_contact_form(
    data: CourseCreateSchema,
    db: Session = Depends(get_db),
):
    course = Course(**data.model_dump())

    try:
        db.add(course)
        db.commit()
        db.refresh(course)
        return course
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e


@router.put("/update/{course_id}")
def update_course(
    course_id: int,
    data: CourseCreateSchema,
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    for key, value in data.model_dump().items():
        if value is not None:
            setattr(course, key, value)

    try:
        db.commit()
        db.refresh(course)
        return course
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e


@router.delete("/delete/{course_id}")
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
):
    course = db.query(Course).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found.",
        )

    try:
        db.delete(course)
        db.commit()
        return {"message": "Course deleted successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e
