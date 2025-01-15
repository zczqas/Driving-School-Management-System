from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.course.course import CourseUnit
from apps.core.schemas.course.course_unit import (
    CourseUnitCreateSchema,
    CourseUnitResponseSchema,
    CourseUnitResponseSchemaTotal,
)
from apps.security.auth import jwt_service  # noqa

router = APIRouter(prefix="/course/unit", tags=["course unit"])


@router.get("/get", response_model=CourseUnitResponseSchemaTotal)
def get_course_units(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    course_unit = db.query(CourseUnit).offset(offset).limit(limit).all()

    return {
        "total": len(course_unit),
        "course_unit": course_unit,
    }


@router.get("/get/{course_unit_id}", response_model=CourseUnitResponseSchema)
def get_course_unit(
    course_unit_id: int,
    db: Session = Depends(get_db),
):
    course = db.query(CourseUnit).filter(CourseUnit.id == course_unit_id).first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Unit not found.",
        )

    return course


@router.get("/get/course/{course_id}", response_model=list[CourseUnitResponseSchema])
def get_course_units_by_course_id(
    course_id: int,
    db: Session = Depends(get_db),
):
    course_units = db.query(CourseUnit).filter(CourseUnit.course_id == course_id).all()

    return course_units


@router.post("/create")
def create_course_unit(
    data: CourseUnitCreateSchema,
    db: Session = Depends(get_db),
):
    if data.purpose is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Purpose field is required and cannot be null.",
        )
    if data.course_id is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Course ID field is required and cannot be null.",
        )

    course_unit = CourseUnit(**data.model_dump())

    try:
        db.add(course_unit)
        db.commit()
        db.refresh(course_unit)
        return course_unit
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Something went wrong. Please try again. {str(e)}",
        ) from e


@router.put("/update/{course_unit_id}")
def update_course_unit(
    course_unit_id: int,
    data: CourseUnitCreateSchema,
    db: Session = Depends(get_db),
):
    course_unit = db.query(CourseUnit).filter(CourseUnit.id == course_unit_id).first()
    if not course_unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Unit not found.",
        )

    for key, value in data.model_dump().items():
        if value is not None:
            setattr(course_unit, key, value)

    try:
        db.commit()
        db.refresh(course_unit)
        return course_unit
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e


@router.delete("/delete/{course_unit_id}")
def delete_course_unit(
    course_unit_id: int,
    db: Session = Depends(get_db),
):
    course_unit = db.query(CourseUnit).filter(CourseUnit.id == course_unit_id).first()
    if not course_unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Unit not found.",
        )

    try:
        db.delete(course_unit)
        db.commit()
        return {"message": "Course Unit deleted successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e
