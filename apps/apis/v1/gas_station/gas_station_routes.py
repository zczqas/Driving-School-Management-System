from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.gas_station.filter_sort import FilterStation, SortGasStation
from apps.config.db.conn import get_db
from apps.core.models.gas_station import GasStation
from apps.core.schemas.gas_station import (
    GasStationCreateSchema,
    GasStationFilterSchema,
    GasStationResponseSchema,
    GasStationResponseSchemaTotal,
    GasStationUpdateSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/gas_station", tags=["gas station"])


@router.get("/get", response_model=GasStationResponseSchemaTotal)
def get_gas_station(
    offset: int = 0,
    limit: int = 10,
    filter_data: GasStationFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(GasStation)

    filter_params = {
        "name": filter_data.name,
        "address": filter_data.address,
        "city_id": filter_data.city_id,
        "state": filter_data.state,
        "zip_code": filter_data.zip_code,
        "phone": filter_data.phone,
        "email": filter_data.email,
        "website": filter_data.website,
        "notes": filter_data.notes,
    }

    query = FilterStation().filter_gas_stations(query, **filter_params)
    query = SortGasStation().sorting_gas_stations(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(GasStation.id).count()

    response = {
        "total": total,
        "gas_station": query.limit(limit).offset(offset).all(),
    }

    return response


@router.get("/get/{gas_station_id}", response_model=GasStationResponseSchema)
def get_gas_station_by_id(
    gas_station_id: int,
    db: Session = Depends(get_db),
):
    gas_station = db.query(GasStation).filter(GasStation.id == gas_station_id).first()

    if not gas_station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gas Station not found",
        )

    return gas_station


@router.post("/create")
def create_gas_station(
    station_data: GasStationCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    try:
        gas_station = GasStation(**station_data.model_dump())
        db.add(gas_station)
        db.commit()
        db.refresh(gas_station)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Gas Station created successfully"}


@router.put("/update/{station_id}")
def update_gas_station(
    station_data: GasStationUpdateSchema,
    station_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    station = db.query(GasStation).filter(GasStation.id == station_id).first()

    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gas Station not found",
        )

    try:
        attributes = [
            "name",
            "address",
            "city_id",
            "state",
            "zip_code",
            "phone",
            "email",
            "website",
            "notes",
        ]

        for attr in attributes:
            if getattr(station_data, attr):
                setattr(station, attr, getattr(station_data, attr))

        db.add(station)
        db.commit()
        db.refresh(station)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Gas Station updated successfully"}


@router.delete("/delete/{station_id}")
def delete_gas_station(
    station_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    station = db.query(GasStation).filter(GasStation.id == station_id).first()

    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gas Station not found",
        )

    try:
        db.delete(station)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error: {e}",
        ) from e

    return {"message": "Gas Station deleted successfully"}
