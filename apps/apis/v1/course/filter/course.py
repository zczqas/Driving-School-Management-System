from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.course.course import (
    Course,
    CourseLesson,
    CourseSubunit,
    CourseUnit,
)


class SortCourse:
    def sorting_course(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "id": Course.id,
            "unit_id": CourseUnit.id,
            "lesson_id": CourseLesson.id,
            "subunit_id": CourseSubunit.id,
        }

        if sort not in sorting_options:
            sort = "id"

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterCourse:
    def filter_course(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if id := params.get("id"):
            query = query.filter(Course.id == id)

        if title := params.get("title"):
            query = query.filter(Course.title.ilike(f"%{title}%"))

        return query
