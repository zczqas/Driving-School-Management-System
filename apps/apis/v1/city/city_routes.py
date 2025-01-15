from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from apps.apis.v1.city.filter_sort import FilterCity, SortCity
from apps.core.models.city import City
from apps.core.schemas.city import (
    CityCreateSchema,
    CityFilterSchema,
    CityResponseSchema,
    CityResponseSchemaTotal,
    CityUpdateSchema,
)
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db


router = APIRouter(prefix="/city", tags=["city"])


@router.get("/get", response_model=CityResponseSchemaTotal)
def get_city(
    offset: int = 0,
    limit: int = 10,
    filter_data: CityFilterSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    query = db.query(City)

    filter_params = {
        "city_id": filter_data.city_id,
        "name": filter_data.name,
        "state": filter_data.state,
        "country": filter_data.country,
        "city_abbreviation": filter_data.city_abbreviation,
    }

    query = FilterCity().filter_cities(query, **filter_params)
    query = SortCity().sorting_cities(
        query=query, sort=filter_data.sort, order=filter_data.order
    )

    total = query.with_entities(City.id).count()

    cities = query.limit(limit).offset(offset).all()

    response = {"total": total, "city": cities}

    return response


@router.get("/get/{city_id}", response_model=CityResponseSchema)
def get_city_by_id(
    city_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    city = db.query(City).filter(City.id == city_id).first()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="City not found"
        )

    return city


@router.post("/create")
def create_city(
    city_data: CityCreateSchema,
    db: Session = Depends(get_db),
):
    city_abbreviation = (
        db.query(City)
        .filter(City.city_abbreviation.ilike(city_data.city_abbreviation))
        .first()
    )

    if city_abbreviation:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="City abbreviation already exists",
        )

    try:
        city = City(**city_data.model_dump())
        db.add(city)
        db.commit()
        db.refresh(city)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": "City created successfully"}


@router.put("/update/{city_id}")
def update_city(
    city_id: int,
    city_data: CityUpdateSchema,
    db: Session = Depends(get_db),
):
    city = db.query(City).filter(City.id == city_id).first()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="City not found"
        )

    try:
        if city_data.name is not None:
            setattr(city, "name", city_data.name)

        if city_data.state is not None:
            setattr(city, "state", city_data.state)
        if city_data.city_abbreviation is not None:
            if city_data.city_abbreviation.lower() == city.city_abbreviation.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="City abbreviation already exists",
                )
            else:
                setattr(city, "city_abbreviation", city_data.city_abbreviation)

        db.add(city)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": "City updated successfully"}


@router.delete("/delete/{city_id}")
def delete_city(
    city_id: int,
    db: Session = Depends(get_db),
):
    city = db.query(City).filter(City.id == city_id).first()

    if not city:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="City not found"
        )

    try:
        db.delete(city)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": "City deleted successfully"}
