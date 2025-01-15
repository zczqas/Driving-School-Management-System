import os
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from apps.apis.v1.dynamic.blog.file_helper import save_blog_image_files
from apps.config.db.conn import get_db
from apps.core.models.dynamic.blog import Blog, BlogCategory, BlogImage
from apps.core.schemas.dynamic.blog import BlogResponseSchema, BlogResponseSchemaTotal
from apps.security.auth import jwt_service

router = APIRouter(prefix="/blog", tags=["blog"])


@router.get("/get", response_model=BlogResponseSchemaTotal)
def get_blogs(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    """Get all blogs

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        db (Session, optional): Defaults to Depends(get_db).

    Returns:
        list: List of blogs
    """
    blogs = db.query(Blog).offset(offset).limit(limit).all()

    total = db.query(Blog).with_entities(Blog.id).count()

    return {"total": total, "blogs": blogs}


@router.get("/get/{blog_id}", response_model=BlogResponseSchema)
def get_blog_by_id(
    blog_id: int,
    db: Session = Depends(get_db),
):
    """Get blog by id

    Args:
        blog_id (int): Blog id
        db (Session, optional): Defaults to Depends(get_db).

    Raises:
        HTTPException: If blog not found

    Returns:
        BlogResponseSchema: Blog details
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with id {id} not found",
        )

    return blog


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_blog(
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    meta_title: Optional[str] = Form(None),
    meta_description: Optional[str] = Form(None),
    keywords: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    driving_school_id: Optional[int] = Form(None),
    images: List[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Create a new blog

    Args:
        title (Optional[str], optional):
            Title of the blog.
        description (Optional[str], optional):
            Description about the blog.
        content (Optional[str], optional):
            Content of the blog.
        meta_title (Optional[str], optional):
            Meta title for SEO.
        meta_description (Optional[str], optional):
            Meta description for SEO.
        keywords (Optional[str], optional):
            Search keywords for SEO.
        category_id (Optional[int], optional):
            Blog category id.
        driving_school_id (Optional[int], optional):
            Driving school id to which the blog belongs.
        images (List[UploadFile], optional):
            List of images for the blog.
        db (Session, optional):
            Defaults to Depends(get_db).
        current_user (Users, optional):
            Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If category not found
        HTTPException: If error saving blog
        HTTPException: If error saving blog image

    Returns:
        message: Blog created successfully
    """
    if category_id is not None:
        category = db.query(BlogCategory).filter(BlogCategory.id == category_id).first()
        if category is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Category not found",
            )

    db_blog = Blog(
        title=title,
        description=description,
        content=content,
        meta_title=meta_title,
        meta_description=meta_description,
        keywords=keywords,
        category_id=category_id,
        driving_school_id=driving_school_id,
        created_by_id=current_user.id,
    )

    try:
        db.add(db_blog)
        db.commit()
        db.refresh(db_blog)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving blog: {str(e)}",
        ) from e

    if images is not None:
        blog_images = save_blog_image_files(images)
        for image in blog_images:
            try:
                db_image = BlogImage(blog_id=db_blog.id, url=image)
                db.add(db_image)
                db.commit()
                db.refresh(db_image)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error saving blog image: {str(e)}",
                ) from e

    return {"message": "Blog created successfully"}


@router.put("/update/{blog_id}", status_code=status.HTTP_200_OK)
def update_blog(
    blog_id: int,
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    content: Optional[str] = Form(None),
    meta_title: Optional[str] = Form(None),
    meta_description: Optional[str] = Form(None),
    keywords: Optional[str] = Form(None),
    category_id: Optional[int] = Form(None),
    driving_school_id: Optional[int] = Form(None),
    images: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Update blog

    Args:
        blog_id (int): Blog id
        title (Optional[str], optional):
            Title of the blog.
        description (Optional[str], optional):
            Description about the blog.
        content (Optional[str], optional):
            Content of the blog.
        meta_title (Optional[str], optional):
            Meta title for SEO.
        meta_description (Optional[str], optional):
            Meta description for SEO.
        keywords (Optional[str], optional):
            Search keywords for SEO.
        category_id (Optional[int], optional):
            Blog category id.
        driving_school_id (Optional[int], optional):
            Driving school id to which the blog belongs.
        images (List[UploadFile], optional):
            List of images for the blog.
        db (Session, optional):
            Defaults to Depends(get_db).
        current_user (Users, optional):
            Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If blog not found
        HTTPException: If error updating blog
        HTTPException: If error saving blog images

    Returns:
        message: Blog updated successfully
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with id {blog_id} not found",
        )

    for attr, value in {
        "title": title,
        "description": description,
        "content": content,
        "meta_title": meta_title,
        "meta_description": meta_description,
        "keywords": keywords,
        "category_id": category_id,
        "driving_school_id": driving_school_id,
    }.items():
        if value is not None:
            setattr(blog, attr, value)

    blog.updated_by_id = current_user.id  # type: ignore

    try:
        db.add(blog)
        db.commit()
        db.refresh(blog)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating blog: {str(e)}",
        ) from e

    if images is not None:
        try:
            blog_images = save_blog_image_files(images)
            for image in blog_images:
                db_image = BlogImage(blog_id=blog.id, url=image)
                db.add(db_image)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error saving blog images: {str(e)}",
            ) from e

    return {"message": "Blog updated successfully"}


@router.delete("/delete/{blog_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_blog(
    blog_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    """Delete blog

    Args:
        blog_id (int): Blog id
        db (Session, optional): Defaults to Depends(get_db).
        current_user (Users, optional):
            Currently logged in user.
            Defaults to Depends(jwt_service.get_current_user).

    Raises:
        HTTPException: If blog not found
        HTTPException: If error deleting blog or images
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Blog with id {blog_id} not found",
        )

    blog_images = db.query(BlogImage).filter(BlogImage.blog_id == blog_id).all()
    try:
        for image in blog_images:
            db.delete(image)
            os.remove(image.url)  # type: ignore
        db.delete(blog)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting blog or images: {str(e)}",
        ) from e
