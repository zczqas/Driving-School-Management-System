from sqlalchemy.orm import Query
from apps.core.models.coupons import Coupon, UsersCoupon
from apps.common.enum import OrderEnum
from datetime import datetime


class CouponFilterObject:
    def filter_coupons(self, query: Query, **kwargs) -> Query:
        if order := kwargs.get("order"):
            if order == OrderEnum.ASC:
                query = query.order_by(Coupon.created_at.asc())
            else:
                query = query.order_by(Coupon.created_at.desc())

        day = datetime.now().date()

        available = kwargs.get("available")

        if user_id := kwargs.get("user_id"):
            query = query.join(UsersCoupon).filter(UsersCoupon.user_id == user_id)
            if available is not None:
                if available:
                    query = query.filter(
                        UsersCoupon.used < UsersCoupon.assigned,
                        Coupon.expiration > day,
                        Coupon.is_active == True,
                    )
                else:
                    query = query.filter(
                        (UsersCoupon.used >= UsersCoupon.assigned)
                        | (Coupon.expiration <= day)
                        | (Coupon.is_active == False)
                    )
        else:
            if available is not None:
                if available:
                    query = query.filter(
                        Coupon.uses < Coupon.max_uses,
                        Coupon.expiration > day,
                        Coupon.is_active == True,
                    )
                else:
                    query = query.filter(
                        (Coupon.uses >= Coupon.max_uses)
                        | (Coupon.expiration <= day)
                        | (Coupon.is_active == False)
                    )

        if include_deleted := kwargs.get("include_deleted"):
            query = query.filter(Coupon.is_deleted == include_deleted)

        return query
