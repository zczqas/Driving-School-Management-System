from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.certificate.filter_sort import FilterCertificate, SortCertificate
from apps.common.enum import UserCertificateStatusEnum
from apps.config.db.conn import get_db
from apps.core.models.certificate import UserCertificate
from apps.core.models.users import Profile
from apps.core.schemas.certificate import (
    UserCertificateFilterSchema,
    UserCertificateResponseSchema,
    UserCertificateResponseSchemaTotal,
    UserCertificateUpdateSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service

router = APIRouter(prefix="/user_certificate", tags=["user certificate"])


@router.get("/get", response_model=UserCertificateResponseSchemaTotal)
def get_user_certificate(
    offset: int = 0,
    limit: int = 10,
    filter_data: UserCertificateFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(UserCertificate).filter(
        UserCertificate.is_deleted == False  # noqa
    )

    filter_params = filter_data.model_dump(exclude_none=True)

    query = FilterCertificate().filter_user_certificate(query, **filter_params)
    query = SortCertificate().sorting_user_certificate(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(UserCertificate.id).count()

    return {
        "total": total,
        "user_certificates": query.offset(offset).limit(limit).all(),
    }


@router.get("/get/{cert_id}", response_model=UserCertificateResponseSchema)
def get_user_certificate_by_id(
    cert_id: int,
    db: Session = Depends(get_db),
):
    cert = db.query(UserCertificate).filter(UserCertificate.id == cert_id).first()

    return cert


@router.get("/get/user/{user_id}", response_model=UserCertificateResponseSchemaTotal)
def get_user_certificate_by_user_id(
    user_id: int,
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    certificate = (
        db.query(UserCertificate)
        .filter(UserCertificate.user_profiles_id == user_id)
        .offset(offset)
        .limit(limit)
        .all()
    )

    total = len(certificate)

    return {
        "total": total,
        "user_certificates": certificate,
    }


@check_role_permissions(["ADMIN", "CSR"])
@router.put("/update/{id}")
def update_user_certificate(
    id: int,
    update_data: UserCertificateUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    cert = db.query(UserCertificate).filter(UserCertificate.id == id).first()
    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    try:
        if update_data.issue is True:
            setattr(cert, "status", UserCertificateStatusEnum.ISSUED)
            setattr(cert, "issued_date", datetime.now())

        if update_data.status is not None:
            setattr(cert, "status", update_data.status)

        if update_data.instructor_id is not None:
            profile = (
                db.query(Profile)
                .filter(Profile.id == update_data.instructor_id)
                .first()
            )
            if profile is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Instructor not found",
                )
            setattr(cert, "instructor_id", update_data.instructor_id)

        db.add(cert)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e

    return {"message": "Certificate updated successfully"}


# @check_role_permissions(["ADMIN", "CSR"])
@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_certificate(
    id: int,
    # current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    cert = db.query(UserCertificate).filter(UserCertificate.id == id).first()

    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    try:
        setattr(cert, "is_deleted", True)
        db.add(cert)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting certificate: {str(e)}",
        ) from e
