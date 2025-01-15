from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session


from apps.core.models.driver_ed_video import (
    DriverEdOptionalVideoSection,
)
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(
    prefix="/driver_ed_optional_video", tags=["driver_ed_optional_video"]
)


@router.get("/get")
def get_driver_ed_optional_videos(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    sections = db.query(DriverEdOptionalVideoSection).all()
    if not sections:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No videos found",
        )

    return {
        "count": len(sections),
        "sections": [
            {
                "id": section.id,
                "title": section.title,
                "videos": [
                    {
                        "id": video.id,
                        "title": video.title,
                        "url": video.url,
                    }
                    for video in section.videos
                ],
            }
            for section in sections
        ],
    }
