from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from apps.apis.v1.certificate.filter_sort import FilterCertificate, SortCertificate
from apps.common.enum import UserCertificateStatusEnum

# from apps.rbac.role_permission_decorator import check_role_permissions
# from apps.security.auth import jwt_service
from apps.config.db.conn import get_db
from apps.core.models.certificate import Certificate
from apps.core.schemas.certificate import (
    BatchIDResponseSchema,
    DMVCertificateCreateSchema,
    DMVCertificateFilterSchema,
    DMVCertificateResponseSchemaTotal,
    DMVCertificateUpdateSchema,
)

router = APIRouter(prefix="/dmv_certificate", tags=["dmv certificate"])


@router.get("/get", response_model=DMVCertificateResponseSchemaTotal)
def get_certificate(
    offset: int = 0,
    limit: int = 10,
    filter_data: DMVCertificateFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(Certificate)

    filter_params = filter_data.model_dump(exclude_none=True)

    query = FilterCertificate().filter_dmv_certificate(query, **filter_params)
    query = SortCertificate().sorting_dmv_certificate(
        query, filter_data.sort, filter_data.order
    )

    total_count = query.with_entities(Certificate.id).count()

    return {
        "total": total_count,
        "dmv_certificates": query.offset(offset).limit(limit).all(),
    }


@router.get("/get/batch", response_model=List[BatchIDResponseSchema])
def get_batches(db: Session = Depends(get_db)):
    certificate_type = (
        db.query(Certificate.certificate_type)
        .with_entities(Certificate.certificate_type)
        .distinct()
        .first()
    )
    batch_ids = [row[0] for row in db.query(Certificate.batch_id).distinct().all()]

    batch_data = []

    for batch_id in batch_ids:
        total = (
            db.query(func.count(Certificate.id))
            .filter(Certificate.batch_id == batch_id)
            .scalar()
        )
        assigned = (
            db.query(func.count(Certificate.id))
            .filter(
                Certificate.batch_id == batch_id,
                Certificate.status == UserCertificateStatusEnum.ASSIGNED,
            )
            .scalar()
        )
        not_assigned = (
            db.query(func.count(Certificate.id))
            .filter(
                Certificate.batch_id == batch_id,
                Certificate.status == UserCertificateStatusEnum.NOT_ASSIGNED,
            )
            .scalar()
        )
        void = (
            db.query(func.count(Certificate.id))
            .filter(
                Certificate.batch_id == batch_id,
                Certificate.status == UserCertificateStatusEnum.VOID,
            )
            .scalar()
        )
        lost = (
            db.query(func.count(Certificate.id))
            .filter(
                Certificate.batch_id == batch_id,
                Certificate.status == UserCertificateStatusEnum.LOST,
            )
            .scalar()
        )

        created_at, updated_at = (
            db.query(func.min(Certificate.created_at), func.max(Certificate.updated_at))
            .filter(Certificate.batch_id == batch_id)
            .one()
        )

        batch_data.append(
            BatchIDResponseSchema(
                batch_id=batch_id,
                certificate_type=certificate_type.certificate_type,  # type: ignore
                created_at=created_at,
                updated_at=updated_at,
                total=total,
                assigned=assigned,
                not_assigned=not_assigned,
                void=void,
                lost=lost,
            )
        )

    return batch_data


# @check_role_permissions(["ADMIN", "CSR"])
@router.post("/post")
def create_certificate(
    dmv_certificate_data: DMVCertificateCreateSchema,
    # current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    if (
        dmv_certificate_data.prefix_text
        or dmv_certificate_data.start_number
        or dmv_certificate_data.end_number
    ) is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide all the required fields ie. prefix_text, start_number, end_number.",
        )

    prefix_text = dmv_certificate_data.prefix_text
    start_number = dmv_certificate_data.start_number
    end_number = dmv_certificate_data.end_number
    batch_id = f"{prefix_text}{start_number}-{end_number}"
    certificate_type = dmv_certificate_data.certificate_type

    try:
        for i in range(start_number, end_number + 1):
            certificate = prefix_text + str(i)
            db.add(
                Certificate(
                    certificate_number=certificate,
                    batch_id=batch_id,
                    certificate_type=certificate_type,
                )
            )
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error {str(e)} occurred while creating certificate.",
        ) from e

    return {"batch_id": batch_id}


# @check_role_permissions(["ADMIN", "CSR"])
@router.put("/update/{id}")
def update_dmv_certificate(
    id: int,
    update_data: DMVCertificateUpdateSchema,
    # current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    cert = db.query(Certificate).filter(Certificate.id == id).first()

    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    try:
        for attr in update_data.model_dump(exclude_none=True):
            if getattr(update_data, attr) is not None:
                setattr(cert, attr, getattr(update_data, attr))
        db.add(cert)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e

    return {"message": "Certificate updated successfully."}


# @check_role_permissions(["ADMIN", "CSR"])
@router.delete("/delete/{id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_certificate(
    id: int,
    # current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    cert = db.query(Certificate).filter(Certificate.id == id).first()

    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    if cert.is_assigned is True:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assigned certificate cannot be deleted.",
        )

    try:
        setattr(cert, "is_active", False)
        setattr(cert, "is_deleted", True)
        setattr(cert, "status", UserCertificateStatusEnum.VOID)
        db.add(cert)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e


# @check_role_permissions(["ADMIN", "CSR"])
@router.delete("/delete/batch/{batch_id}", status_code=status.HTTP_204_NO_CONTENT)
def batch_delete_certificate(
    batch_id: str,
    # current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    cert = db.query(Certificate).filter(Certificate.batch_id == batch_id).all()

    if cert is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Certificate not found",
        )

    if any([c.status != UserCertificateStatusEnum.NOT_ASSIGNED for c in cert]):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete batch with assigned certificates.",
        )

    try:
        for c in cert:
            setattr(c, "is_active", False)
            setattr(c, "is_deleted", True)
            setattr(c, "status", UserCertificateStatusEnum.VOID)
            db.add(c)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        ) from e
