from typing import Optional

from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from apps.common.enum import DriverEdStatusRemarksEnum
from apps.core.models.driver_ed import DriverEdQuestion, DriverEdUnits
from apps.core.models.driver_ed_log import DriverEdLog
from apps.core.schemas.driver_ed.driver_ed_question import (
    DriverEdQuestionResponseSchema,
)


from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_question", tags=["driver_ed_question"])


@router.get("/get")
def get_driver_ed_questions(
    offset: int = 0,
    limit: int = 10,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    questions = db.query(DriverEdQuestion).limit(limit).offset(offset).all()

    return {
        "unit": {
            "id": 1,
            "title": questions[0].unit.title,
            "purpose": questions[0].unit.purpose,
        },
        "data": [
            {
                "id": question.id,
                "unit_id": question.unit_id,
                "question": question.question,
                "option_a": question.a,
                "option_b": question.b,
                "option_c": question.c,
                "option_d": question.d,
                # "answer": question.correct_answer,
            }
            for question in questions
        ],
    }


@router.get("/get/final")
def get_driver_ed_questions_final(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    units = db.query(DriverEdUnits).all()

    questions = []
    for unit in units:
        unit_questions = (
            db.query(DriverEdQuestion)
            .filter(DriverEdQuestion.unit_id == unit.id)
            .order_by(func.random())
            .limit(5)
            .all()
        )
        questions.extend(unit_questions)

    questions = questions[:50]

    return [
        {
            "id": question.id,
            "unit_id": question.unit_id,
            "question": question.question,
            "option_a": question.a,
            "option_b": question.b,
            "option_c": question.c,
            "option_d": question.d,
            "option_e": question.e,
            # "answer": question.correct_answer,
        }
        for question in questions
    ]


@router.get("/get/{unit_id}")
def get_driver_ed_questions_by_unit_id(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    questions = (
        db.query(DriverEdQuestion).filter(DriverEdQuestion.unit_id == unit_id).all()
    )
    if not questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Unit not found",
        )

    quiz_log = (
        db.query(DriverEdLog)
        .filter(
            DriverEdLog.user_id == current_user.id,
            DriverEdLog.remarks == DriverEdStatusRemarksEnum.PASS,
            DriverEdLog.unit_id == unit_id,
        )
        .all()
    )

    return {
        "unit": {
            "id": 1,
            "title": questions[0].unit.title,
            "purpose": questions[0].unit.purpose,
            "is_passed": any(log.unit_id == unit_id for log in quiz_log),
        },
        "data": [
            {
                "id": question.id,
                "unit_id": question.unit_id,
                "question": question.question,
                "option_a": question.a,
                "option_b": question.b,
                "option_c": question.c,
                "option_d": question.d,
                "option_e": question.e,
                # "answer": question.correct_answer,
            }
            for question in questions
        ],
    }


@router.post("/create")
def create_driver_ed_question(
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": "Driver ed question created"}


@router.put("/update/{question_id}")
def update_driver_ed_question(
    question_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    return {"message": f"Update driver ed question {question_id}"}


@router.delete("/delete/{question_id}")
def delete_driver_ed_question(
    question_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):

    return {"message": f"Delete driver ed question {question_id}"}
