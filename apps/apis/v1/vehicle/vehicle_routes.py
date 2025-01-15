from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from apps.apis.v1.vehicle.filter_sort import FilterVehicle, SortVehicle
from apps.config.db.conn import get_db
from apps.core.schemas.vehicle import (
    VehicleCreateSchema,
    VehicleResponseSchema,
    VehicleResponseSchemaTotal,
    VehicleUpdateSchema,
    VehicleFilterSchema,
)
from apps.security.auth import jwt_service

from apps.core.models.vehicle import Vehicle

router = APIRouter(prefix="/vehicle", tags=["vehicle"])


@router.get("/get", response_model=VehicleResponseSchemaTotal)
def get_vehicle(
    offset: int = 0,
    limit: int = 10,
    filter_data: VehicleFilterSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(Vehicle)

    filter_params = {
        "plate_number": filter_data.plate_number,
        "color": filter_data.color,
        "brand": filter_data.brand,
        "model": filter_data.model,
        "year": filter_data.year,
        "is_available": filter_data.is_available,
    }

    query = FilterVehicle().filter_vehicles(query, **filter_params)
    query = SortVehicle().sorting_vehicles(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(Vehicle.id).count()
    vehicles = query.limit(limit).offset(offset).all()

    return {"total": total, "vehicle": vehicles}


@router.get("/get/{pk}", response_model=VehicleResponseSchema)
def get_vehicle_by_id(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == pk).first()

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Vehicle not found"
        )

    return vehicle


@router.post("/create")
def create_vehicle(
    vehicle_data: VehicleCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    vehicle_exists = (
        db.query(Vehicle)
        .filter(Vehicle.plate_number == vehicle_data.plate_number)
        .first()
    )

    if vehicle_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle already exists"
        )

    try:
        vehicle_dict = vehicle_data.model_dump()
        db_vehicle = Vehicle(**vehicle_dict)
        db.add(db_vehicle)
        db.commit()
        db.refresh(db_vehicle)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return db_vehicle


@router.put("/update/{pk}")
def update_vehicle(
    pk: int,
    vehicle_data: VehicleUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    vehicle_exists = db.query(Vehicle).filter(Vehicle.id == pk).first()

    if not vehicle_exists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle not found"
        )

    try:
        if vehicle_data.plate_number is not None:
            setattr(vehicle_exists, "plate_number", vehicle_data.plate_number)
        if vehicle_data.color is not None:
            setattr(vehicle_exists, "color", vehicle_data.color)
        if vehicle_data.brand is not None:
            setattr(vehicle_exists, "brand", vehicle_data.brand)
        if vehicle_data.model is not None:
            setattr(vehicle_exists, "model", vehicle_data.model)
        if vehicle_data.year is not None:
            setattr(vehicle_exists, "year", vehicle_data.year)
        if vehicle_data.is_available is not None:
            setattr(vehicle_exists, "is_available", vehicle_data.is_available)
        db.add(vehicle_exists)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": "Vehicle updated successfully"}


@router.delete("/delete/{pk}")
def delete_vehicle(
    pk: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    vehicle = db.query(Vehicle).filter(Vehicle.id == pk).first()

    if not vehicle:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Vehicle not found"
        )

    try:
        db.delete(vehicle)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": "Vehicle deleted successfully"}
