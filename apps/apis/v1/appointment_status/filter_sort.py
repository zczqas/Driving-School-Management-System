from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort
from apps.core.models.appointment_status import AppointmentStatus


class SortAppointmentStatus:
    def sorting_statuses(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": AppointmentStatus.created_at,
            "updated_at": AppointmentStatus.updated_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)
