from fastapi import APIRouter, Depends, HTTPException, status
from datetime import timedelta
from sqlalchemy.orm import Session
from apps.apis.v1.day_off.filter_sort import FilterDayOff, SortDayOff
from apps.core.models.day_off import DayOff
from apps.core.schemas.day_off import (
    DayOffCreateSchema,
    DayOffDeleteFromRangeSchema,
    DayOffFilterSchema,
    DayOffResponseSchema,
    DayOffListResponseSchema,
    DayOffUpdateSchema,
)
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/day_off", tags=["Day Off"])


@router.get("/get", response_model=DayOffListResponseSchema)
def get_day_offs(
    offset: int = 0,
    limit: int = 10,
    filter_params: DayOffFilterSchema = Depends(),
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    query = db.query(DayOff)

    params = filter_params.model_dump(exclude_unset=True)

    query = FilterDayOff().filter_day_off(query, **params)
    query = SortDayOff().sorting_day_off(
        query=query, sort=filter_params.sort, order=filter_params.order
    )

    total = query.with_entities(DayOff.id).count()

    response = {
        "total": total,
        "day_offs": query.offset(offset).limit(limit).all(),
    }

    return response


@router.get("/get/{id}", response_model=DayOffResponseSchema)
def get_day_off_by_id(
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    day_off = db.query(DayOff).filter(DayOff.id == id).first()
    if day_off is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Day Off not found"
        )

    return day_off


@router.post("/create")
def create_day_off(
    day_off: DayOffCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    existing_day_offs = db.query(DayOff).filter(DayOff.user_id == day_off.user_id).all()

    for existing_day_off in existing_day_offs:
        if day_off.from_ > day_off.to_:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="From date should be less than to date",
            )

        if (
            (
                day_off.from_ >= existing_day_off.from_
                and day_off.to_ <= existing_day_off.to_
            )
            or (
                day_off.from_ <= existing_day_off.from_
                and day_off.to_ >= existing_day_off.to_
            )
            or (
                day_off.from_ == existing_day_off.to_
                or day_off.to_ == existing_day_off.from_
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Dates {day_off.from_} to {day_off.to_} overlap with an existing "
                    f"day off from {existing_day_off.from_} to {existing_day_off.to_}."
                ),
            )

    try:
        new_day_off = DayOff(**day_off.model_dump())
        db.add(new_day_off)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}"
        ) from e

    return {"message": "Day Off created successfully"}


@router.put("/update/{id}")
def update_day_off(
    day_off: DayOffUpdateSchema,
    id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    existing_day_off = db.query(DayOff).filter(DayOff.id == id).first()

    if not day_off:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Day Off not found"
        )

    try:
        attributes = [
            "user_id",
            "to_",
            "from_",
            "day_",
        ]
        for attribute in attributes:
            value = getattr(day_off, attribute)
            if value:
                setattr(day_off, attribute, value)

        db.add(day_off)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error{e}"
        ) from e
    return {"message": "Day Off updated successfully"}


@router.delete("/delete/{id}")
def delete_day_off(
    id: int,
    db: Session = Depends(get_db),
):
    day_off = db.query(DayOff).filter(DayOff.id == id).first()

    if not day_off:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Day Off not found"
        )
    try:
        db.delete(day_off)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error{e}"
        ) from e
    return {"message": "Day Off deleted successfully"}


@router.put("/delete_day_off_from_date/{id}")
def delete_day_off_from_date(
    id: int,
    day_off: DayOffDeleteFromRangeSchema,
    db: Session = Depends(get_db),
):
    existing_day_off = db.query(DayOff).filter(DayOff.id == id).first()

    if not existing_day_off:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Day Off not found"
        )
    # Check if given range falls between existing day off range
    if day_off.from_ > existing_day_off.from_ and day_off.to_ < existing_day_off.to_:
        try:
            new_day_off_1 = DayOff(
                user_id=existing_day_off.user_id,
                from_=existing_day_off.from_,
                to_=day_off.from_ - timedelta(days=1),
                reason=existing_day_off.reason,
            )
            db.add(new_day_off_1)
            db.commit()

            new_day_off_2 = DayOff(
                user_id=existing_day_off.user_id,
                from_=day_off.to_ + timedelta(days=1),
                to_=existing_day_off.to_,
                reason=existing_day_off.reason,
            )
            db.add(new_day_off_2)
            db.commit()

            db.delete(existing_day_off)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error{e}"
            ) from e

    # delete specific date.
    if day_off.from_ == day_off.to_:
        specific_date = day_off.from_
        try:
            if existing_day_off.from_ <= specific_date <= existing_day_off.to_:
                new_day_off_1 = DayOff(
                    user_id=existing_day_off.user_id,
                    from_=existing_day_off.from_,
                    to_=specific_date - timedelta(days=1),
                    reason=existing_day_off.reason,
                )
                db.add(new_day_off_1)
                db.commit()

            if existing_day_off.to_ > specific_date:
                new_day_off_2 = DayOff(
                    user_id=existing_day_off.user_id,
                    from_=specific_date + timedelta(days=1),
                    to_=existing_day_off.to_,
                    reason=existing_day_off.reason,
                )
                db.add(new_day_off_2)
                db.commit()
            db.delete(existing_day_off)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error{e}"
            ) from e
        return {"message": f"Day off for {specific_date} deleted successfully"}

    return {"message": "Day off range deleted successfully"}
