from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.apis.v1.users.filter_sort import FilterUser, SortUser
from apps.common.enum import OrderEnum, RoleEnum, UserSortEnum
from apps.config.db.conn import get_db
from apps.core.models.users import Users
from apps.core.schemas.user import UserResponseSchemaTotal
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service


router = APIRouter(prefix="/instructor", tags=["instructor"])


@router.post("/{instructor_id}/create-student/{user_id}")
# @check_role_permissions(["CSR", "ADMIN"])
def create_student(
    instructor_id: int,
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to create student profile(for CSR, ADMIN)

    Args:
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    instructor = db.query(Users).filter(Users.id == instructor_id).first()

    if instructor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found"
        )

    student = db.query(Users).filter(Users.id == user_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    try:
        student.instructor_id = instructor.id
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Student added successfully"}


@router.get("/get", response_model=UserResponseSchemaTotal)
# @check_role_permissions(["INSTRUCTOR"]) # Disabled for now
def list_students(
    offset: int = 0,
    limit: int = 10,
    first_name: Optional[str] = None,
    email: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    zip_code: Optional[str] = None,
    order: OrderEnum = OrderEnum.DESC,
    sort: UserSortEnum = UserSortEnum.UPDATED_AT,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to list students for logged in instructor

    Args:
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    user = jwt_service.get_user(email=current_user.email, db=db)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    if user.role == RoleEnum.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, detail="You are not an instructor"
        )

    query = db.query(Users).filter(Users.instructor_id == user.id)

    filter_params = {
        "first_name": first_name,
        "email": email,
        "city": city,
        "state": state,
        "zip_code": zip_code,
        "role": RoleEnum.STUDENT,
    }

    query = FilterUser().filter_users(query, **filter_params)
    query = SortUser().sorting_users(query=query, sort=sort, order=order)

    total_count = query.with_entities(Users.id).count()

    response = {
        "total_count": total_count,
        "users": query.offset(offset).limit(limit).all(),
    }

    return response


@router.delete("/{instructor_id}/remove/student/{user_id}")
# @check_role_permissions(["CSR", "ADMIN", "INSTRUCTOR"])
def remove_student_from_instructor(
    instructor_id: int,
    user_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    Router to remove student from instructor

    Args:
        db (Session, optional): CTX. Defaults to Depends(get_db).
    """

    instructor = db.query(Users).filter(Users.id == instructor_id).first()

    if instructor is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Instructor not found"
        )

    student = db.query(Users).filter(Users.id == user_id).first()

    if student is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student not found"
        )

    try:
        setattr(student, "instructor_id", None)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{str(e)}"
        ) from e

    return {"message": "Student removed successfully"}
