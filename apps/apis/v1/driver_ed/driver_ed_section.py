from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from sqlalchemy.exc import NoResultFound

from apps.core.models.driver_ed import (
    DriverEdLesson,
    DriverEdLessonLog,
    DriverEdSection,
)
from apps.core.schemas.driver_ed.driver_ed_section import (
    DriverEdSectionGetSchema,
)

from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_section", tags=["driver_ed_section"])


# @router.get("/get", response_model=list[DriverEdSectionResponseSchema])
# def get_driver_ed_sections(
#     offset: int = 0,
#     limit: int = 10,
#     current_user=Depends(jwt_service.get_current_user),
#     db: Session = Depends(get_db),
# ):
#     sections = db.query(DriverEdSection).limit(limit).offset(offset).all()
#     return sections


# @router.get("/get", response_model=list[DriverEdSectionResponseSchema])
@router.get("/get")
def get_driver_ed_sectiond_by_filter(
    get_driver_ed_section: DriverEdSectionGetSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    section = (
        db.query(DriverEdSection)
        .filter(
            DriverEdSection.unit_id == get_driver_ed_section.unit_id,
            DriverEdSection.lesson_id == get_driver_ed_section.lesson_id,
        )
        .all()
    )
    if not section:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    lesson = (
        db.query(DriverEdLesson)
        .filter(
            DriverEdLesson.unit_id == get_driver_ed_section.unit_id,
            DriverEdLesson.id == get_driver_ed_section.lesson_id
        )
        .first()
    )
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )

    try:
        existing_log = (
            db.query(DriverEdLessonLog)
            .filter(
                DriverEdLessonLog.lesson_id == lesson.id,
                DriverEdLessonLog.unit_id == get_driver_ed_section.unit_id,
                DriverEdLessonLog.user_id == current_user.id,
            )
            .first()
        )

        if existing_log:
            existing_log.is_passed = True
            existing_log.lesson_ed_id = lesson.ed_id
            existing_log.unit_id = get_driver_ed_section.unit_id
            db.add(existing_log)
        else:
            lesson_log = DriverEdLessonLog(
                lesson_id=lesson.id,
                lesson_ed_id=lesson.ed_id,
                unit_id=get_driver_ed_section.unit_id,
                user_id=current_user.id,
                is_passed=True,
            )
            db.add(lesson_log)

        db.commit()
    except NoResultFound:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error creating lesson log: {str(e)}",
        )

    return {
        "count": len(section),
        "unit": {
            "id": section[0].unit.id,
            "title": section[0].unit.title,
            "purpose": section[0].unit.purpose,
            "lessons": sorted(
                [
                    {
                        "id": lesson.id,
                        "title": lesson.title,
                    }
                    for lesson in section[0].unit.lessons
                ],
                key=lambda x: x["id"],
            ),
        },
        "data": [
            {
                "id": s.id,
                "title": s.title,
                "text": s.text,
                "reference": s.reference,
                "section_id_1": s.section_id_1,
                "section_id_2": s.section_id_2,
                "unit_id": s.unit_id,
                "lesson_id": s.lesson_id,
            }
            for s in section
        ],
    }


@router.post("/create")
def create_driver_ed_section(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": "Driver ed section created"}


@router.put("/update/{unit_id}")
def update_driver_ed_section(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": f"Update driver ed section {unit_id}"}


@router.delete("/delete/{unit_id}")
def delete_driver_ed_section(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):

    return {"message": f"Delete driver ed section {unit_id}"}
