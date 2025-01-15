from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.accounts import payment_service
from apps.apis.v1.accounts.filter_sort import FilterTransaction, SortTransaction
from apps.apis.v1.accounts.hash_and_encode import decrypt_value
from apps.apis.v1.users.profile_routes import unlock_profile
from apps.common.enum import (
    PackageTypeEnum,
    TransactionMethodEnum,
    TransactionStatusEnum,
)
from apps.config.db.conn import get_db
from apps.core.models.appointment_schedule import (
    AppointmentSchedule,
    AppointmentScheduleStatus,
)
from apps.core.models.coupons import Coupon, UsersCoupon
from apps.core.models.package import Package
from apps.core.models.PaymentAPIs import PaymentAPIs
from apps.core.models.school_organization import DrivingSchool
from apps.core.models.transaction import Transaction
from apps.core.models.users import Users
from apps.core.schemas.transaction import (
    TransactionCreate,
    TransactionCreateResponse,
    TransactionFilterSchema,
    TransactionResponseSchema,
    TransactionResponseSchemaTotal,
    TransactionUpdate,
)

# from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.services.send_email import send_email

router = APIRouter(prefix="/account", tags=["account"])


@router.get("/get", response_model=TransactionResponseSchemaTotal)
# @check_role_permissions(["ADMIN", "CSR"])
def get_transactions(
    offset: int = 0,
    limit: int = 10,
    transactions_filter_params: TransactionFilterSchema = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to get transactions for ADMIN and CSR

    Args:
        offset (int, optional): Defaults to 0.
        limit (int, optional): Defaults to 10.
        transactions_filter_params (TransactionFilterSchema, optional):
            transaction_id, user_id, sort, order. Defaults to Depends().
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Returns:
        response: {total: int, transactions: list[TransactionResponseSchema]}
    """
    # query = db.query(Transaction).options(
    #     joinedload(Transaction.user).load_only(
    #         Users.first_name,  # type: ignore
    #         Users.middle_name,  # type: ignore
    #         Users.last_name,  # type: ignore
    #     )
    # )
    query = db.query(Transaction)

    filter_params = transactions_filter_params.model_dump(exclude_unset=True)

    filter_query = FilterTransaction().filter_transaction(query, **filter_params)
    filter_query = SortTransaction().sort_transaction(
        query=filter_query,
        sort=transactions_filter_params.sort,
        order=transactions_filter_params.order,
    )

    total = filter_query.with_entities(Transaction.id).count()
    transactions = filter_query.offset(offset).limit(limit).all()
    appointment_schedules = (
        db.query(AppointmentSchedule)
        .filter(
            AppointmentSchedule.status.has(
                AppointmentScheduleStatus.name.ilike("completed")
            )
        )
        .all()
    )
    user_transactions = []
    for transaction in transactions:
        user_id = transaction.user_id
        completed_appointments_count = sum(
            1
            for appointment in appointment_schedules
            if appointment.student_id == user_id
            and appointment.package_id == transaction.package_id
        )
        total_appointments_count = (
            db.query(AppointmentSchedule)
            .filter(AppointmentSchedule.student_id == user_id)
            .count()
        )
        user_transactions.append(
            {
                "transaction": transaction,
                "completed_appointments": completed_appointments_count,
                "total_appointments": total_appointments_count,
            }
        )
    serialized_transactions = [
        {
            **transaction["transaction"].__dict__,
            "completed_appointments": transaction["completed_appointments"],
            "total_appointments": transaction["total_appointments"],
            "created_by": (
                {
                    "id": transaction["transaction"].created_by.id,
                    "first_name": transaction["transaction"].created_by.first_name,
                    "middle_name": transaction["transaction"].created_by.middle_name,
                    "last_name": transaction["transaction"].created_by.last_name,
                }
                if transaction["transaction"].created_by
                else None
            ),
            "user": transaction["transaction"].user,
            "package": transaction["transaction"].package,
            "driving_school": transaction["transaction"].driving_school,
        }
        for transaction in user_transactions
    ]
    return {
        "total": total,
        "transactions": serialized_transactions,
    }


@router.get("/get/{transaction_id}", response_model=TransactionResponseSchema)
# @check_role_permissions(["ADMIN", "CSR"])
def get_transaction_by_id(
    transaction_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    # transaction_check = db.query(Transaction).filter(
    #         Transaction.user_id == current_user.id
    #     ).first()
    # if not transaction_check:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="You are not authorized to view this transaction",
    #     )

    transaction = (
        db.query(Transaction)
        .filter(
            Transaction.id == transaction_id, Transaction.is_deleted == False  # noqa
        )  # noqa
        .first()
    )

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    return transaction


@router.post("/post", response_model=TransactionCreateResponse)
# @check_role_permissions("ADMIN", "CSR")
async def create_transaction(
    transaction_data: TransactionCreate = Depends(),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to create transaction for ADMIN and CSR

    Args:
        transaction_data (TransactionCreate, optional):
                amount,
                discount,
                method,
                location,
                user_id.
            Defaults to Depends().
        current_user (Any, optional):
                Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, User not found
        HTTPException: 500, Internal server error

    Returns:
        db_transaction: TransactionCreateResponse
    """
    transaction_id = None
    user_id_check = db.query(Users).filter(Users.id == transaction_data.user_id).first()
    if not user_id_check:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    package = (
        db.query(Package).filter(Package.id == transaction_data.package_id).first()
    )
    if not package:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Package not found"
        )

    if transaction_data.driving_school_id is not None:
        driving_school = (
            db.query(DrivingSchool)
            .filter(DrivingSchool.id == transaction_data.driving_school_id)
            .first()
        )
        if not driving_school:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Driving school not found"
            )

    transaction_with_lesson = (
        db.query(Transaction)
        .filter(Transaction.package_id == transaction_data.package_id)
        .filter(Transaction.user_id == transaction_data.user_id)
        .filter(Transaction.is_deleted == False)  # noqa
        .first()
    )
    if transaction_with_lesson:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has this package",
        )

    coupon = None
    if transaction_data.coupon_id is not None:
        coupon = (
            db.query(Coupon).filter(Coupon.id == transaction_data.coupon_id).first()
        )
        if coupon is None:
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="Coupon doesn't exist.",
            )

    if coupon is not None:
        if not coupon.is_active:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="The coupon use is disabled.",
            )
        if coupon.uses >= coupon.max_uses:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail="The coupon has exceeded its used limit.",
            )
        if coupon.min_purchase > package.price:  # type: ignore
            raise HTTPException(
                status_code=status.HTTP_406_NOT_ACCEPTABLE,
                detail=f"The coupon min purchase must be greater than {coupon.min_purchase}",
            )

        coupon_info = (
            db.query(UsersCoupon)
            .filter(
                UsersCoupon.coupon_id == coupon.id,
                UsersCoupon.user_id == transaction_data.user_id,
            )
            .first()
        )
        if coupon_info is not None:
            if coupon_info.used >= coupon_info.assigned:  # type: ignore
                raise HTTPException(
                    status_code=status.HTTP_406_NOT_ACCEPTABLE,
                    detail="User has already used the coupon once. Please use another coupon.",
                )
            db.query(UsersCoupon).filter(
                UsersCoupon.coupon_id == coupon.id,
                UsersCoupon.user_id == transaction_data.user_id,
            ).update({UsersCoupon.used: UsersCoupon.used + 1})
        else:
            coupon_info = UsersCoupon(
                user_id=transaction_data.user_id,
                coupon_id=coupon.id,
                used=1,
                assigned=1,
            )
            db.add(coupon_info)

        db.query(Coupon).filter(Coupon.id == coupon.id).update(
            {Coupon.uses: Coupon.uses + 1}
        )

    setattr(transaction_data, "coupon_id", coupon if coupon is None else coupon.id)
    # setattr(transaction_data, "amount", package.price)

    total_lesson = len(package.lessons)

    final_amount = package.price
    if coupon is not None:
        final_amount = package.price - coupon.amount

    if transaction_data.discount is not None:
        final_amount -= transaction_data.discount

    if transaction_data.additional_amount is not None:
        final_amount += transaction_data.additional_amount

    if final_amount < 0:  # type: ignore
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="final calculated amount cannot be negative",
        )

    if (
        transaction_data.method == TransactionMethodEnum.CREDIT_CARD
        or transaction_data.method == TransactionMethodEnum.DEBIT_CARD
    ):
        if (
            not transaction_data.cardholder_name
            or not transaction_data.card_number
            or not transaction_data.expiration_date
            or not transaction_data.cvv
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="full credit card information is required for credit card payment",
            )

        payment_api = (
            db.query(PaymentAPIs)
            .filter(PaymentAPIs.is_active == True)  # noqa
            .filter(PaymentAPIs.driving_school_id == transaction_data.driving_school_id)
            .first()
        )
        if not payment_api:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="payment API not found"
            )

        if payment_api.sandbox_is_active:  # type: ignore
            api_key_id = decrypt_value(payment_api.sandbox_api_key_id)  # type: ignore
            transaction_key = decrypt_value(payment_api.sandbox_transaction_key)  # type: ignore
            api_type = "SANDBOX"
        elif payment_api.production_is_active:  # type: ignore
            api_key_id = decrypt_value(payment_api.production_api_key_id)  # type: ignore
            transaction_key = decrypt_value(payment_api.production_transaction_key)  # type: ignore
            api_type = "PRODUCTION"
        else:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No active payment API configuration found",
            )

        try:
            transaction_id = payment_service.charge_credit_card(
                amount=final_amount,
                # cardholder_name=transaction_data.cardholder_name,
                card_number=transaction_data.card_number,
                expiration_date=transaction_data.expiration_date,
                cvv=transaction_data.cvv,
                api_login_id=api_key_id,
                transaction_key=transaction_key,
                api_type=api_type,
            )
        except HTTPException as e:
            raise e

    try:
        transaction_dict = transaction_data.model_dump(
            exclude_unset=True,
            exclude={
                "coupon_id",
                "cardholder_name",
                "payment_api_id",
                "card_number",
                "expiration_date",
                "cvv",
            },
        )
        db_transaction = Transaction(**transaction_dict)
        setattr(db_transaction, "total_lesson", total_lesson)
        setattr(db_transaction, "amount", final_amount)
        if transaction_id is not None:
            setattr(db_transaction, "transaction_id", transaction_id)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    try:
        # for some reason created_by_id is not being set and this is a workaround
        setattr(db_transaction, "created_by_id", current_user.id)
        db.add(db_transaction)
        db.commit()
        db.refresh(db_transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    try:
        user = db.query(Users).filter(Users.id == transaction_data.user_id).first()
        setattr(user, "has_paid", True)
        if package.package_type == PackageTypeEnum.ONLINE:  # type: ignore
            setattr(user, "driver_ed", True)
        user.package.append(package)  # type: ignore
        db.add(user)
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    email_body = {
        "user_name": f"{user.first_name} {user.last_name}",  # type: ignore
        "amount": final_amount,
        "transaction_date": db_transaction.date_charged,
        "transaction_method": transaction_data.method.value,
        "transaction_id": (
            db_transaction.transaction_id
            if transaction_data.method != TransactionMethodEnum.CASH
            else None
        ),
        "year": db_transaction.date_charged.year,
        "company_name": "Safety First Driving School",
    }

    await send_email(
        subject="Transaction email",
        receiver=[user.email],  # type: ignore
        body=email_body,
        template_name="transaction.html",
        db=db,
        user_profiles_id=user.profile.id,  # type: ignore
    )

    return db_transaction


@router.put("/update/{transaction_id}")
# @check_role_permissions(["ADMIN", "CSR"])
def update_transaction(
    transaction_id: int,
    transaction_data: TransactionUpdate,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to update transaction for ADMIN and CSR

    Args:
        transaction_data (TransactionUpdate, optional):
                id(Required),
                user_id,
                amount,
                discount,
                method,
                location,
                date_charged,
                refund.
            Defaults to Depends().
        current_user (Any, optional):
            Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Transaction not found
        HTTPException: 404, User not found
        HTTPException: 400, User id does not match
        HTTPException: 500, Internal server error

    Returns:
        message: Transaction updated successfully
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )
    try:
        if transaction_data.user_id:
            user_id_check = (
                db.query(Users).filter(Users.id == transaction_data.user_id).first()
            )
            if not user_id_check:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
                )
            if transaction.user_id is not transaction_data.user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="User id does not match",
                )
            setattr(transaction, "user_id", transaction_data.user_id)
        if transaction_data.refund:
            setattr(transaction, "refund", transaction_data.refund)
        if transaction_data.amount:
            setattr(transaction, "amount", transaction_data.amount)
        if transaction_data.discount:
            setattr(transaction, "discount", transaction_data.discount)
        if transaction_data.method:
            setattr(transaction, "method", transaction_data.method)
        if transaction_data.location:
            setattr(transaction, "location", transaction_data.location)
        if transaction_data.driving_school_id:
            setattr(
                transaction, "driving_school_id", transaction_data.driving_school_id
            )
        if transaction_data.status:
            transaction.status = transaction_data.status
        if transaction_data.status == TransactionStatusEnum.SETTLED:
            unlock_profile(transaction.user_id, db=db)

        db.add(transaction)
        db.commit()
        db.refresh(transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Transaction updated successfully"}


@router.patch("/delete/{transaction_id}")
# @check_role_permissions(["ADMIN", "CSR"])
def delete_transaction(
    transaction_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """API to soft delete transaction by transaction_id for ADMIN and CSR

    Args:
        transaction_id (int): Transaction id
        current_user (Any, optional):
                Used for check_role_permissions decorator DO NOT REMOVE.
            Defaults to Depends(jwt_service.get_current_user).
        db (Session, optional): CTX database. Defaults to Depends(get_db).

    Raises:
        HTTPException: 404, Transaction not found
        HTTPException: 500, Internal server errorb

    Returns:
        message: Transaction deleted successfully
        (not really deleted, just updated is_deleted to True)
    """
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()

    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found"
        )

    try:
        setattr(transaction, "is_deleted", True)
        db.add(transaction)
        db.commit()
        # db.refresh(transaction)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Transaction deleted successfully"}
