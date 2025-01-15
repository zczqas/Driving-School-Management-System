from sqlalchemy import extract, not_, or_
from sqlalchemy.orm import Query

from apps.common.filter_sort import Sort

# from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.availability import Availability
from apps.core.models.city import City


class FilterAvailability:
    def filter_availability_schedule(self, query: Query, **kwargs) -> Query:
        params = kwargs

        if available_date := params.get("available_date"):
            query = query.filter(
                or_(
                    Availability.available_date == available_date,
                    Availability.available_date == None,  # noqa
                )
            )
        if start_time := params.get("start_time"):
            query = query.filter(Availability.start_time == start_time)
        if end_time := params.get("end_time"):
            query = query.filter(Availability.end_time == end_time)
        if "available_day" in params:
            available_day = params["available_day"]
            query = query.filter(Availability.available_day == available_day)
        # if city_id := params.get("city_id"):
        #     query = query.join(Availability.city).filter(City.id == city_id)
        if created_by_id := params.get("created_by_id"):
            query = query.filter(Availability.created_by_id == created_by_id)
        is_booked = params.get("is_booked")
        if is_booked is False:
            query = query.filter(
                not_(
                    Availability.id.in_(
                        query.join(
                            AppointmentSchedule,
                            AppointmentSchedule.availability_id == Availability.id,
                        )
                        .filter(
                            AppointmentSchedule.scheduled_date
                            == params.get("available_date")
                        )
                        .with_entities(AppointmentSchedule.availability_id)
                    )
                )
            )
        if is_recurring := params.get("is_recurring"):
            query = query.filter(Availability.is_recurring == is_recurring)
        if is_public := params.get("is_public"):
            query = query.filter(Availability.is_public == is_public)
        if month := params.get("month"):
            if month > 0 and month < 13:
                query = query.filter(
                    or_(
                        extract("month", Availability.available_date) == month,
                        Availability.available_date == None,  # noqa
                    )
                )
        if is_deleted := params.get("is_deleted"):
            query = query.filter(Availability.is_deleted == is_deleted)
        if from_ := params.get("from_"):
            query = query.filter(Availability.from_ >= from_)
        if to_ := params.get("to_"):
            query = query.filter(Availability.to_ <= to_)
        return query


class SortAvailability:
    def sorting_availability_schedule(
        self, query: Query, sort: str, order: str
    ) -> Query:
        sorting_options = {
            "available_date": Availability.available_date,
            "available_day": Availability.available_day,
            "start_time": Availability.start_time,
            "end_time": Availability.end_time,
            "city_id": City.id,
            "created_at": Availability.created_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)
