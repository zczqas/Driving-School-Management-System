from sqlalchemy import or_
from sqlalchemy.orm import Query

from apps.common.enum import RoleEnum, RoleFilterEnum
from apps.common.filter_sort import Sort
from apps.core.models.users import (
    AdditionalRole,
    InstructorNotes,
    UserDrivingSchool,
    Users,
)


class SortUser:
    def sorting_users(self, query: Query, sort: str, order: str) -> Query:
        sorting_options = {
            "created_at": Users.created_at,
            "updated_at": Users.updated_at,
            "first_name": Users.first_name,
        }
        return Sort().generic_sorting(query, sort, order, sorting_options)

    def sorting_instructor_notes_for_user(
        self, query: Query, sort: str, order: str
    ) -> Query:
        sorting_options = {
            "created_at": InstructorNotes.created_at,
            "updated_at": InstructorNotes.updated_at,
            "instructor_id": InstructorNotes.instructor_id,
            "student_id": InstructorNotes.student_id,
            "appointment_schedule_id": InstructorNotes.appointment_schedule_id,
        }
        return Sort().generic_sorting(query, sort, order, sorting_options)


class FilterUser:
    def filter_users(self, query: Query, **kwargs) -> Query:
        """Filter users based on query params

        Args:
            query (Query): Query object
            **kwargs: Query params

        Returns:
            Query: Filtered query
        """
        params = kwargs

        if name := params.get("name"):
            query = query.filter(
                or_(
                    Users.first_name.ilike(f"%{name}%"),
                    Users.last_name.ilike(f"%{name}%"),
                    Users.email.ilike(f"%{name}%"),
                    (Users.first_name + " " + Users.last_name).ilike(f"%{name}%"),
                    (Users.last_name + " " + Users.first_name).ilike(f"%{name}%"),
                )
            )

        if first_name := params.get("first_name"):
            query = query.filter(Users.first_name.ilike(f"%{first_name}%"))

        if email := params.get("email"):
            query = query.filter(Users.email.ilike(f"%{email}%"))

        if role := params.get("role"):
            if role == RoleFilterEnum.ALL:
                pass
            elif role is RoleFilterEnum.NOT_STUDENT:
                query = query.filter(
                    or_(
                        Users.role != RoleEnum.STUDENT,
                        Users.additional_roles.any(
                            AdditionalRole.role != RoleEnum.STUDENT
                        ),
                    )
                )
            else:
                query = query.filter(
                    or_(
                        Users.role == role,
                        Users.additional_roles.any(AdditionalRole.role == role),
                    )
                )

        if driving_school_id := params.get("driving_school_id"):
            query = query.join(UserDrivingSchool).filter(
                UserDrivingSchool.driving_school_id == driving_school_id
            )

        if params.get("is_active") is not None:
            query = query.filter(Users.is_active == params.get("is_active"))

        if is_verified := params.get("is_verified"):
            query = query.filter(Users.is_verified == is_verified)

        return query

    def filter_instructor_notes_for_user(self, query: Query, **kwargs) -> Query:

        params = kwargs

        if notes_id := params.get("notes_id"):
            query = query.filter(InstructorNotes.id == notes_id)

        if student_id := params.get("student_id"):
            query = query.filter(InstructorNotes.student_id == student_id)

        if instructor_id := params.get("instructor_id"):
            query = query.filter(InstructorNotes.instructor_id == instructor_id)

        if appointment_schedule_id := params.get("appointment_schedule_id"):
            query = query.filter(
                InstructorNotes.appointment_schedule_id == appointment_schedule_id
            )

        return query
