from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.pickup_location import PickupLocationType
from apps.core.schemas.pickup_location import (
    PickupLocationTypeCreateSchema,
    PickupLocationTypeResponseSchema,
    PickupLocationTypeResponseSchemaTotal,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/pickup_location_type", tags=["pickup location type"])
"""
This is being used as dmv routes in frontend
Watchout for unforeseen bugs if changed
"""


@router.get("/get", response_model=PickupLocationTypeResponseSchemaTotal)
def get_pickup_location_types(
    db: Session = Depends(get_db),
):
    pickup_location_type = (
        db.query(PickupLocationType).order_by(PickupLocationType.id).all()
    )
    total = len(pickup_location_type)

    return {"total": total, "pickup_location_types": pickup_location_type}


@router.get(
    "/get/{pickup_location_type_id}", response_model=PickupLocationTypeResponseSchema
)
def get_pickup_location_type_by_id(
    pickup_location_type_id: int, db: Session = Depends(get_db)
):
    pickup_location_type = (
        db.query(PickupLocationType)
        .filter(PickupLocationType.id == pickup_location_type_id)
        .first()
    )
    if not pickup_location_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup location type not found of id {pickup_location_type_id}",
        )

    return pickup_location_type


@router.post("/post")
def create_pickup_location_type(
    pickup_location_type_data: PickupLocationTypeCreateSchema,
    current_user: int = Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    db_item_data = PickupLocationType(**pickup_location_type_data.model_dump())

    try:
        db.add(db_item_data)
        db.commit()
        db.refresh(db_item_data)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {
        "message": "pickup location type created successfully",
        "data": db_item_data,
    }


@router.put("/put/{pickup_location_type_id}")
def update_pickup_location_type(
    pickup_location_type_id: int,
    update_pickup_location_type_data: PickupLocationTypeCreateSchema,
    db: Session = Depends(get_db),
):
    pickup_location_type = db.query(PickupLocationType).get(pickup_location_type_id)
    if not pickup_location_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup location type of id {pickup_location_type_id} not found",
        )

    updated_data = PickupLocationType(
        **update_pickup_location_type_data.model_dump(exclude_unset=True)
    )

    try:
        if updated_data.name is not None:
            pickup_location_type.name = updated_data.name
        if updated_data.description is not None:
            pickup_location_type.description = updated_data.description

        db.add(pickup_location_type)
        db.commit()

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating pickuplocation type: {str(e)}",
        ) from e

    return {"message": "Pickup location type updated successfully"}


@router.delete(
    "/delete/{pickup_location_type_id}", status_code=status.HTTP_204_NO_CONTENT
)
def delete_pickup_location_type(
    pickup_location_type_id: int,
    db: Session = Depends(get_db),
):
    pickup_location_type = db.query(PickupLocationType).get(pickup_location_type_id)
    if not pickup_location_type:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pickup location type of id {pickup_location_type_id} not found",
        )

    try:
        db.delete(pickup_location_type)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting pickup location type: {str(e)}",
        ) from e
