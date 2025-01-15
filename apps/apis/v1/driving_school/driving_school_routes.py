from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from apps.apis.v1.driving_school import logo_file_helper
from apps.apis.v1.driving_school.constant import UPDATE_FIELDS, URL_FIELDS
from apps.apis.v1.driving_school.mixins import (
    check_existence_and_raise,
    get_or_create_urls,
    is_valid_domain,
)
from apps.config.db.conn import get_db
from apps.core.models.school_organization import DrivingSchool, URLs
from apps.core.schemas.driving_school import (
    DrivingSchoolCreateSchema,
    DrivingSchoolResponseSchema,
    DrivingSchoolUpdateSchema,
)

router = APIRouter(prefix="/driving-school", tags=["driving school"])


@router.get("/get", response_model=List[DrivingSchoolResponseSchema])
def get_driving_school(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    driving_school = db.query(DrivingSchool).offset(offset).limit(limit).all()

    return driving_school


@router.get("/get/{id}", response_model=DrivingSchoolResponseSchema)
def get_driving_school_by_id(
    id: int,
    db: Session = Depends(get_db),
):
    driving_school = db.query(DrivingSchool).filter(DrivingSchool.id == id).first()
    if driving_school is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving school with id {id} not found",
        )

    return driving_school


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_driving_school(
    driving_school: DrivingSchoolCreateSchema,
    db: Session = Depends(get_db),
):
    if driving_school.domain is not None:
        if not is_valid_domain(driving_school.domain):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid domain",
            )
        check_existence_and_raise(
            db, DrivingSchool, DrivingSchool.domain, driving_school.domain, "Domain"
        )

    new_driving_school = DrivingSchool(
        **driving_school.model_dump(exclude_unset=True, exclude=set(URL_FIELDS))
    )

    try:
        db.add(new_driving_school)
        db.commit()
        db.refresh(new_driving_school)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while creating driving school: {e}",
        ) from e

    try:
        driving_school_urls = URLs(
            **driving_school.model_dump(exclude_unset=True, include=set(URL_FIELDS))
        )

        db.add(driving_school_urls)
        db.commit()
        db.refresh(driving_school_urls)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while creating driving school urls: {e}",
        ) from e

    try:
        new_driving_school.driving_school_urls_id = driving_school_urls.id
        db.add(new_driving_school)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while updating driving school with urls: {e}",
        ) from e

    return {"message": "Driving school created successfully"}


@router.put("/update/{id}")
def update_driving_school(
    id: int,
    driving_school_update_data: DrivingSchoolUpdateSchema,
    db: Session = Depends(get_db),
):
    driving_school = db.query(DrivingSchool).filter(DrivingSchool.id == id).first()
    if not driving_school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving school with id {id} not found",
        )

    driving_school_urls = get_or_create_urls(db, driving_school)

    for field in UPDATE_FIELDS:
        if getattr(driving_school_update_data, field) is not None:
            setattr(driving_school, field, getattr(driving_school_update_data, field))

    if driving_school_update_data.domain:
        if not is_valid_domain(driving_school_update_data.domain):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid domain",
            )
        check_existence_and_raise(
            db, DrivingSchool, DrivingSchool.domain, driving_school.domain, "Domain"
        )
        driving_school.domain = driving_school_update_data.domain  # type: ignore

    for field in URL_FIELDS:
        if getattr(driving_school_update_data, field) is not None:
            setattr(
                driving_school_urls, field, getattr(driving_school_update_data, field)
            )

    try:
        db.add(driving_school)
        db.add(driving_school_urls)
        db.commit()
        db.refresh(driving_school)
        db.refresh(driving_school_urls)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while updating driving school: {e}",
        ) from e

    return {"message": "Driving school updated successfully"}


@router.patch("/update/logo/{driving_school_id}")
def update_driving_school_logo(
    driving_school_id: int,
    logo: UploadFile = File(None),
    logo_dark: UploadFile = File(None),
    hero_image: UploadFile = File(None),
    db: Session = Depends(get_db),
):
    driving_school = (
        db.query(DrivingSchool).filter(DrivingSchool.id == driving_school_id).first()
    )
    if driving_school is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving school with id {driving_school_id} not found",
        )

    driving_school_urls = get_or_create_urls(db, driving_school)

    if logo is not None:
        try:
            logo_url = logo_file_helper.save_logo_file(logo)
            driving_school_urls.logo_url = logo_url  # type: ignore
        except HTTPException as e:
            raise e

    if logo_dark is not None:
        try:
            logo_url_dark = logo_file_helper.save_logo_file(logo_dark)
            driving_school_urls.logo_url_dark = logo_url_dark  # type: ignore
        except HTTPException as e:
            raise e

    if hero_image is not None:
        try:
            hero_image_url = logo_file_helper.save_hero_file(hero_image)
            driving_school_urls.hero_image_url = hero_image_url  # type: ignore
        except HTTPException as e:
            raise e

    try:
        db.add(driving_school_urls)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while updating driving school logo: {e}",
        ) from e

    return {"message": "Driving school logo updated successfully"}


@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_driving_school(
    id: int,
    db: Session = Depends(get_db),
):
    driving_school = db.query(DrivingSchool).filter(DrivingSchool.id == id).first()
    if not driving_school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving school with id {id} not found",
        )

    driving_school_urls = (
        db.query(URLs).filter(URLs.id == driving_school.driving_schools_urls_id).first()  # type: ignore
    )
    if not driving_school_urls:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving school urls with id {driving_school.driving_schools_urls_id} not found",  # type: ignore
        )

    try:
        db.delete(driving_school)
        db.delete(driving_school_urls)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error occurred while deleting driving school: {e}",
        ) from e

    return {"message": "Driving school deleted successfully"}
