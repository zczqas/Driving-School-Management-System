from sqlalchemy.orm import Query

from apps.core.models.package import Lesson, Package
from apps.common.filter_sort import Sort


class SortPackage:
    def sort_packages(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": Package.name,
            "price": Package.price,
            "created_at": Package.created_at,
            "updated_at": Package.updated_at,
            "category_id": Package.category_id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)

    def sort_lessons(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "name": Lesson.name,
            "duration": Lesson.duration,
            "created_at": Lesson.created_at,
            "updated_at": Lesson.updated_at,
            "is_active": Lesson.is_active,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterPackage:
    def filter_packages(self, query: Query, **kwargs) -> Query:
        """Filter Packages

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if name := params.get("name"):
            query = query.filter(Package.name.ilike(f"%{name}%"))

        if category_id := params.get("category_id"):
            query = query.filter(Package.category_id == category_id)

        if price := params.get("price"):
            max_price = price + price * 0.1
            min_price = price - price * 0.1

            query = query.filter(Package.price.between(min_price, max_price))

        if type := params.get("type"):
            query = query.filter(Package.package_type == type)

        if permit := params.get("permit"):
            query = query.filter(Package.permit == permit)

        if params.get("is_private") is not None:
            query = query.filter(Package.is_private == params.get("is_private"))

        return query

    def filter_lessons(self, query: Query, **kwargs) -> Query:
        """Filter Lessons

        Args:
            query (Query): Query object

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if name := params.get("name"):
            query = query.filter(Lesson.name.ilike(f"%{name}%"))

        if description := params.get("description"):
            query = query.filter(Lesson.description.ilike(f"%{description}%"))

        if duration := params.get("duration"):
            query = query.filter(Lesson.duration == duration)

        if is_active := params.get("is_active"):
            query = query.filter(Lesson.is_active == is_active)

        if is_online := params.get("is_online"):
            query = query.filter(Lesson.is_online == is_online)

        if price := params.get("price"):
            max_price = price + price * 0.1
            min_price = price - price * 0.1
            query = query.filter(Lesson.price.between(min_price, max_price))

        if lesson_no := params.get("lesson_no"):
            query = query.filter(Lesson.lesson_no == lesson_no)

        return query
