from fastapi import HTTPException, status
from sqlalchemy import nullsfirst
from apps.core.models.availability import Availability
from apps.core.models.users import Users


class AvailabilityMixin:
    def get_availabilities_by_user_id(self, db, user_id, date_filter=None):
        query = db.query(Availability).filter(Availability.user_id == user_id)
        if date_filter is not None:
            query = query.filter(date_filter).order_by(
                nullsfirst(Availability.available_day.asc()),
                Availability.start_time.asc(),
            )
        return query.all()

    def format_availability(self, availability):
        return {
            "id": availability.id,
            "user_id": availability.user_id,
            "user": {
                "id": availability.user.id,
                "first_name": availability.user.first_name,
                "middle_name": availability.user.middle_name,
                "last_name": availability.user.last_name,
                "email": availability.user.email,
                "role": availability.user.role,
            },
            "available_date": availability.available_date,
            "available_day": availability.available_day,
            "start_time": availability.start_time,
            "end_time": availability.end_time,
            "is_booked": availability.is_booked,
            "is_recurring": availability.is_recurring,
            "is_public": availability.is_public,
            "is_active": availability.is_active,
            "notes": availability.notes,
            "city": [
                {
                    "id": city.id,
                    "name": city.name,
                    "state": city.state,
                    "country": city.country,
                    "city_abbreviation": city.city_abbreviation,
                }
                for city in availability.city
            ],
            "vehicle_id": availability.vehicle_id,
            "vehicle": (
                {
                    "id": availability.vehicle.id,
                    "plate_number": availability.vehicle.plate_number,
                    "color": availability.vehicle.color,
                    "brand": availability.vehicle.brand,
                    "model": availability.vehicle.model,
                    "year": availability.vehicle.year,
                    "odometer": availability.vehicle.odometer,
                    "is_available": availability.vehicle.is_available,
                }
                if availability.vehicle
                else None
            ),
            "created_at": availability.created_at,
            "updated_at": availability.updated_at,
            "created_by": {
                "id": availability.created_by.id,
                "first_name": availability.created_by.first_name,
                "middle_name": availability.created_by.middle_name,
                "last_name": availability.created_by.last_name,
            },
            "booking_info": (
                {
                    "booked_by": {
                        "id": availability.appointment_schedules[0].student.id,
                        "first_name": availability.appointment_schedules[
                            0
                        ].student.first_name,
                        "middle_name": availability.appointment_schedules[
                            0
                        ].student.middle_name,
                        "last_name": availability.appointment_schedules[
                            0
                        ].student.last_name,
                        "email": availability.appointment_schedules[0].student.email,
                    },
                    "booking_date": availability.appointment_schedules[0].created_at,
                }
                if availability.is_booked and availability.appointment_schedules
                else None
            ),
        }

    def vehichle_overlap(self, db, availability_data):
        vehicle_overlap_query = (
            db.query(Availability)
            .join(Users, Users.id == Availability.user_id)
            .filter(
                Availability.vehicle_id == availability_data.vehicle_id,
                Availability.id != availability_data.id,
                Availability.user_id != availability_data.user_id,
                Availability.start_time < availability_data.end_time,
                Availability.end_time > availability_data.start_time,
                Availability.is_active == True,  # noqa
                Users.is_active == True,  # noqa

            )
        )

        if availability_data.available_date:
            vehicle_overlap_query = vehicle_overlap_query.filter(
                Availability.available_date == availability_data.available_date
            )

        if availability_data.available_day is not None:
            if availability_data.available_day in [0, 1, 2, 3, 4, 5, 6]:
                vehicle_overlap_query = vehicle_overlap_query.filter(
                    Availability.available_day == availability_data.available_day
                )

        vehicle_overlap = vehicle_overlap_query.first()

        if vehicle_overlap:
            day = self.day_mapper(vehicle_overlap.available_day)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Vehicle is already scheduled from "
                    f"{vehicle_overlap.start_time} to {vehicle_overlap.end_time} "
                    f"on {vehicle_overlap.available_date or str(day)}."
                    f"by instructor {vehicle_overlap.user.first_name} {vehicle_overlap.user.last_name}"
                ),
            )

    @staticmethod
    def day_mapper(x):
        day_dict = {
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednesday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        }
        return day_dict.get(x, "Invalid day")
