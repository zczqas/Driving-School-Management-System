from sqlalchemy import asc, desc, nulls_last
from sqlalchemy.orm import Query

from apps.core.models.transaction import Transaction
from apps.core.models.users import (
    Users,
)


class SortTransaction:
    def sort_transaction(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": Users.first_name,
            "date_charged": Transaction.date_charged,
            "amount": Transaction.amount,
            "discount": Transaction.discount,
            "method": Transaction.method,
            "location": Transaction.location,
            "refund": Transaction.refund,
            "created_at": Transaction.created_at,
            "updated_at": Transaction.updated_at,
            "transaction_id": Transaction.id,
        }

        sorting_key = sorting_options.get(sort.lower(), None)

        if order.lower() == "asc":
            query = query.order_by(nulls_last(asc(sorting_key)))
        elif order.lower() == "desc":
            query = query.order_by(nulls_last(desc(sorting_key)))
        else:
            raise ValueError("Invalid order parameter. Use 'asc' or 'desc'.")

        if sort.lower() == "name":
            query = query.join(Users, Transaction.user_id == Users.id)
        return query


class FilterTransaction:
    def filter_transaction(self, query: Query, **kwargs) -> Query:
        """Filter Transaction

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """

        params = kwargs

        if user_id := params.get("user_id"):
            query = query.filter(Transaction.user_id == user_id)
        if user_name := params.get("user_name"):
            query = query.filter(
                Transaction.user.has(Users.first_name.ilike(f"%{user_name}%"))
            )
        if transaction_id := params.get("transaction_id"):
            query = query.filter(Transaction.id == transaction_id)
        if amount := params.get("amount"):
            query = query.filter(Transaction.amount == amount)
        if discount := params.get("discount"):
            query = query.filter(Transaction.discount == discount)
        if method := params.get("method"):
            if method == "ALL":
                pass
            else:
                query = query.filter(Transaction.method == method)
        if location := params.get("location"):
            query = query.filter(Transaction.location == location)
        if params.get("is_deleted") is not None:
            query = query.filter(Transaction.is_deleted == params.get("is_deleted"))
        if params.get("date_charged") is not None:
            query = query.filter(Transaction.date_charged == params.get("date_charged"))
        if to := params.get("to"):
            query = query.filter(Transaction.date_charged <= to)
        if from_ := params.get("from_"):
            query = query.filter(Transaction.date_charged >= from_)
        if status := params.get("status"):
            query = query.filter(Transaction.status == status)
        if driving_school_id := params.get("driving_school_id"):
            query = query.filter(Transaction.driving_school_id == driving_school_id)

        return query
