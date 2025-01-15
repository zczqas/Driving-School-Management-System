from typing import List

from fastapi import APIRouter, Depends, Form, HTTPException, status
from sqlalchemy.orm import Session, joinedload

from apps.config.db.conn import get_db
from apps.core.models.package import Package, PackageCategory
from apps.core.schemas.package import (
    PackageCategoryCreate,
    PackageCategoryResponseCategorySchema,
)

router = APIRouter(
    prefix="/package_category",
    tags=["package_category"],
)


@router.post("/post")
def create_package_category(
    category_data: PackageCategoryCreate,
    db: Session = Depends(get_db),
):
    category = PackageCategory(**category_data.model_dump())

    try:
        db.add(category)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Category created successfully"}


@router.get("/get/{category_id}")
def get_category_by_id(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(PackageCategory).filter(PackageCategory.id == category_id).first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return category


@router.get("/get", response_model=List[PackageCategoryResponseCategorySchema])
def get_categories(
    db: Session = Depends(get_db),
):
    categories = (
        db.query(PackageCategory)
        .options(joinedload(PackageCategory.packages).joinedload(Package.lessons))  # type: ignore
        .all()
    )

    for category in categories:
        for package in category.packages:  # type: ignore
            package.total_duration = sum(
                [lesson.duration for lesson in package.lessons]
            )

    return categories


@router.put("/update/{category_id}")
def update_category(
    category_id: int,
    name: str = Form(None),
    description: str = Form(None),
    db: Session = Depends(get_db),
):
    category = (
        db.query(PackageCategory).filter(PackageCategory.id == category_id).first()
    )
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    try:
        if name:
            setattr(category, "name", name)
        if description:
            setattr(category, "description", description)

        db.add(category)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Category updated successfully"}


@router.delete("/delete/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(PackageCategory).filter(PackageCategory.id == category_id).first()
    )

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    package = db.query(Package).filter(Package.category_id == category_id).first()

    if package:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category is associated with package",
        )

    try:
        db.delete(category)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"{str(e)}",
        ) from e

    return {"message": "Category deleted successfully"}
