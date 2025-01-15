from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)

from sqlalchemy.orm import Session

from apps.rbac.role_permission_decorator import check_role_permissions
from apps.security.auth import jwt_service
from apps.apis.v1.training.filter_sort import FilterTraining, SortTraining
from apps.config.db.conn import get_db
from apps.core.models.training import TrainingLogs
from apps.core.schemas.training_logs import (
    TrainingLogCreateSchema,
    TrainingLogFilterSchema,
    TrainingLogResponseSchemaTotal,
    TrainingLogUpdateSchema,
)


router = APIRouter(prefix="/training_logs", tags=["training_logs"])


@router.get("/get", response_model=TrainingLogResponseSchemaTotal)
def get_training_logs(
    offset: int = 0,
    limit: int = 10,
    logs_filter_params: TrainingLogFilterSchema = Depends(),
    db: Session = Depends(get_db),
):
    query = db.query(TrainingLogs)

    filter_params = logs_filter_params.model_dump(exclude_unset=True)

    query = FilterTraining().filter_training_logs(query, **filter_params)
    query = SortTraining().sorting_training_logs(
        query=query, sort=logs_filter_params.sort, order=logs_filter_params.order
    )

    total_count = query.with_entities(TrainingLogs.id).count()

    return {
        "total_count": total_count,
        "training_logs": query.offset(offset).limit(limit).all(),
    }


@router.post("/post")
# @check_role_permissions(["ADMIN", "CSR"])
def create_training_log(
    training_log_data: TrainingLogCreateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training_log = (
        db.query(TrainingLogs)
        .filter(
            TrainingLogs.user_id == training_log_data.user_id,
            TrainingLogs.lesson_id == training_log_data.lesson_id,
            TrainingLogs.training_id == training_log_data.training_id,
        )
        .first()
    )

    if training_log:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Training log already exists.",
        )

    try:
        db_item_data = training_log_data.model_dump(exclude_unset=True)
        db_item = TrainingLogs(**db_item_data)
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        ) from e

    return {
        "message": "Training log created successfully",
        "training_log": db_item,
    }

    # return db_item_data


@router.put("/put/{training_log_id}")
# @check_role_permissions(["ADMIN", "CSR"])
def update_training_log(
    training_log_id: int,
    training_log_data: TrainingLogUpdateSchema,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training_log = (
        db.query(TrainingLogs).filter(TrainingLogs.id == training_log_id).first()
    )

    if not training_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training log not found."
        )

    try:
        for attr in vars(training_log_data):
            if getattr(training_log_data, attr) is not None:
                setattr(training_log, attr, getattr(training_log_data, attr))

        db.add(training_log)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating training log: {e}",
        ) from e

    return {"message": "Training log updated successfully"}


@router.delete("/delete/{training_log_id}", status_code=status.HTTP_204_NO_CONTENT)
# @check_role_permissions(["ADMIN", "CSR"])
def delete_training_log(
    training_log_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    training_log = (
        db.query(TrainingLogs).filter(TrainingLogs.id == training_log_id).first()
    )

    if not training_log:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Training log not found."
        )

    try:
        db.delete(training_log)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting training log: {e}",
        ) from e

    return {"message": "Training log deleted successfully"}
