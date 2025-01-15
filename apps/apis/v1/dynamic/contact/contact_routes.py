from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.params import Form
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.dynamic.contact import ContactForm

router = APIRouter(prefix="/contact/form", tags=["contact"])


@router.get("/get")
def get_all_contact_submissions(
    offset: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    contacts = db.query(ContactForm).offset(offset).limit(limit).all()

    return {
        "total": len(contacts),
        "contact_form": [
            {
                "id": contact.id,
                "name": contact.name,
                "email": contact.email,
                "phone": contact.phone,
                "message": contact.message,
                "created_at": contact.created_at,
                "updated_at": contact.updated_at,
            }
            for contact in contacts
        ],
    }


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_contact_form(
    name: Optional[str] = Form(None),  # type: ignore
    email: Optional[str] = Form(None),  # type: ignore
    phone: Optional[str] = Form(None),  # type: ignore
    message: Optional[str] = Form(None),  # type: ignore
    db: Session = Depends(get_db),
):
    contact_form = ContactForm(
        name=name,
        email=email,
        phone=phone,
        message=message,
    )

    try:
        db.add(contact_form)
        db.commit()
        return {"message": "Contact query submitted successfully."}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong. Please try again.",
        ) from e
