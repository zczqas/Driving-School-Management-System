from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from apps.apis.v1.package.filter_sort import FilterPackage, SortPackage
from apps.config.db.conn import get_db
from apps.core.models.package import (
    Lesson,
    Package,
    PackageCategory,
    PackageLesson,
    UserPackage,
)
from apps.core.models.school_organization import DrivingSchool
from apps.core.schemas.package import (
    PackageCreate,
    PackageFilterSchema,
    PackageResponseSchema,
    PackageResponseSchemaTotal,
)
from apps.decorator.log_decorator import log_activity
from apps.security.auth import jwt_service  # noqa

router = APIRouter(
    prefix="/package",
    tags=["package"],
)


@router.get("/get", response_model=PackageResponseSchemaTotal)
def get_package(
    offset: int = 0,
    limit: int = 10,
    package_filter_params: PackageFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(Package)

    filter_params = {
        "name": package_filter_params.name,
        "category_id": package_filter_params.category_id,
        "price": package_filter_params.price,
        "type": package_filter_params.type,
        "permit": package_filter_params.permit,
        "is_private": package_filter_params.is_private,
    }

    query = FilterPackage().filter_packages(query, **filter_params)
    query = SortPackage().sort_packages(
        query=query, sort=package_filter_params.sort, order=package_filter_params.order
    )

    total_count = query.with_entities(Package.id).count()

    packages = query.offset(offset).limit(limit).all()

    for package in packages:
        package.total_duration = sum([lesson.duration for lesson in package.lessons])

    response = {
        "total_count": total_count,
        "packages": packages,
    }

    return response


@router.get("/get/{package_id}", response_model=PackageResponseSchema)
def get_package_by_id(
    package_id: int,
    db: Session = Depends(get_db),
):
    packages = db.query(Package).filter(Package.id == package_id).first()

    if not packages:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found",
        )

    packages.total_duration = sum([lesson.duration for lesson in packages.lessons])  # type: ignore

    return packages


@log_activity(action="Create Package", description="Create a new package")
@router.post("/post")
def create_package(
    package_data: PackageCreate,
    db: Session = Depends(get_db),
):
    category_exists = None
    lessons = []

    if package_data.category_id:
        category_exists = (
            db.query(PackageCategory)
            .filter(PackageCategory.id == package_data.category_id)
            .first()
        )
        if not category_exists:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Category not found"
            )

    if package_data.lesson_id:
        lessons = db.query(Lesson).filter(Lesson.id.in_(package_data.lesson_id)).all()
        if len(lessons) != len(package_data.lesson_id):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or more lesson not found",
            )

    if package_data.driving_school_id:
        driving_school = (
            db.query(DrivingSchool)
            .filter(DrivingSchool.id == package_data.driving_school_id)
            .first()
        )
        if not driving_school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Driving school not found",
            )

    if package_data.lesson_order:
        if len(package_data.lesson_order) != len(lessons):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Lesson order must be same as lesson count",
            )

    package = Package(
        **package_data.model_dump(exclude=["lesson_id"]), category=category_exists  # type: ignore
    )

    for lesson in lessons:
        package_lessons = PackageLesson(package=package, lesson=lesson)
        db.add(package_lessons)

    try:
        db.add(package)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Package created successfully"}


@router.put("/put/{package_id}")
def update_package(
    package_id: int,
    update_data: PackageCreate,
    db: Session = Depends(get_db),
):
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found",
        )

    try:
        if update_data.name:
            setattr(package, "name", update_data.name)
        if update_data.description:
            setattr(package, "description", update_data.description)
        if update_data.price is not None:
            setattr(package, "price", update_data.price)
        if update_data.category_id:
            setattr(package, "category_id", update_data.category_id)
        if update_data.is_active is not None:
            setattr(package, "is_active", update_data.is_active)
        if update_data.is_private is not None:
            setattr(package, "is_private", update_data.is_private)
        if update_data.permit is not None:
            setattr(package, "permit", update_data.permit)
        if update_data.driving_school_id:
            setattr(package, "driving_school_id", update_data.driving_school_id)
        if update_data.package_type:
            setattr(package, "package_type", update_data.package_type)
        if update_data.lesson_id is not None:
            package.lessons = []
            for lesson_id in update_data.lesson_id:
                lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
                if lesson:
                    package.lessons.append(lesson)
        if update_data.lesson_order:
            setattr(package, "lesson_order", update_data.lesson_order)

        db.add(package)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Package updated successfully"}


@router.delete("/delete/{package_id}")
def delete_package(
    package_id: int,
    db: Session = Depends(get_db),
):
    package = db.query(Package).filter(Package.id == package_id).first()
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Package not found",
        )

    is_assigned = (
        db.query(UserPackage).filter(UserPackage.package_id == package_id).first()
    )
    if is_assigned:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Package is assigned and cannot be deleted",
        )

    try:
        db.delete(package)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Package deleted successfully"}
