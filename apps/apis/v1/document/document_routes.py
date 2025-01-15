import os
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.config.settings import MEDIA_PATH
from apps.core.models import Profile
from apps.core.models.users import Document, Users
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service

router = APIRouter(prefix="/document", tags=["document"])


@router.post("/post/{user_id}")
def add_user_document(
    user_id: int,
    document_img: UploadFile = File(...),
    name: str = Form(None),
    description: str = Form(None),
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
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

    # Ensuring the file is a pdf
    if document_img.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document must be a pdf format",
        )

    # File size should not exceed 5MB
    if document_img.file.__sizeof__() > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Document size should not exceed 5MB",
        )

    try:
        document_img.filename = (
            f"{MEDIA_PATH}/{user.id}_{uuid4()}_{document_img.filename}"
        )

        with open(f"{document_img.filename}", "wb") as file:
            file.write(document_img.file.read())
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error saving document: {str(e)}",
        ) from e

    try:
        new_document = Document(
            user_profiles_id=user_profile.id,
            document_url=document_img.filename,
            name=name,
            description=description,
            created_by_id=current_user.id,
        )
        db.add(new_document)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Document uploaded successfully"}


@router.delete("/delete/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_document(
    document_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    # Check if the user has the permission to delete the document
    # This is disabled for now might be enabled later according to the requirements

    # user = (
    #     db.query(Document)
    #     .filter(Document.user_profiles_id == current_user.id)
    #     .first()
    # )

    # if user is None:
    #     raise HTTPException(
    #         status_code=status.HTTP_401_UNAUTHORIZED,
    #         detail="You are not authorized to perform this action"
    #     )

    document = db.query(Document).filter(Document.id == document_id).first()

    if document is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Document not found"
        )

    try:
        os.remove(document.document_url)  # type: ignore
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting document: {str(e)}",
        ) from e

    try:
        db.delete(document)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "Document deleted successfully"}
