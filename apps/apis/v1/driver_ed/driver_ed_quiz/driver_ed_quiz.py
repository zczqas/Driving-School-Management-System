from typing import List
from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session

from apps.common.enum import (
    CertificateTypeEnum,
    DriverEdStatusRemarksEnum,
    UserCertificateStatusEnum,
)
from apps.core.models.certificate import Certificate, UserCertificate
from apps.core.models.driver_ed import DriverEdQuestion
from apps.core.models.driver_ed_log import DriverEdLog
from apps.core.models.users import Profile
from apps.core.schemas.driver_ed.driver_ed_quiz import (
    DriverEdQuiz,
    DriverEdQuizDisplaySchema,
)
from apps.security.auth import jwt_service
from apps.config.db.conn import get_db

router = APIRouter(prefix="/driver_ed_quiz", tags=["driver_ed_quiz"])


@router.get("/get_quiz/{unit_id}", response_model=list[DriverEdQuizDisplaySchema])
def get_quiz(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    quiz = db.query(DriverEdQuestion).filter(DriverEdQuestion.unit_id == unit_id).all()

    return quiz


@router.post("/submit_quiz/{unit_id}")
def submit_quiz(
    unit_id: int,
    quiz_answers: List[DriverEdQuiz],
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    !important

    quiz_answers can be of variable length.
    like:
    [
        {
            "question_id": 1,
            "selected_option": "a"
        },
        {
            "question_id": 2,
            "selected_option": "b"
        }
    ]
    or,
    [
        {
            "question_id": 1,
            "selected_option": "a"
        }
    ]
    this is done for more flexibility.
    """

    correct_answers = (
        db.query(
            DriverEdQuestion.id,
            DriverEdQuestion.correct_answer,
        )
        .filter(DriverEdQuestion.unit_id == unit_id)
        .all()
    )
    correct_answers_dict = {q.id: q.correct_answer for q in correct_answers}

    score = 0
    incorrect_questions = []

    for user_answer in quiz_answers:
        correct_answer = correct_answers_dict.get(user_answer.question_id)
        if correct_answer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found in the provided unit.",
            )
        if user_answer.selected_option == correct_answer:
            score += 1
        else:
            incorrect_questions.append(user_answer.question_id)

    total_questions = len(correct_answers)
    percentage = ((score / total_questions) * 100).__ceil__()

    try:
        new_quiz_log = DriverEdLog(
            user_id=current_user.id,
            unit_id=unit_id,
            marks=score,
            percentage=percentage,
            detail=", ".join(map(str, incorrect_questions)),
            remarks=(
                DriverEdStatusRemarksEnum.PASS
                if percentage >= 80
                else DriverEdStatusRemarksEnum.FAIL
            ),
        )

        db.add(new_quiz_log)
        db.commit()
        db.refresh(new_quiz_log)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error while saving quiz log: {str(e)}",
        )

    return {
        "marks": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "incorrect_questions": incorrect_questions,
        "remarks": new_quiz_log.remarks,
    }


@router.post("/submit_quiz")
def submit_quiz_final(
    quiz_answers: List[DriverEdQuiz],
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    routes to submit final quiz answers
    """
    correct_answers = db.query(
        DriverEdQuestion.id,
        DriverEdQuestion.correct_answer,
    ).all()

    correct_answers_dict = {q.id: q.correct_answer for q in correct_answers}

    score = 0
    incorrect_questions = []

    for user_answer in quiz_answers:
        correct_answer = correct_answers_dict.get(user_answer.question_id)
        if correct_answer is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Question not found in the provided unit.",
            )
        if user_answer.selected_option == correct_answer:
            score += 1
        else:
            incorrect_questions.append(user_answer.question_id)

    total_questions = len(quiz_answers)
    percentage = ((score / total_questions) * 100).__ceil__()

    try:
        new_quiz_log = DriverEdLog(
            user_id=current_user.id,
            unit_id=11,  # 11 is suppose to be final quiz unit id
            marks=score,
            percentage=percentage,
            detail=", ".join(map(str, incorrect_questions)),
            remarks=(
                DriverEdStatusRemarksEnum.PASS
                if percentage >= 80
                else DriverEdStatusRemarksEnum.FAIL
            ),
        )

        db.add(new_quiz_log)
        db.commit()
        db.refresh(new_quiz_log)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error while saving quiz log: {str(e)}",
        )

    if percentage > 80:
        certificate = (
            db.query(Certificate)
            .filter(
                Certificate.certificate_type == CertificateTypeEnum.PINK,
                Certificate.is_assigned == False,
                Certificate.status == "NOT_ASSIGNED",
            )
            .first()
        )
        if certificate is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Unassigned certificate not found",
            )
        profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
        try:
            db.add(
                UserCertificate(
                    user_profiles_id=profile.id,
                    certificate_id=certificate.id,
                )
            )
            setattr(certificate, "is_assigned", True)
            setattr(certificate, "status", UserCertificateStatusEnum.ASSIGNED)
            db.add(certificate)
            db.commit()
            db.refresh(certificate)
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error: {e} occurred while assigning certificate",
            ) from e

    return {
        "marks": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "incorrect_questions": incorrect_questions,
        "remarks": new_quiz_log.remarks,
        "certificate": certificate.certificate_number if percentage > 80 else None,
    }
