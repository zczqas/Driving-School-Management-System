from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.vehicle import Vehicle


class SortVehicle:
    def sorting_vehicles(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": Vehicle.created_at,
            "updated_at": Vehicle.updated_at,
            "year": Vehicle.year,
        }
        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterVehicle:
    def filter_vehicles(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if plate_number := params.get("plate_number"):
            query = query.filter(Vehicle.plate_number == plate_number)

        if color := params.get("color"):
            query = query.filter(Vehicle.color.ilike(f"%{color}%"))

        if brand := params.get("brand"):
            query = query.filter(Vehicle.brand.ilike(f"%{brand}%"))

        if model := params.get("model"):
            query = query.filter(Vehicle.model.ilike(f"%{model}%"))

        if year := params.get("year"):
            min_year = year - 1
            max_year = year + 1

            query = query.filter(Vehicle.year.between(min_year, max_year))

        if is_available := params.get("is_available"):
            query = query.filter(Vehicle.is_available == is_available)

        return query
