from datetime import datetime
from typing import List

from fastapi import APIRouter, Depends, status
from fastapi.exceptions import HTTPException
from sqlalchemy.orm import Session

from apps.apis.v1.coupon.filter_coupon import CouponFilterObject
from apps.common.enum import CouponAssignableTypeEnum, RoleEnum
from apps.config.db.conn import get_db
from apps.core.models.coupons import Coupon, UsersCoupon
from apps.core.models.users import Users
from apps.core.schemas.dynamic.coupon import (
    CouponCreateSchema,
    CouponFilterSchema,
    CouponResponseSchema,
    RetrieveCouponResponseSchema,
    UpdateCouponSchema,
    UsersCouponCreateSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/coupon", tags=["coupon"])


def get_unique_hash() -> str:
    todaydatetime = datetime.now()
    return f"{todaydatetime.strftime('%Y%m%d%H%M%S%f')}"


@router.get(path="/get", response_model=List[CouponResponseSchema])
def get_coupons(
    filter_params: CouponFilterSchema = Depends(),
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: Users = Depends(jwt_service.get_current_user),
):
    query = db.query(Coupon)

    # if current_user.role in [RoleEnum.STUDENT, RoleEnum.INSTRUCTOR]:
    #     filter_params.user_id = current_user.id
    #     if filter_params.include_deleted is not None:
    #         filter_params.include_deleted = False

    params = {
        "order": filter_params.order,
        "user_id": filter_params.user_id,
        "available": filter_params.available,
        "include_deleted": filter_params.include_deleted,
    }
    query = CouponFilterObject().filter_coupons(query=query, **params)

    return query.offset(offset).limit(limit).all()


@router.post(
    path="/create",
    response_model=CouponResponseSchema,
    status_code=status.HTTP_201_CREATED,
)
def create_coupon(
    coupon: CouponCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    # if coupon.code is None:
    try:
        code = coupon.code or get_unique_hash()
        coupon_record = Coupon(
            **coupon.model_dump(exclude_unset=True, exclude={"code"})
        )
        coupon_record.code = code
        coupon_record.created_by_id = current_user.id
        db.add(coupon_record)
        db.commit()
        db.refresh(coupon_record)
        return coupon_record
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

    # except Exception as e:
    # raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post(path="/assign")
def assign_coupon(
    user_coupon: UsersCouponCreateSchema,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    coupon: Coupon = db.query(Coupon).get(user_coupon.coupon_id)
    user: Users = db.query(Users).get(user_coupon.user_id)

    if coupon is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Coupon doesn't exist.",
        )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User doesn't exist.",
        )

    if coupon.expiration <= datetime.now().date() or not Coupon.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The coupon is expired and isn't active.",
        )

    coupons_assigned_to = db.query(UsersCoupon).filter(
        UsersCoupon.coupon_id == coupon.id
    )

    if coupons_assigned_to.filter(UsersCoupon.user_id == user.id).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The user has already acquired this coupon.",
        )
    elif (
        coupon.type == CouponAssignableTypeEnum.SINGLE_USER
        and coupons_assigned_to.first()
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="The single user coupon is already assigned to another user.",
        )

    if user_coupon.assigned == 0 or user_coupon.assigned > (
        coupon.max_uses - coupon.uses
    ):
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="The coupon assigned value exceeds allowed quantity.",
        )

    try:
        u_coupon = UsersCoupon(**user_coupon.model_dump())
        db.query(Coupon).filter(Coupon.id == coupon.id).update(
            {Coupon.uses: Coupon.uses + user_coupon.assigned}
        )
        db.add(u_coupon)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
    return {"message": "The coupon has been assigned successfully."}


@router.post("/verify/{coupon_code}", response_model=CouponResponseSchema)
def verify_coupon(
    coupon_code: str,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    coupon = db.query(Coupon).filter(Coupon.code == coupon_code).first()
    if coupon is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="The coupon doesn't exist."
        )

    if coupon.expiration <= datetime.now().date() or not coupon.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The coupon is expired and isn't active.",
        )

    if coupon.uses >= coupon.max_uses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The coupon has reached its maximum uses.",
        )

    return coupon


@router.delete("/delete/{coupon_id}")
def delete_coupon(
    coupon_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(jwt_service.get_current_user),
):
    try:
        coupon: Coupon = db.query(Coupon).get(coupon_id)
        if coupon is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The following data is not available on the server",
            )

        db.query(Coupon).filter(Coupon.id == coupon.id).update(
            {Coupon.is_deleted: True}
        )
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )
    return {"message": "The coupon has been successfully deleted."}


@router.put("/update/{coupon_id}")
def update_coupon(
    coupon_id: int,
    coupon_item: UpdateCouponSchema,
    db: Session = Depends(get_db),
    current_user: Users = Depends(jwt_service.get_current_user),
):
    coupon = db.query(Coupon).get(coupon_id)
    if coupon is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="The coupon doesn't exist."
        )

    data = coupon_item.model_dump(exclude_unset=True)

    max_uses = data.get("max_uses", None)
    if max_uses is not None:
        if coupon.uses > max_uses:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"The coupon cannot be set to value lower than {coupon.uses}.",
            )
        data["max_uses"] = max_uses

    try:
        db.query(Coupon).filter(Coupon.id == coupon_id).update(data)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        )

    return {"message": "The coupon has been updated successfully"}


@router.get("/get/{coupon_id}", response_model=RetrieveCouponResponseSchema)
def get_users_with_coupon_id(
    coupon_id: int,
    user_id: int = None,
    db: Session = Depends(get_db),
    current_user: Users = Depends(jwt_service.get_current_user),
):
    coupon: Coupon = db.query(Coupon).get(coupon_id)

    if coupon is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="The coupon doesn't exist."
        )

    coupon_users = []
    if current_user.role in [RoleEnum.STUDENT, RoleEnum.INSTRUCTOR]:
        user_id = current_user.id

    if user_id:
        coupon_users = db.query(UsersCoupon).filter(
            UsersCoupon.coupon_id == coupon_id, UsersCoupon.user_id == user_id
        )
        if not coupon_users.first():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The user is not assigned this coupon.",
            )
    else:
        coupon_users = db.query(UsersCoupon).filter(UsersCoupon.coupon_id == coupon_id)

    return {"coupon": coupon, "coupon_users": coupon_users}
