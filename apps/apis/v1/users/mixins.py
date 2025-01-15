from typing import Any, List, Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from apps.core.models import Profile
from apps.core.models.pickup_location import PickupLocation
from apps.core.models.school_organization import DrivingSchool
from apps.core.models.users import (
    AdditionalRole,
    ContactInformation,
    PermitInformation,
    UserDrivingSchool,
    Users,
)
from apps.core.schemas.profile import (
    AdditionalRoleUpdateSchema,
    ContactInformationProfileSchema,
    UserProfileUpdateSchema,
)


def update_user_driving_school(
    user_id: int,
    driving_school_id: int,
    db: Session,
) -> UserDrivingSchool:
    driving_school_exists = (
        db.query(DrivingSchool).filter(DrivingSchool.id == driving_school_id).first()
    )
    if not driving_school_exists:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Driving School with id {driving_school_id} not found",
        )

    existing_record = db.query(UserDrivingSchool).filter_by(user_id=user_id).first()
    if existing_record is not None:
        db.delete(existing_record)
        db.commit()

    new_record = UserDrivingSchool(user_id=user_id, driving_school_id=driving_school_id)
    db.add(new_record)
    return new_record


def update_user_profile(
    user_id: int,
    updated_data: UserProfileUpdateSchema,
    db: Session,
    current_user: Optional[Any] = None,
):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    user_profile = db.query(Profile).filter(Profile.user_id == user.id).first()
    if user_profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found"
        )

    try:
        user_fields = [
            "first_name",
            "middle_name",
            "last_name",
            "role",
            "school_id",
            "is_active",
        ]
        for field in user_fields:
            if (
                hasattr(updated_data, field)
                and getattr(updated_data, field) is not None
            ):
                setattr(user, field, getattr(updated_data, field))

        profile_fields = [
            "cell_phone",
            "gender",
            "dob",
            "address",
            "apartment",
            "city",
            "state",
            "zip_code",
            "office_note",
        ]
        for field in profile_fields:
            if (
                hasattr(updated_data, field)
                and getattr(updated_data, field) is not None
            ):
                setattr(user_profile, field, getattr(updated_data, field))

        if updated_data.is_active is not None:
            user_profile.is_active = updated_data.is_active  # type: ignore
        db.add(user)
        db.add(user_profile)

        # Check if any pickup location field is updated
        if any(
            [
                updated_data.pickup_location_address is not None,
                updated_data.pickup_location_name is not None,
                updated_data.pickup_location_title is not None,
                updated_data.pickup_location_apartment is not None,
                updated_data.pickup_location_city is not None,
                updated_data.pickup_location_type_id is not None,
            ]
        ):
            update_pickup_location(db, user_profile, updated_data)

        if updated_data.contacts:
            update_contacts(db, user_profile, updated_data.contacts)
        if not (updated_data.permit_number is None or updated_data.permit_number == ""):
            update_permit_information(db, user, updated_data)
        if updated_data.additional_roles:
            updated_additional_roles(db, user, updated_data.additional_roles, user.id)  # type: ignore
        if updated_data.driving_school_id:
            for driving_school_id in updated_data.driving_school_id:
                driving_school_db = update_user_driving_school(
                    user.id, driving_school_id, db
                )
                db.add(driving_school_db)

        db.commit()
    except HTTPException as e:
        db.rollback()
        raise e
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=str(e)
        ) from e

    return {"message": f"Profile of {user.first_name} updated successfully"}


def update_pickup_location(
    db: Session, user_profile: Profile, updated_data: UserProfileUpdateSchema
):
    if updated_data.pickup_location_address is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Pickup location address is required",
        )
    pickup_location_check = (
        db.query(PickupLocation)
        .filter(PickupLocation.address.ilike(updated_data.pickup_location_address))
        .first()
    )

    pickup_location = pickup_location_check or PickupLocation()

    try:
        pickup_location_data = updated_data.model_dump(
            exclude_unset=True,
            include={
                "pickup_location_title",
                "pickup_location_name",
                "pickup_location_address",
                "pickup_location_apartment",
                "pickup_location_city",
                "pickup_location_type_id",
            },
        )
        pickup_location_data["user_id"] = user_profile.id
        pickup_location_data["title"] = pickup_location_data.get(
            "pickup_location_title"
        )
        pickup_location_data["name"] = pickup_location_data.get("pickup_location_name")
        pickup_location_data["address"] = pickup_location_data.get(
            "pickup_location_address"
        )
        pickup_location_data["apartment"] = pickup_location_data.get(
            "pickup_location_apartment"
        )
        pickup_location_data["city"] = pickup_location_data.get("pickup_location_city")
        for key, value in pickup_location_data.items():
            setattr(pickup_location, key, value)

        db.add(pickup_location)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating pickup location: {str(e)}",
        ) from e


def update_contacts(
    db: Session,
    user_profile: Profile,
    contacts_data: List[ContactInformationProfileSchema],
):
    for contact_data in contacts_data:
        if contact_data.contact_type in [
            "FIRST_EMERGENCY_CONTACT",
            "SECOND_EMERGENCY_CONTACT",
        ]:
            contact_check = (
                db.query(ContactInformation)
                .filter(
                    ContactInformation.user_id == user_profile.id,
                    ContactInformation.contact_type == contact_data.contact_type,
                )
                .first()
            )

            try:
                if contact_check:
                    for key, value in contact_data.model_dump(
                        exclude_unset=True
                    ).items():
                        if value:
                            setattr(contact_check, key, value)
                else:
                    contact_data = contact_data.model_dump(exclude_unset=True)
                    contact_data["user_id"] = user_profile.id
                    contact = ContactInformation(**contact_data)
                    db.add(contact)
            except Exception as e:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Error updating contact: {str(e)}",
                ) from e


def update_permit_information(
    db: Session, user: Users, updated_data: UserProfileUpdateSchema
):
    if not all(
        [
            updated_data.permit_issue_date,
            updated_data.permit_expiration_date,
        ]
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Permit issue date, permit expiration date are required",
        )

    try:
        permit_information = (
            db.query(PermitInformation)
            .filter(PermitInformation.user_id == user.id)
            .first()
            or PermitInformation()
        )

        attributes = [
            "permit_number",
            "permit_issue_date",
            "permit_expiration_date",
            "permit_endorse_date",
            "permit_endorse_by_id",
        ]

        for attr in attributes:
            value = getattr(updated_data, attr, None)
            if value is not None:
                setattr(permit_information, attr, value)
        permit_information.user_id = user.id

        db.add(permit_information)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error Updating Permit Information: {str(e)}",
        ) from e


def updated_additional_roles(
    db: Session,
    user: Users,
    additional_roles: List[AdditionalRoleUpdateSchema],
    user_id: int,
):
    try:
        for role in additional_roles:
            role_check = (
                db.query(AdditionalRole)
                .filter(
                    AdditionalRole.user_id == user_id,
                )
                .first()
            )
            if role_check:
                db.query(AdditionalRole).filter(
                    AdditionalRole.user_id == user_id
                ).delete()
                db.commit()
            additional_role = AdditionalRole(
                user_id=user_id,
                role=role.role,
            )
            db.add(additional_role)
            db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating additional roles: {str(e)}",
        ) from e
