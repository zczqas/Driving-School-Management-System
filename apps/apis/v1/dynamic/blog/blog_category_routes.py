from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.dynamic.blog import BlogCategory
from apps.core.schemas.dynamic.blog import (
    BlogCategoryCreateSchema,
    BlogCategoryResponseSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/blog/category", tags=["blog category"])


@router.get("/get", response_model=list[BlogCategoryResponseSchema])
def get_blog_categories(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """Get all blog categories

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        db (Session, optional): Defaults to Depends(get_db).

    Returns:
        list: List of blog categories
    """
    blog_categories = db.query(BlogCategory).offset(offset).limit(limit).all()

    return blog_categories


@router.get("/get/{blog_cat_id}", response_model=BlogCategoryResponseSchema)
def get_blog_category_by_id(
    blog_cat_id: int,
    db: Session = Depends(get_db),
):
    """Get blog category by id

    Args:
        blog_cat_id (int): Blog category id
        db (Session, optional): Defaults to Depends(get_db).

    Raises:
        HTTPException: If blog category not found

    Returns:
        BlogCategoryResponseSchema: Blog category details
    """
    blog_category = (
        db.query(BlogCategory).filter(BlogCategory.id == blog_cat_id).first()
    )
    if blog_category is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog category with id {id} not found",
        )

    return blog_category


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_blog_category(
    cat: BlogCategoryCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Create a new blog category

    Args:
        cat (BlogCategoryCreateSchema):
            Pydantic model for blog category
        db (Session, optional):
            Defaults to Depends(get_db).
        current_user (Users, optional):
            Current user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If error saving blog category

    Returns:
        message: Blog category created successfully
    """
    db_cat = BlogCategory(**cat.model_dump(exclude_unset=True))

    try:
        db.add(db_cat)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving blog category: {str(e)}",
        ) from e

    return {"message": "Blog category created successfully"}


@router.put("/update/{blog_cat_id}")
def update_blog_category(
    blog_cat_id: int,
    cat: BlogCategoryCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Update blog category

    Args:
        blog_cat_id (int): Blog category id
        cat (BlogCategoryCreateSchema):
            Pydantic model for blog category
        db (Session, optional):
            Defaults to Depends(get_db).
        current_user (Users, optional):
            Current user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If blog category not found
        HTTPException: If error updating blog category

    Returns:
        message: Blog category updated successfully
    """
    db_cat = db.query(BlogCategory).filter(BlogCategory.id == blog_cat_id).first()
    if db_cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog category with id {id} not found",
        )

    for key, value in cat.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(db_cat, key, value)

    try:
        db.add(db_cat)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating blog category: {str(e)}",
        ) from e

    return {"message": "Blog category updated successfully"}


@router.delete("/delete/{blog_cat_id}")
def delete_blog_category(
    blog_cat_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Delete blog category

    Args:
        blog_cat_id (int): Blog category id
        db (Session, optional): Defaults to Depends(get_db).
        current_user (Users, optional):
            Current user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If blog category not found
        HTTPException: If error deleting blog category

    Returns:
        message: Blog category deleted successfully
    """
    db_cat = db.query(BlogCategory).filter(BlogCategory.id == blog_cat_id).first()
    if db_cat is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog category with id {id} not found",
        )

    try:
        db.delete(db_cat)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting blog category: {str(e)}",
        ) from e

    return {"message": "Blog category deleted successfully"}
