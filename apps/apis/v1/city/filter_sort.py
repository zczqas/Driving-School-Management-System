from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.city import City


class SortCity:
    def sorting_cities(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": City.name,
            "state": City.state,
            "country": City.country,
            "city_abbreviation": City.city_abbreviation,
            "created_at": City.created_at,
            "updated_at": City.updated_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterCity:
    def filter_cities(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if city_id := params.get("city_id"):
            query = query.filter(City.id == city_id)

        if name := params.get("name"):
            query = query.filter(City.name.ilike(f"%{name}%"))

        if state := params.get("state"):
            query = query.filter(City.state.ilike(f"%{state}%"))

        if country := params.get("country"):
            query = query.filter(City.country.ilike(f"%{country}%"))

        if city_abbreviation := params.get("city_abbreviation"):
            query = query.filter(City.city_abbreviation.ilike(f"%{city_abbreviation}%"))

        return query
