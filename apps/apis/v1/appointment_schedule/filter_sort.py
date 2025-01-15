# flake8: noqa

from sqlalchemy import extract
from sqlalchemy.orm import Query

from apps.apis.v1.appointment_schedule.appointment_schedule_mixins import (
    AppointmentScheduleFilterMixins,
    AppointmentScheduleMixins,
)
from apps.common.filter_sort import Sort
from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.availability import Availability


class FilterAppointmentSchedule:
    def filter_appointment_schedule(self, query: Query, **kwargs) -> Query:
        params = kwargs

        if name := params.get("name"):
            query = AppointmentScheduleFilterMixins.join_users_availability_table(query)
            query = query.filter(
                AppointmentScheduleFilterMixins.student.first_name.ilike(f"%{name}%")
                | AppointmentScheduleFilterMixins.instructor.first_name.ilike(
                    f"%{name}%"
                )
                | AppointmentScheduleFilterMixins.student.last_name.ilike(f"%{name}%")
                | AppointmentScheduleFilterMixins.instructor.last_name.ilike(
                    f"%{name}%"
                )
                | AppointmentScheduleFilterMixins.student.email.ilike(f"%{name}%")
                | AppointmentScheduleFilterMixins.instructor.email.ilike(f"%{name}%")
            )
        if email := params.get("email"):
            query = AppointmentScheduleFilterMixins.join_users_availability_table(query)
            query = query.filter(
                (AppointmentScheduleFilterMixins.student.email.ilike(f"%{email}%"))
                | (AppointmentScheduleFilterMixins.instructor.email.ilike(f"%{email}%"))
            )
        if student_id := params.get("student_id"):
            query = query.filter(AppointmentSchedule.student_id == student_id)
        if instructor_id := params.get("instructor_id"):
            query = query.join(Availability).filter(
                Availability.user_id == instructor_id
            )
        if availability_id := params.get("availability_id"):
            query = query.filter(AppointmentSchedule.availability_id == availability_id)
        if driving_school_id := params.get("driving_school_id"):
            query = query.filter(
                AppointmentSchedule.driving_school_id == driving_school_id
            )
        if lesson_id := params.get("lesson_id"):
            query = query.filter(AppointmentSchedule.lesson_id == lesson_id)
        if package_id := params.get("package_id"):
            query = query.filter(AppointmentSchedule.package_id == package_id)
        if pickup_location_id := params.get("pickup_location_id"):
            query = query.filter(
                AppointmentSchedule.pickup_location_id == pickup_location_id
            )
        if pickup_location_type_id := params.get("pickup_location_type_id"):
            query = query.filter(
                AppointmentSchedule.pickup_location_type_id == pickup_location_type_id
            )
        if created_by_id := params.get("created_by_id"):
            query = query.filter(AppointmentSchedule.created_by_id == created_by_id)
        if city_id := params.get("city_id"):
            query = query.join(AppointmentSchedule.availability).filter(
                Availability.city.any(id=city_id)
            )
        if month := params.get("month"):
            query = query.filter(
                extract("month", AppointmentSchedule.scheduled_date) == month
            )
        if scheduled_date := params.get("scheduled_date"):
            query = query.filter(AppointmentSchedule.scheduled_date == scheduled_date)
        if scheduled_date_from := params.get("scheduled_date_from"):
            two_weeks = AppointmentScheduleMixins().calculate_two_working_weeks(
                scheduled_date_from
            )
            query = query.filter(
                AppointmentSchedule.scheduled_date.between(
                    AppointmentSchedule, two_weeks
                )
            )
        if available_date := params.get("available_date"):
            query = query.join(AppointmentSchedule.availability).filter(
                Availability.available_date == available_date
            )
        if status := params.get("status"):
            query = query.filter(AppointmentSchedule.status.ilike(status))
        if status_id := params.get("status_id"):
            query = query.filter(AppointmentSchedule.status_id == status_id)

        return query


class SortAppointmentSchedule:
    def sorting_appointment_schedule(
        self, query: Query, sort: str, order: str
    ) -> Query:
        sorting_options = {
            "lesson_id": AppointmentSchedule.lesson_id,
            "package_id": AppointmentSchedule.package_id,
            "created_at": AppointmentSchedule.created_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)
