from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.certificate import Certificate, UserCertificate


class FilterCertificate:
    def filter_dmv_certificate(self, query: Query, **kwargs) -> Query:
        params = kwargs

        if certificate_id := params.get("certificate_id"):
            query = query.filter(Certificate.id == certificate_id)
        if certificate_type := params.get("certificate_type"):
            query = query.filter(Certificate.certificate_type == certificate_type)
        if batch_id := params.get("batch_id"):
            query = query.filter(Certificate.batch_id == batch_id)
        if certificate_number := params.get("certificate_number"):
            query = query.filter(Certificate.certificate_number == certificate_number)
        if is_assigned := params.get("is_assigned"):
            query = query.filter(Certificate.is_assigned == is_assigned)
        if status := params.get("status"):
            if status != "ALL":
                query = query.filter(Certificate.status == status)

        return query

    def filter_user_certificate(self, query: Query, **kwargs) -> Query:
        params = kwargs

        if user_profile_id := params.get("user_profile_id"):
            query = query.filter(UserCertificate.user_profiles_id == user_profile_id)
        if certificate_id := params.get("certificate_id"):
            query = query.filter(UserCertificate.certificate_id == certificate_id)
        if assigned_date := params.get("assigned_date"):
            query = query.filter(UserCertificate.assigned_date == assigned_date)
        if issued_date := params.get("issued_date"):
            query = query.filter(UserCertificate.issued_date == issued_date)
        if status := params.get("status"):
            if status != "ALL":
                query = query.filter(UserCertificate.status == status)
        if certificate_type := params.get("certificate_type"):
            query = query.join(Certificate).filter(
                Certificate.certificate_type == certificate_type
            )

        return query


class SortCertificate:
    def sorting_dmv_certificate(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "id": Certificate.id,
            "certificate_number": Certificate.certificate_number,
            "is_assigned": Certificate.is_assigned,
            "created_at": Certificate.created_at,
            "batch_id": Certificate.batch_id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)

    def sorting_user_certificate(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "certificate_id": UserCertificate.certificate_id,
            "user_profiles_id": UserCertificate.user_profiles_id,
            "assigned_date": UserCertificate.assigned_date,
            "issued_date": UserCertificate.issued_date,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)
