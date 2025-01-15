from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.package.filter_sort import FilterPackage, SortPackage
from apps.config.db.conn import get_db
from apps.core.models.package import Lesson
from apps.core.schemas.lesson import (
    LessonCreateSchema,
    LessonFilterSchema,
    LessonResponseSchema,
    LessonResponseSchemaTotal,
    LessonUpdateSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions  # noqa
from apps.security.auth import jwt_service

router = APIRouter(
    prefix="/lesson",
    tags=["lesson"],
)


@router.get("/get", response_model=LessonResponseSchemaTotal)
def get_lesson(
    offset: int = 0,
    limit: int = 10,
    lesson_filter: LessonFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    lessons = db.query(Lesson)

    lesson_filter_params = {
        "lesson_no": lesson_filter.lesson_no,
        "name": lesson_filter.name,
        "description": lesson_filter.description,
        "duration": lesson_filter.duration,
        "is_active": lesson_filter.is_active,
        "is_online": lesson_filter.is_online,
        "price": lesson_filter.price,
    }

    query = FilterPackage().filter_lessons(lessons, **lesson_filter_params)
    query = SortPackage().sort_lessons(
        query=query, sort=lesson_filter.sort, order=lesson_filter.order
    )

    total = query.with_entities(Lesson.id).count()

    response = {
        "total": total,
        "lessons": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{lesson_id}", response_model=LessonResponseSchema)
def get_lesson_by_id(
    lesson_id: int,
    db: Session = Depends(get_db),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    return lesson


@router.post("/create")
# @check_role_permissions(["ADMIN", "SUPER_ADMIN"])
def create_lesson(
    lesson_data: LessonCreateSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lesson_exists = db.query(Lesson).filter(Lesson.name == lesson_data.name).first()
    if lesson_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Lesson already exists",
        )

    if lesson_data.lesson_no is not None:
        if db.query(Lesson).filter(Lesson.lesson_no == lesson_data.lesson_no).first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson number already exists",
            )

    lesson = Lesson(**lesson_data.model_dump())

    try:
        db.add(lesson)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Lesson created successfully"}


@router.put("/update/{lesson_id}")
# @check_role_permissions(["ADMIN", "SUPER_ADMIN", "CSR"])
def update_lesson(
    lesson_id: int,
    lesson_update_data: LessonUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    if lesson_update_data.lesson_no is not None:
        if (
            db.query(Lesson)
            .filter(Lesson.lesson_no == lesson_update_data.lesson_no)
            .first()
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson number already exists",
            )

    for key, value in lesson_update_data.model_dump().items():
        if value is None:
            continue
        setattr(lesson, key, value)

    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Lesson updated successfully"}


@router.delete("/delete/{lesson_id}")
# @check_role_permissions(["ADMIN", "SUPER_ADMIN", "CSR"])
def delete_lesson(
    lesson_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    try:
        db.delete(lesson)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Lesson deleted successfully"}
