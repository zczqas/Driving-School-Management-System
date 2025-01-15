from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db


from apps.core.models.dmv import DMV
from apps.core.schemas.dmv import (
    DMVCreateSchema,
    DMVResponseSchema,
    DMVResponseSchemaTotal,
    DMVUpdateSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service


router = APIRouter(prefix="/dmv", tags=["DMV"])


@router.get("/get", response_model=DMVResponseSchemaTotal)
def get_dmv(db: Session = Depends(get_db)):
    """Get all DMV records"""
    dmv = db.query(DMV).all()
    total = len(dmv)
    return {"total": total, "data": dmv}


@router.get("/get/{dmv_id}", response_model=DMVResponseSchema)
def get_dmv_by_id(dmv_id: int, db: Session = Depends(get_db)):
    """Get DMV by ID"""
    dmv = db.query(DMV).filter(DMV.id == dmv_id).first()
    if dmv is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="DMV not found"
        )

    return dmv


@router.post("/create", status_code=status.HTTP_201_CREATED)
@check_role_permissions(["ADMIN"])
def create_dmv(
    data: DMVCreateSchema,
    current_user=jwt_service.get_current_user,
    db: Session = Depends(get_db),
):
    """Create DMV"""
    dmv = DMV(**data.model_dump(exclude_unset=True))
    try:
        db.add(dmv)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to create DMV with error: {e}",
        ) from e


@router.put("/update/{dmv_id}")
@check_role_permissions(["ADMIN"])
def update_dmv(dmv_id: int, data: DMVUpdateSchema, db: Session = Depends(get_db)):
    """Update DMV"""
    dmv = db.query(DMV).filter(DMV.id == dmv_id).first()
    if not dmv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="DMV not found"
        )

    try:
        for key, value in data.model_dump(exclude_unset=True).items():
            if getattr(dmv, key) is not None:
                setattr(dmv, key, value)
        db.add(dmv)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"failed to update DMV with error: {e}",
        ) from e

    return {"message": "DMV updated successfully"}


@router.delete("/delete/{dmv_id}", status_code=status.HTTP_204_NO_CONTENT)
@check_role_permissions(["ADMIN"])
def delete_dmv(
    dmv_id: int,
    current_user=jwt_service.get_current_user,
    db: Session = Depends(get_db),
):
    """Delete DMV"""
    dmv = db.query(DMV).filter(DMV.id == dmv_id).first()
    if not dmv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="DMV not found"
        )

    try:
        db.delete(dmv)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"failed to delete DMV with error: {e}",
        ) from e
