from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import date
from apps.apis.v1.cert.filter_sort import FilterCert, SortCert

# from apps.rbac.role_permission_decorator import check_role_permissions
# from apps.security.auth import jwt_service
from apps.common.enum import RoleEnum
from apps.core.models.users import Profile
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db
from apps.core.models.cert import Cert
from apps.core.schemas.cert import (
    CertResponseSchema,
    CertCreateSchema,
    CertUpdateSchema,
    CertFilterSchema,
    CreateResponseSchemaTotal,
)
from apps.apis.v1.cert.cert_mixins import CertMixins

router = APIRouter(prefix="/cert", tags=["cert"])


@router.get("/get", response_model=CreateResponseSchemaTotal)
def get_cert(
    offset: int = 0,
    limit: int = 10,
    filter_params: CertFilterSchema = Depends(),
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    query = db.query(Cert)
    params = filter_params.model_dump(exclude_unset=True)
    if current_user.role == RoleEnum.INSTRUCTOR:
        query = query.filter(Cert.instructor_id == current_user.profile.id)
    query = FilterCert().filter_cert(query, **params)
    query = SortCert().sorting_cert(
        query=query, sort=filter_params.sort, order=filter_params.order
    )

    total_count = query.with_entities(Cert.id).count()

    return {
        "total": total_count,
        "certs": query.offset(offset).limit(limit).all(),
    }


@router.get("/get/{cert_id}", response_model=CertResponseSchema)
def get_cert_by_id(
    cert_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    cert = db.query(Cert).filter(Cert.id == cert_id).first()
    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )
    return cert


@router.post("/create")
def create_cert(
    cert: CertCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    user = db.query(Profile).filter(Profile.user_id == cert.user_profiles_id).first()
    instructor = db.query(Profile).filter(Profile.user_id == cert.instructor_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Instructor not found",
        )
    CertMixins.create_cert(db, cert)
    return {"message": "Certificate created successfully"}


@router.put("/update/{cert_id}")
def update_cert(
    cert_id: int,
    cert_update: CertUpdateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    existing_cert = db.query(Cert).filter(Cert.id == cert_id).first()
    if not existing_cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )
    instructor = None
    if cert_update.instructor_id is not None:
        instructor = (
            db.query(Profile)
            .filter(Profile.user_id == cert_update.instructor_id)
            .first()
        )
        if not instructor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Instructor not found",
            )

    try:
        update_data = cert_update.model_dump(exclude_unset=True)
        if update_data.get("status") == "ISSUED" and existing_cert.status != "ISSUED":
            update_data["issued_date"] = date.today()
        if instructor:
            update_data["instructor_id"] = instructor.id
        for key, value in update_data.items():
            if value is not None:
                setattr(existing_cert, key, value)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}"
        ) from e
    return {"message": "Certificate updated successfully"}


@router.delete("/delete/{cert_id}")
def delete_cert(
    cert_id: int,
    db: Session = Depends(get_db),
):
    cert = db.query(Cert).filter(Cert.id == cert_id).first()

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )
    try:
        db.delete(cert)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}"
        ) from e
    return {"message": "Certificate deleted successfully"}
