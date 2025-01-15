from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from apps.apis.v1.users.filter_sort import FilterUser, SortUser
from apps.config.db.conn import get_db
from apps.core.models.appointment_schedule import AppointmentSchedule
from apps.core.models.users import InstructorNotes, Profile, StudentAppointment, Users
from apps.core.schemas.instructor_notes import (
    InstructorNotesCreateSchema,
    InstructorNotesFilterSchema,
    InstructorNotesResponseSchema,
    InstructorNotesResponseSchemaTotal,
    InstructorNotesUpdateSchema,
)

# from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service

router = APIRouter(prefix="/profile", tags=["profile"])


@router.post("/instructor_note/create")
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"]) # Disabled for now
def create_instructor_notes_for_student(
    notes: InstructorNotesCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    schedule = (
        db.query(AppointmentSchedule)
        .filter(AppointmentSchedule.id == notes.appointment_schedule_id)
        .first()
    )
    if not schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment schedule not found",
        )

    student = db.query(Users).filter(Users.id == notes.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    profile = student.profile
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    try:
        note = InstructorNotes(
            note=notes.note,
            instructor_id=current_user.profile.id,
            student_id=profile.id,
            appointment_schedule_id=schedule.id,
        )

        db.add(note)
        db.commit()
        db.refresh(note)
        return {"message": "Note created successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating note: {str(e)}",
        ) from e


@router.get("/instructor_note", response_model=InstructorNotesResponseSchemaTotal)
def get_instructor_notes(
    offset: int = 0,
    limit: int = 10,
    notes_filter_params: InstructorNotesFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(InstructorNotes)

    filter_params = notes_filter_params.model_dump(exclude_unset=True)

    query = FilterUser().filter_instructor_notes_for_user(query, **filter_params)
    query = SortUser().sorting_instructor_notes_for_user(
        query=query, sort=notes_filter_params.sort, order=notes_filter_params.order
    )

    total_count = query.with_entities(InstructorNotes.id).count()

    return {
        "total": total_count,
        "instructor_notes": query.offset(offset).limit(limit).all(),
    }


@router.get(
    "/instructor_note/{student_id}", response_model=list[InstructorNotesResponseSchema]
)
def get_instructor_notes_for_student(
    student_id: int,
    db: Session = Depends(get_db),
):
    student = db.query(Users).filter(Users.id == student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found",
        )

    profile = db.query(Profile).filter(Profile.id == student.profile.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found",
        )

    instructor_notes = (
        db.query(InstructorNotes).filter(InstructorNotes.student_id == profile.id).all()
    )

    return instructor_notes


@router.put("/instructor_note/{note_id}")
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"])
def update_instructor_notes_for_student(
    note_id: int,
    notes: InstructorNotesUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(InstructorNotes).filter(InstructorNotes.id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    if notes.appointment_schedule_id:
        appointment = (
            db.query(StudentAppointment)
            .filter(StudentAppointment.id == notes.appointment_schedule_id)
            .first()
        )
        if not appointment:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Appointment schedule not found",
            )

    if notes.student_id:
        user = db.query(Profile).filter(Profile.id == notes.student_id).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

    try:
        for attr in vars(notes):
            if getattr(notes, attr) is not None:
                setattr(note, attr, getattr(notes, attr))

        db.add(note)
        db.commit()
        db.refresh(note)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating note: {str(e)}",
        ) from e

    return {"message": "Note updated successfully"}


@router.delete("/instructor_note/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
# @check_role_permissions(["ADMIN", "CSR", "INSTRUCTOR"])
def delete_instructor_notes_for_student(
    note_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    note = db.query(InstructorNotes).filter(InstructorNotes.id == note_id).first()

    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )

    try:
        db.delete(note)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting note: {e}",
        ) from e

    return {"message": "Note deleted successfully"}
