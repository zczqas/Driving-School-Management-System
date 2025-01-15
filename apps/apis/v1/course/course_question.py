from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from apps.config.db.conn import get_db
from apps.core.models.course.additional_options import CourseQuestions
from apps.core.models.course.course import CourseUnit
from apps.core.schemas.course.course_question import CourseQuestionCreateSchema
from apps.security.auth import jwt_service  # noqa

router = APIRouter(prefix="/course/question", tags=["course question"])


@router.get("/get/{unit_id}")
def get_course_questions(
    unit_id: int,
    db: Session = Depends(get_db),
):
    course_questions = (
        db.query(CourseQuestions).filter(CourseQuestions.unit_id == unit_id).all()
    )

    return {
        "total": len(course_questions),
        "course_questions": [
            {
                "id": course_question.id,
                "question": course_question.question,
                "a": course_question.a,
                "b": course_question.b,
                "c": course_question.c,
                "d": course_question.d,
                "e": course_question.e,
                "correct_answer": course_question.correct_answer,
                "image": course_question.image,
                "unit_id": course_question.unit_id,
                "is_active": course_question.is_active,
                "created_at": course_question.created_at,
            }
            for course_question in course_questions
        ],
    }


@router.post("/create")
def create_course_question(
    data: list[CourseQuestionCreateSchema],
    db: Session = Depends(get_db),
):
    for question in data:
        if not (db.query(CourseUnit).filter(CourseUnit.id == question.unit_id).first()):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course Unit not found.",
            )
        if not (question.a or question.b or question.c or question.d or question.e):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one answer must be provided.",
            )

        course_question = CourseQuestions(**question.model_dump())
        db.add(course_question)

    try:
        db.commit()
        return {"message": "Course Question created successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating Course Question.{str(e)}",
        ) from e


@router.put("/update/{course_question_id}")
def update_course_question(
    course_question_id: int,
    data: CourseQuestionCreateSchema,
    db: Session = Depends(get_db),
):
    course_question = (
        db.query(CourseQuestions)
        .filter(CourseQuestions.id == course_question_id)
        .first()
    )
    if not course_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Question not found.",
        )

    if data.unit_id is not None:
        course_question.unit_id = data.unit_id
    if data.question is not None:
        course_question.question = data.question
    if data.correct_answer is not None:
        course_question.correct_answer = data.correct_answer
    if data.image is not None:
        course_question.image = data.image

    for key in ["a", "b", "c", "d", "e"]:
        setattr(course_question, key, getattr(data, key))

    try:
        db.add(course_question)
        db.commit()
        return {"message": "Course Question updated successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An error occurred while updating Course Question.",
        ) from e


@router.delete("/delete/{course_question_id}")
def delete_course_question(
    course_question_id: int,
    db: Session = Depends(get_db),
):
    course_questions = (
        db.query(CourseQuestions)
        .filter(CourseQuestions.id == course_question_id)
        .first()
    )
    if not course_questions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course Question not found.",
        )

    try:
        db.delete(course_questions)
        db.commit()
        return {"message": "Course Question deleted successfully."}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An error occurred while deleting Course Question.",
        ) from e
