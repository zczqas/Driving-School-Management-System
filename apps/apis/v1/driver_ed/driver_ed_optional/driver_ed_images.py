import os
import uuid
from fastapi import APIRouter, File, HTTPException, UploadFile, status, Depends
from sqlalchemy.orm import Session

from apps.config.settings import MEDIA_PATH
from apps.core.models.driver_ed_images import DriverEdImages, DriverEdImagesSection
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_images", tags=["driver_ed_images"])


@router.get("/get/sections")
def get_images_sections(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    sections = db.query(DriverEdImagesSection).all()

    if not sections:
        return {}

    return {
        "count": len(sections),
        "sections": [
            {
                "id": section.id,
                "title": section.title,
                "name": section.name,
            }
            for section in sections
        ],
    }


@router.get("/get/images/{session_id}")
def get_images(
    session_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    section = db.query(DriverEdImagesSection).filter_by(id=session_id).first()

    if not section:
        return {}

    return {
        "id": section.id,
        "title": section.title,
        "name": section.name,
        "images": [
            {
                "id": image.id,
                "name": image.name,
                "url": image.url,
            }
            for image in section.images
        ],
    }


@router.post("/add/{section_id}")
def add_driver_ed_images(
    section_id: int,
    name: str,
    image: UploadFile = File(None),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    section = db.query(DriverEdImagesSection).filter_by(id=section_id).first()
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Section not found",
        )

    if image.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="image must be a jpeg or png format",
        )

    if image.file.__sizeof__() > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size should not exceed 5MB",
        )

    try:
        image.filename = (
            f"{MEDIA_PATH}/driver_ed_images/{uuid.uuid4()}_{image.filename}"
        )

        with open(image.filename, "wb") as file:
            file.write(image.file.read())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving image: {str(e)}",
        ) from e

    try:
        db_image = DriverEdImages(url=image.filename, section_id=section_id, name=name)
        db.add(db_image)
        db.commit()
        db.refresh(db_image)
    except Exception as e:
        db.rollback()
        try:
            os.remove(image.filename)
        except Exception:
            pass
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving image: {str(e)}",
        ) from e

    return {
        "id": db_image.id,
        "name": db_image.name,
        "url": db_image.url,
    }
