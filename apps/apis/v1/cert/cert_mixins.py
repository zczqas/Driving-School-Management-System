from datetime import date
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from apps.core.schemas.cert import CertCreateSchema
from apps.core.models.cert import Cert
from apps.core.models.users import Profile


class CertMixins:
    @staticmethod
    def compare_user_profiles_id_instructor_id(cert: CertCreateSchema):
        user_profiles_id = cert.user_profiles_id
        instructor_id = cert.instructor_id
        if user_profiles_id == instructor_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User and instructor cannot be the same",
            )

    @staticmethod
    def existing_certificate(db: Session, profile_id: int):
        user_cert = db.query(Cert).filter(Cert.user_profiles_id == profile_id).first()
        if user_cert:
            return True
        return False

    @staticmethod
    def check_user_age(profile: Profile) -> bool:
        today = date.today()
        age = (
            today.year
            - profile.dob.year
            - ((today.month, today.day) < (profile.dob.month, profile.dob.day))
        )
        if age > 18:
            return True

        return False

    @staticmethod
    def cert_database_operation(db: Session, cert: CertCreateSchema):
        try:
            new_cert = Cert(
                user_profiles_id=cert.user_profiles_id,
                instructor_id=cert.instructor_id,
                status=cert.status,
                issued_date=cert.issued_date,
                certificate_type=cert.certificate_type,
            )
            db.add(new_cert)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Error: {e}"
            ) from e

    @classmethod
    def create_cert(cls, db: Session, cert: CertCreateSchema):
        cls.compare_user_profiles_id_instructor_id(cert)
        profile = db.query(Profile).filter(Profile.id == cert.user_profiles_id).first()
        if not profile:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
        cls.cert_database_operation(db, cert)
