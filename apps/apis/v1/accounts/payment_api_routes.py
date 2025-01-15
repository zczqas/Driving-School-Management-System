from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.accounts.hash_and_encode import decrypt_value, encrypt_value
from apps.config.db.conn import get_db
from apps.core.models.PaymentAPIs import PaymentAPIs
from apps.core.schemas.PaymentAPIs import (
    PaymentAPIsCreateSchema,
    PaymentAPIsUpdateSchema,
)
from apps.decorator.log_decorator import log_activity
from apps.rbac.role_permission_decorator import check_role_permissions  # noqa
from apps.security.auth import jwt_service

router = APIRouter(prefix="/payment_api", tags=["payment api"])


@router.get("/get")
def get_payment_apis(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    payment_apis = db.query(PaymentAPIs).all()

    # decrypt the values
    payment_apis = [
        {
            "id": payment_api.id,
            "name": payment_api.name,
            "sandbox_api_key_id": decrypt_value(payment_api.sandbox_api_key_id),  # type: ignore
            "sandbox_transaction_key": decrypt_value(
                payment_api.sandbox_transaction_key  # type: ignore
            ),
            "sandbox_is_active": payment_api.sandbox_is_active,
            "production_api_key_id": decrypt_value(payment_api.production_api_key_id),  # type: ignore
            "production_transaction_key": decrypt_value(
                payment_api.production_transaction_key  # type: ignore
            ),
            "production_is_active": payment_api.production_is_active,
            "driving_school_id": payment_api.driving_school_id,
            "is_active": payment_api.is_active,
            "created_at": payment_api.created_at,
            "updated_at": payment_api.updated_at,
        }
        for payment_api in payment_apis
    ]

    return payment_apis


@router.get("/get/{payment_api_id}")
# @check_role_permissions(["ADMIN"])
def get_payment_api(
    payment_api_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    payment_api = db.query(PaymentAPIs).filter(PaymentAPIs.id == payment_api_id).first()
    if not payment_api:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Payment API not found"
        )

    return {
        "id": payment_api.id,
        "name": payment_api.name,
        "sandbox_api_key_id": decrypt_value(payment_api.sandbox_api_key_id),  # type: ignore
        "sandbox_transaction_key": decrypt_value(payment_api.sandbox_transaction_key),  # type: ignore
        "sandbox_is_active": payment_api.sandbox_is_active,
        "production_api_key_id": decrypt_value(payment_api.production_api_key_id),  # type: ignore
        "production_transaction_key": decrypt_value(
            payment_api.production_transaction_key  # type: ignore
        ),
        "production_is_active": payment_api.production_is_active,
        "driving_school_id": payment_api.driving_school_id,
        "is_active": payment_api.is_active,
        "created_at": payment_api.created_at,
        "updated_at": payment_api.updated_at,
    }


@router.get("/get/school/{school_id}")
def get_payment_api_by_driving_school(
    school_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    payment_apis = (
        db.query(PaymentAPIs).filter(PaymentAPIs.driving_school_id == school_id).all()
    )

    payment_api_list = [
        {
            "id": payment_api.id,
            "name": payment_api.name,
            "sandbox_api_key_id": decrypt_value(payment_api.sandbox_api_key_id),  # type: ignore
            "sandbox_transaction_key": decrypt_value(
                payment_api.sandbox_transaction_key  # type: ignore
            ),
            "sandbox_is_active": payment_api.sandbox_is_active,
            "production_api_key_id": decrypt_value(payment_api.production_api_key_id),  # type: ignore
            "production_transaction_key": decrypt_value(
                payment_api.production_transaction_key  # type: ignore
            ),
            "production_is_active": payment_api.production_is_active,
            "driving_school_id": payment_api.driving_school_id,
            "is_active": payment_api.is_active,
            "created_at": payment_api.created_at,
            "updated_at": payment_api.updated_at,
        }
        for payment_api in payment_apis
    ]

    return payment_api_list


@router.post("/add")
@log_activity(
    action="add_payment_api", description="add payment service api keys for transaction"
)
# @check_role_permissions(["ADMIN"])
def add_payment_api(
    payment_apis: PaymentAPIsCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    try:
        new_payment_api = PaymentAPIs(
            name=payment_apis.name,
            sandbox_api_key_id=encrypt_value(payment_apis.sandbox_api_key_id),  # type: ignore
            sandbox_transaction_key=encrypt_value(payment_apis.sandbox_transaction_key),  # type: ignore
            production_api_key_id=encrypt_value(payment_apis.production_api_key_id),  # type: ignore
            production_transaction_key=encrypt_value(
                payment_apis.production_transaction_key  # type: ignore
            ),
            driving_school_id=payment_apis.driving_school_id,
        )
        db.add(new_payment_api)
        db.commit()
        db.refresh(new_payment_api)
    except HTTPException as e:
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "payment APIs successfully added"}


@router.put("/update/{payment_api_id}")
# @check_role_permissions(["ADMIN"])
def update_payment_api(
    payment_api_id: int,
    payment_apis: PaymentAPIsUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    payment_api = db.query(PaymentAPIs).filter(PaymentAPIs.id == payment_api_id).first()
    if not payment_api:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="payment API not found"
        )

    try:
        if payment_apis.name is not None:
            payment_api.name = payment_apis.name  # type: ignore

        # sandbox api keys
        if payment_apis.sandbox_api_key_id is not None:
            payment_api.sandbox_api_key_id = encrypt_value(  # type: ignore
                payment_apis.sandbox_api_key_id
            )
        if payment_apis.sandbox_transaction_key is not None:
            payment_api.sandbox_transaction_key = encrypt_value(  # type: ignore
                payment_apis.sandbox_transaction_key
            )

        # production api keys
        if payment_apis.production_api_key_id is not None:
            payment_api.production_api_key_id = encrypt_value(  # type: ignore
                payment_apis.production_api_key_id
            )
        if payment_apis.production_transaction_key is not None:
            payment_api.production_transaction_key = encrypt_value(  # type: ignore
                payment_apis.production_transaction_key
            )

        if payment_apis.driving_school_id is not None:
            payment_api.driving_school_id = payment_apis.driving_school_id  # type: ignore

        # update the active status only one can be true at a time
        if payment_apis.sandbox_is_active is not None:
            payment_api.production_is_active = not payment_apis.sandbox_is_active  # type: ignore
            payment_api.sandbox_is_active = payment_apis.sandbox_is_active  # type: ignore
        if payment_apis.production_is_active is not None:
            payment_api.production_is_active = payment_apis.production_is_active  # type: ignore
            payment_api.sandbox_is_active = not payment_apis.production_is_active  # type: ignore

        db.add(payment_api)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"error: {str(e)}"
        ) from e

    return {"message": "payment API updated successfully"}


@router.delete("/delete/{payment_api_id}", status_code=status.HTTP_204_NO_CONTENT)
# @check_role_permissions(["ADMIN"])
def delete_payment_api(
    payment_api_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    payment_api = db.query(PaymentAPIs).filter(PaymentAPIs.id == payment_api_id).first()
    if not payment_api:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="payment API not found"
        )
    try:
        db.delete(payment_api)
        db.commit()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"error: {str(e)}"
        ) from e
