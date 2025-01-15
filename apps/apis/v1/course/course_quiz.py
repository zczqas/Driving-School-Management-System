from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from apps.apis.v1.course.util.lesson_log import submit_quiz_common
from apps.common.enum import RoleEnum
from apps.config.db.conn import get_db
from apps.core.models.course.additional_options import CourseQuestions
from apps.core.schemas.course.course_quiz import (
    CourseQuizDisplaySchema,
    CourseQuizSchema,
)
from apps.security.auth import jwt_service

router = APIRouter(prefix="/course_quiz", tags=["course quiz"])


@router.get("/get_quiz/{unit_id}", response_model=list[CourseQuizDisplaySchema])
def get_course_quiz(
    unit_id: int,
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    course_quiz = (
        db.query(CourseQuestions).filter(CourseQuestions.unit_id == unit_id).all()
    )

    return [
        {
            "id": course_question.id,
            "question": course_question.question,
            "a": course_question.a,
            "b": course_question.b,
            "c": course_question.c,
            "d": course_question.d,
            "e": course_question.e,
            "correct_answer": (
                None
                if current_user.role == RoleEnum.STUDENT
                else course_question.correct_answer
            ),
            "image": course_question.image,
            "unit": course_question.unit,
        }
        for course_question in course_quiz
    ]


@router.post("/submit_quiz/{unit_id}")
def submit_quiz(
    unit_id: int,
    quiz_answers: List[CourseQuizSchema],
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
    return submit_quiz_common(
        quiz_answers=quiz_answers, unit_id=unit_id, current_user=current_user, db=db
    )


@router.post("/submit_quiz")
def submit_quiz_final(
    quiz_answers: List[CourseQuizSchema],
    current_user=Depends(jwt_service.get_current_user),
    db: Session = Depends(get_db),
):
    """
    routes to submit final quiz answers
    """
    return submit_quiz_common(
        quiz_answers=quiz_answers,
        current_user=current_user,
        db=db,
        # Since we are not passing unit_id, it will be None
    )
