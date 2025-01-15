from sqlalchemy.orm import Query, aliased

from apps.apis.v1.appointment.helper import calculate_two_working_weeks
from apps.core.models.users import (
    InstructorAvailability,
    StudentAppointment,
    Users,
)
from apps.common.filter_sort import Sort


class FilterAppointment:
    def filter_appointment(self, query: Query, **kwargs) -> Query:
        """Filter Appointment Function"""
        params = kwargs
        student = aliased(Users)
        instructor = aliased(Users)

        if appointment_id := params.get("appointment_id"):
            query = query.filter(StudentAppointment.id == appointment_id)

        if student_id := params.get("student_id"):
            query = query.filter(StudentAppointment.student_id == student_id)

        if student_name := params.get("student_name"):
            query = query.join(student, student.id == StudentAppointment.student_id)
            query = query.filter(student.first_name.ilike(f"%{student_name}%"))

        if instructor_id := params.get("instructor_id"):
            query = query.filter(StudentAppointment.instructor_id == instructor_id)

        if instructor_name := params.get("instructor_name"):
            query = query.join(
                instructor, instructor.id == StudentAppointment.instructor_id
            )
            query = query.filter(instructor.first_name.ilike(f"%{instructor_name}%"))

        if name := params.get("name"):
            query = query.join(student, student.id == StudentAppointment.student_id)
            query = query.join(
                instructor, instructor.id == StudentAppointment.instructor_id
            )
            query = query.filter(
                (student.first_name.ilike(f"%{name}%"))
                | (instructor.first_name.ilike(f"%{name}%"))
            )

        if appointment_date := params.get("appointment_date"):
            query = query.filter(
                StudentAppointment.appointment_date == appointment_date
            )

        if appointment_date_from := params.get("appointment_date_from"):
            two_weeks = calculate_two_working_weeks(appointment_date_from)
            query = query.filter(
                StudentAppointment.appointment_date.between(
                    appointment_date_from, two_weeks
                )
            )

        if start_time := params.get("start_time"):
            query = query.filter(StudentAppointment.start_time == start_time)

        if end_time := params.get("end_time"):
            query = query.filter(StudentAppointment.end_time == end_time)

        # if lesson_id := params.get("lesson_id"):
        #     query = query.filter(StudentAppointment.lesson_id == lesson_id)

        # if vehicle_id := params.get("vehicle_id"):
        #     query = query.filter(StudentAppointment.vehicle_id == vehicle_id)

        # if city_id := params.get("city_id"):
        #     query = query.filter(StudentAppointment.city_id == city_id)

        # if pickup_location_id := params.get("pickup_location_id"):
        #     query = query.filter(
        #         StudentAppointment.pickup_location_id == pickup_location_id
        #     )

        # if status_id := params.get("status_id"):
        #     query = query.filter(StudentAppointment.status_id == status_id)

        return query


class SortAppointment:
    def sorting_appointment(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "appointment_date": StudentAppointment.appointment_date,
            "start_time": StudentAppointment.start_time,
            "end_time": StudentAppointment.end_time,
            "created_at": StudentAppointment.created_at,
            # "updated_at": StudentAppointment.updated_at,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)

    def sort_instructor_availability(
        self, query: Query, sort: str, order: str
    ) -> Query:
        sorting_options = {
            "availability_date": InstructorAvailability.availability_date,
            "start_time": InstructorAvailability.start_time,
            "end_time": InstructorAvailability.end_time,
            "created_at": InstructorAvailability.created_at,
            "updated_at": InstructorAvailability.updated_at,
            "instructor_id": InstructorAvailability.instructor_id,
        }

        return Sort().generic_sorting(query, sort, order, sorting_options)
