from typing import List

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from apps.common.enum import DriverEdStatusRemarksEnum
from apps.core.models.course.additional_options import CourseQuestions
from apps.core.models.course.course_log import CourseQuizLog
from apps.core.schemas.course.course_quiz import CourseQuizSchema


def get_correct_answers(db: Session, unit_id: int | None = None):
    query = db.query(CourseQuestions.id, CourseQuestions.correct_answer)
    if unit_id is not None:
        query = query.filter(CourseQuestions.unit_id == unit_id)
    correct_answers = query.all()
    return {q.id: q.correct_answer for q in correct_answers}


def calculate_score(quiz_answers: List[CourseQuizSchema], correct_answers_dict: dict):
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
    return score, incorrect_questions


def save_quiz_log(
    db: Session, current_user, unit_id, score, percentage, incorrect_questions
):
    try:
        new_quiz_log = CourseQuizLog(
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
        return new_quiz_log
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"error while saving quiz log: {str(e)}",
        ) from e


def submit_quiz_common(
    quiz_answers: List[CourseQuizSchema],
    current_user,
    db: Session,
    unit_id: int | None = None,
):
    correct_answers_dict = get_correct_answers(db, unit_id)
    score, incorrect_questions = calculate_score(quiz_answers, correct_answers_dict)
    total_questions = len(correct_answers_dict)
    percentage = ((score / total_questions) * 100).__ceil__()
    new_quiz_log = save_quiz_log(
        db, current_user, unit_id, score, percentage, incorrect_questions
    )

    return {
        "marks": score,
        "total_questions": total_questions,
        "percentage": percentage,
        "incorrect_questions": incorrect_questions,
        "remarks": new_quiz_log.remarks,
    }
