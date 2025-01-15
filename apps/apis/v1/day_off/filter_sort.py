from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.day_off import DayOff


class SortDayOff:
    def sorting_day_off(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "user_id": DayOff.user_id,
            "to_": DayOff.to_,
            "from_": DayOff.from_,
            "day_": DayOff.day_,
            "created_at": DayOff.created_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterDayOff:
    def filter_day_off(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if user_id := params.get("user_id"):
            query = query.filter(DayOff.user_id == user_id)
        if from_ := params.get("from_"):
            query = query.filter(DayOff.from_ >= from_)
        if to_ := params.get("to_"):
            query = query.filter(DayOff.to_ <= to_)
        if day_ := params.get("day_"):
            query = query.filter(DayOff.day_ == day_)

        return query
