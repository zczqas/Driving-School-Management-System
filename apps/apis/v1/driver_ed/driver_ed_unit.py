from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from apps.common.enum import DriverEdStatusRemarksEnum
from apps.core.models.driver_ed import DriverEdUnits
from apps.core.models.driver_ed_log import DriverEdLog
from apps.core.schemas.driver_ed.driver_ed_unit import (
    DriverEdUnitCreateSchema,
    DriverEdUnitResponseSchema,
    DriverEdUnitResponseSchemaTotal,
    DriverEdUnitUpdateSchema,
)

from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_unit", tags=["driver_ed_unit"])


# @router.get("/get", response_model=DriverEdUnitResponseSchemaTotal)
@router.get("/get")
def get_driver_ed_units(
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    units = db.query(DriverEdUnits).limit(limit).offset(offset).all()
    total = len(units)

    quiz_log = (
        db.query(DriverEdLog)
        .filter(
            DriverEdLog.user_id == current_user.id,
            DriverEdLog.remarks == DriverEdStatusRemarksEnum.PASS,
        )
        .all()
    )

    return {
        "total": total,
        "units": [
            {
                "id": unit.id,
                "title": unit.title,
                "purpose": unit.purpose,
                "is_passed": any(log.unit_id == unit.id for log in quiz_log),
            }
            for unit in units
        ],
    }


@router.get("/get/{unit_id}", response_model=DriverEdUnitResponseSchema)
def get_driver_ed_units_by_unit_id(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    units = db.query(DriverEdUnits).filter(DriverEdUnits.id == unit_id).first()
    if not units:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found",
        )

    return {"unit": units}


@router.post("/create")
def create_driver_ed_unit(
    driver_ed_unit: DriverEdUnitCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    new_unit = DriverEdUnits(**driver_ed_unit.model_dump())

    try:
        db.add(new_unit)
        db.commit()
        db.refresh(new_unit)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

    return {"message": "Driver ed unit created"}


@router.put("/update/{unit_id}")
def update_driver_ed_unit(
    unit_id: int,
    driver_ed_unit: DriverEdUnitUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    unit = db.query(DriverEdUnits).filter(DriverEdUnits.id == unit_id).first()
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found",
        )

    try:
        for key, value in driver_ed_unit.model_dump().items():
            if value is None:
                setattr(unit, key, value)
        db.add(unit)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

    return {"message": f"Update driver ed unit {unit_id}"}


@router.delete("/delete/{unit_id}")
def delete_driver_ed_unit(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    unit = db.query(DriverEdUnits).filter(DriverEdUnits.id == unit_id).first()
    if not unit:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found",
        )

    try:
        db.delete(unit)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e),
        )

    return {"message": f"Delete driver ed unit {unit_id}"}
