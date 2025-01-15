from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from apps.rbac.role_permission_decorator import check_role_permissions
from apps.apis.v1.training.filter_sort import FilterTraining, SortTraining
from apps.core.models.training import Training
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db
from apps.core.schemas.training import (
    TrainingCreateSchema,
    TrainingFilterSchema,
    TrainingResponseSchema,
    TrainingUpdateSchema,
    TrainingResponseSchemaTotal,
)

router = APIRouter(prefix="/training", tags=["training"])


@router.get("/get", response_model=TrainingResponseSchemaTotal)
def get_training(
    offset: int = 0,
    limit: int = 10,
    filter_params: TrainingFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(Training)

    filter_param = filter_params.model_dump(exclude_unset=True)

    query = FilterTraining().filter_training(query, **filter_param)
    query = SortTraining().sorting_training(
        query=query, sort=filter_params.sort, order=filter_params.order
    )

    total_count = query.with_entities(Training.id).count()

    return {
        "total_count": total_count,
        "trainings": query.offset(offset).limit(limit).all(),
    }


@router.get("/get/{training_id}", response_model=TrainingResponseSchema)
def get_training_by_id(
    training_id: int,
    db: Session = Depends(get_db),
):
    training = db.query(Training).filter(Training.id == training_id).first()

    if not training:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training not found."
        )

    return training


@router.post("/post")
# @check_role_permissions(["ADMIN", "CSR"])
def create_training(
    training_data: TrainingCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training = (
        db.query(Training)
        .filter(Training.name.ilike(f"%{training_data.name}%"))
        .first()
    )

    if training:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Training of that name already exists.",
        )

    try:
        db_item_data = training_data.model_dump(exclude_unset=True)
        db_item = Training(**db_item_data)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating training: {e}",
        ) from e

    return {"message": "Training created successfully"}


@router.put("/update/{training_id}")
# @check_role_permissions(["ADMIN", "CSR"])
def update_training(
    training_id: int,
    update_training_data: TrainingUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training = db.query(Training).filter(Training.id == training_id).first()

    if not training:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training not found."
        )

    try:
        for attr in vars(update_training_data):
            if getattr(update_training_data, attr) is not None:
                setattr(training, attr, getattr(update_training_data, attr))

        db.add(training)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating training: {e}",
        ) from e

    return {"message": "Training updated successfully"}


@router.delete("/delete/{training_id}", status_code=status.HTTP_204_NO_CONTENT)
# @check_role_permissions(["ADMIN", "CSR"])
def delete_training(
    training_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training = db.query(Training).filter(Training.id == training_id).first()

    if not training:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training not found."
        )

    try:
        db.delete(training)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting training: {e}",
        ) from e

    return
