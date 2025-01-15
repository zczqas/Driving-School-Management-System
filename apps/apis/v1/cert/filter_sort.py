from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.cert import Cert


class SortCert:
    def sorting_cert(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "user_profiles_id": Cert.user_profiles_id,
            "certificate_id": Cert.certificate_id,
            "instructor_id": Cert.instructor_id,
            "status": Cert.status,
            "certificate_type": Cert.certificate_type,
            "assigned_date": Cert.assigned_date,
            "issued_date": Cert.issued_date,
            "certificate_id": Cert.certificate_id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterCert:
    def filter_cert(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if user_profiles_id := params.get("user_profiles_id"):
            query = query.filter(Cert.user_profiles_id == user_profiles_id)
        if instructor_id := params.get("instructor_id"):
            query = query.filter(Cert.instructor_id == instructor_id)
        if status := params.get("status"):
            query = query.filter(Cert.status == status)
        if certificate_type := params.get("certificate_type"):
            query = query.filter(Cert.certificate_type == certificate_type)
        if assigned_date := params.get("assigned_date"):
            query = query.filter(Cert.assigned_date == assigned_date)
        if issued_date := params.get("issued_date"):
            query = query.filter(Cert.issued_date == issued_date)

        return query
