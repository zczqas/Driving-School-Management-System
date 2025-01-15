from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.school_organization import School


class SortSchool:
    def sort_school(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": School.name,
            "created_at": School.created_at,
            "updated_at": School.updated_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterSchool:
    def filter_school(self, query: Query, **kwargs) -> Query:
        """Filter School

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if id := params.get("id"):
            query = query.filter(School.id == id)

        if name := params.get("name"):
            query = query.filter(School.name.ilike(f"%{name}%"))

        if description := params.get("description"):
            query = query.filter(School.description.ilike(f"%{description}%"))

        if address := params.get("address"):
            query = query.filter(School.address.ilike(f"%{address}%"))

        if latitude := params.get("latitude"):
            query = query.filter(School.latitude == latitude)

        if longitude := params.get("longitude"):
            query = query.filter(School.longitude == longitude)

        if zipcode := params.get("zipcode"):
            query = query.filter(School.zipcode == zipcode)

        return query
