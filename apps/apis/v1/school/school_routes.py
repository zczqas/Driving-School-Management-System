from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session
from apps.apis.v1.school.filter_sort import FilterSchool, SortSchool

from apps.config.db.conn import get_db
from apps.core.models.school_organization import School
from apps.core.schemas.school_organization import (
    SchoolFilterSchema,
    SchoolOrganizationCreate,
    SchoolResponseSchema,
    SchoolResponseSchemaTotal,
    SchoolUpdateSchema,
)
from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service


router = APIRouter(prefix="/school", tags=["school"])


@router.post("/create")
def create_school(school_data: SchoolOrganizationCreate, db: Session = Depends(get_db)):
    if not school_data.name:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="School name is required"
        )

    school_exist = db.query(School).filter(School.name == school_data.name).first()

    if school_exist:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="School already exist"
        )

    school = School(**school_data.model_dump())

    try:
        db.add(school)
        db.commit()
        db.refresh(school)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School created successfully"}


@router.get("/get", response_model=SchoolResponseSchemaTotal)
# @router.get("/get")
def get_school(
    offset: int = 0,
    limit: int = 10,
    school_filter: SchoolFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    school = db.query(School)

    filter_params = school_filter.model_dump(exclude_none=True)

    query = FilterSchool().filter_school(school, **filter_params)
    query = SortSchool().sort_school(
        query=query, sort=school_filter.sort, order=school_filter.order
    )

    total = query.with_entities(School.id).count()

    response = {
        "total_count": total,
        "school": query.limit(limit).offset(offset).all(),
    }

    return response


@router.get("/get/{school_id}", response_model=SchoolResponseSchema)
def get_school_by_id(
    school_id: int,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()

    if getattr(school, "is_deleted"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    return school


@router.put("/update/{school_id}")
def update_school(
    school_id: int,
    school_data: SchoolUpdateSchema,
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()
    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    try:
        for attr in vars(school_data):
            if getattr(school_data, attr) is not None:
                setattr(school, attr, getattr(school_data, attr))

        db.add(school)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School updated successfully"}


@router.delete("/delete/{school_id}")
# @check_role_permissions(["ADMIN"])
def delete_school(
    school_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    school = db.query(School).filter(School.id == school_id).first()

    if not school:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="School not found"
        )

    try:
        db.delete(school)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e)
        ) from e

    return {"message": "School deleted successfully"}
