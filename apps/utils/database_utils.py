from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


def create_and_commit(db: Session, model, obj_data):
    try:
        obj = model(**obj_data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=404, detail="Object already exists") from e
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
