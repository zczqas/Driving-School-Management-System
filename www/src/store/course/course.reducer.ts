import { ICourseState } from "../interface";
import { CourseActionTypes } from "./course.type";

const INITIAL_STATE: ICourseState = {
  sectionMenu: null,
  quizQuestions: [],
  courseLessonPreview: null,
  course: {
    courseList: [],
    courseListLoading: false,
    courseListError: null,
    courseById: null,
    courseByIdLoading: false,
    courseByIdError: null,
    createCourseLoading: false,
    createCourseSuccess: false,
    createCourseError: null,
    updateCourseLoading: false,
    updateCourseSuccess: false,
    updateCourseError: null,
    deleteCourseLoading: false,
    deleteCourseSuccess: false,
    deleteCourseError: null,
  },
  unitsById: {
    unitList: [],
    unitListLoading: false,
    unitListError: null,
    unitByUnitId: [],
    unitByUnitIdLoading: false,
    unitByUnitIdError: null,
    createUnitLoading: false,
    createUnitSuccess: false,
    createUnitError: null,
    updateUnitLoading: false,
    updateUnitSuccess: false,
    updateUnitError: null,
    deleteUnitLoading: false,
    deleteUnitSuccess: false,
    deleteUnitError: null,
  },
  courseLessonById: {
    lessonList: [],
    lessonListLoading: false,
    lessonListError: null,
    lessonById: null,
    lessonByIdLoading: false,
    lessonByIdError: null,
    createLessonContentLoading: false,
    createLessonContentSuccess: false,
    createLessonContentError: null,
    createLessonVideoLoading: false,
    createLessonVideoSuccess: false,
    createLessonVideoError: null,
    createLessonChartLoading: false,
    createLessonChartSuccess: false,
    createLessonChartError: null,
    updateLessonLoading: false,
    updateLessonSuccess: false,
    updateLessonError: null,
    deleteLessonLoading: false,
    deleteLessonSuccess: false,
    deleteLessonError: null,
  },
  subunit: {
    subunitList: [],
    subunitListLoading: false,
    subunitListError: null,
    createSubunitLoading: false,
    createSubunitSuccess: false,
    createSubunitError: null,
    updateSubunitLoading: false,
    updateSubunitSuccess: false,
    updateSubunitError: null,
    deleteSubunitLoading: false,
    deleteSubunitError: null,
    deleteSubunitSuccess: false,
  },
  courseQuestion: {
    questionList: [],
    questionListLoading: false,
    questionListError: null,
    createQuestionLoading: false,
    createQuestionSuccess: false,
    createQuestionError: null,
    updateQuestionLoading: false,
    updateQuestionSuccess: false,
    updateQuestionError: null,
    deleteQuestionLoading: false,
    deleteQuestionSuccess: false,
    deleteQuestionError: null,
  },
  courseQuiz: {
    quizList: [],
    quizListLoading: false,
    quizListError: null,
    // createQuizLoading: false,
    // createQuizSuccess: false,
    // createQuizError: null,
    // updateQuizLoading: false,
    // updateQuizSuccess: false,
    // updateQuizError: null,
    // deleteQuizLoading: false,
    // deleteQuizSuccess: false,
    // deleteQuizError: null,
  },
};

const courseReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case CourseActionTypes.SET_SECTION_MENU:
      return {
        ...state,
        sectionMenu: payload,
      };
    case CourseActionTypes.CLEAR_SECTION_MENU:
      return {
        ...state,
        sectionMenu: null,
      };

    case CourseActionTypes.SET_QUIZ_QUESTION:
      return {
        ...state,
        quizQuestions: payload,
      };
    case CourseActionTypes.CLEAR_QUIZ_QUESTION:
      return {
        ...state,
        quizQuestions: [],
      };

    case CourseActionTypes.LESSON_PREVIEW_DATA:
      return {
        ...state,
        courseLessonPreview: {
          previewInitiatorState: state.sectionMenu,
          previewContent: payload,
        },
      };
    case CourseActionTypes.CLEAR_LESSON_PREVIEW_DATA:
      return {
        ...state,
        courseLessonPreview: null,
      };

    case CourseActionTypes.GET_COURSES:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: true,
        },
      };
    case CourseActionTypes.GET_COURSES_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: false,
          courseList: payload,
        },
      };
    case CourseActionTypes.GET_COURSES_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: false,
          courseListError: payload,
        },
      };

    case CourseActionTypes.GET_COURSE_BY_ID:
      return {
        ...state,
        course: {
          ...state.course,
          courseByIdLoading: true,
        },
      };
    case CourseActionTypes.GET_COURSE_BY_ID_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          courseByIdLoading: false,
          courseById: payload,
        },
      };
    case CourseActionTypes.GET_COURSE_BY_ID_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          courseByIdLoading: false,
          courseByIdError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: true,
          createCourseSuccess: false,
          createCourseError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: false,
          createCourseSuccess: true,
        },
      };
    case CourseActionTypes.CREATE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: false,
          createCourseError: payload,
        },
      };

    case CourseActionTypes.DELETE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: true,
          deleteCourseSuccess: false,
          deleteCourseError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: false,
          deleteCourseSuccess: true,
        },
      };
    case CourseActionTypes.DELETE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: false,
          deleteCourseError: payload,
        },
      };

    case CourseActionTypes.UPDATE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: true,
          updateCourseSuccess: false,
          updateCourseError: null,
        },
      };

    case CourseActionTypes.UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: false,
          updateCourseSuccess: true,
        },
      };

    case CourseActionTypes.UPDATE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: false,
          updateCourseError: payload,
        },
      };

    // Units by Course Id
    case CourseActionTypes.GET_UNITS_BY_COURSE_ID:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitListLoading: true,
        },
      };
    case CourseActionTypes.GET_UNITS_BY_COURSE_ID_SUCCESS:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitListLoading: false,
          unitList: payload,
        },
      };
    case CourseActionTypes.GET_UNITS_BY_COURSE_ID_ERROR:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitListLoading: false,
          unitListError: payload,
        },
      };

    case CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitByUnitIdLoading: true,
          unitByUnitIdError: null,
        },
      };
    case CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID_SUCCESS:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitByUnitIdLoading: false,
          unitByUnitId: payload,
        },
      };
    case CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID_ERROR:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          unitByUnitIdLoading: false,
          unitByUnitIdError: payload,
        },
      };

    case CourseActionTypes.CREATE_UNIT:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          createUnitLoading: true,
          createUnitSuccess: false,
          createUnitError: null,
        },
      };
    case CourseActionTypes.CREATE_UNIT_SUCCESS:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          createUnitLoading: false,
          createUnitSuccess: true,
        },
      };
    case CourseActionTypes.CREATE_UNIT_ERROR:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          createUnitLoading: false,
          createUnitError: payload,
        },
      };

    case CourseActionTypes.UPDATE_UNIT:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          updateUnitLoading: true,
          updateUnitSuccess: false,
          updateUnitError: null,
        },
      };
    case CourseActionTypes.UPDATE_UNIT_SUCCESS:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          updateUnitLoading: false,
          updateUnitSuccess: true,
        },
      };
    case CourseActionTypes.UPDATE_UNIT_ERROR:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          updateUnitLoading: false,
          updateUnitError: payload,
        },
      };

    case CourseActionTypes.DELETE_UNIT:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          deleteUnitLoading: true,
          deleteUnitSuccess: false,
          deleteUnitError: null,
        },
      };
    case CourseActionTypes.DELETE_UNIT_SUCCESS:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          deleteUnitLoading: false,
          deleteUnitSuccess: true,
        },
      };
    case CourseActionTypes.DELETE_UNIT_ERROR:
      return {
        ...state,
        unitsById: {
          ...state.unitsById,
          deleteUnitLoading: false,
          deleteUnitError: payload,
        },
      };

    // Course Lesson by unit id
    case CourseActionTypes.GET_COURSE_LESSON:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonListLoading: true,
          lessonListError: null,
        },
      };
    case CourseActionTypes.GET_COURSE_LESSON_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonListLoading: false,
          lessonListError: null,
          lessonList: payload,
        },
      };
    case CourseActionTypes.GET_COURSE_LESSON_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonListLoading: false,
          lessonListError: payload,
        },
      };

    case CourseActionTypes.GET_COURSE_LESSON_BY_ID:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonByIdLoading: true,
          lessonByIdError: null,
        },
      };
    case CourseActionTypes.GET_COURSE_LESSON_BY_ID_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonByIdLoading: false,
          lessonById: payload,
        },
      };
    case CourseActionTypes.GET_COURSE_LESSON_BY_ID_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          lessonByIdLoading: false,
          lessonByIdError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_CONTENT:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonContentLoading: true,
          createLessonContentSuccess: false,
          createLessonContentError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_LESSON_CONTENT_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonContentLoading: false,
          createLessonContentSuccess: true,
          createLessonContentError: null,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_CONTENT_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonContentLoading: false,
          createLessonContentError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_VIDEO:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonVideoLoading: true,
          createLessonVideoSuccess: false,
          createLessonVideoError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_LESSON_VIDEO_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonVideoLoading: false,
          createLessonVideoSuccess: true,
          createLessonVideoError: null,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_VIDEO_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonVideoLoading: false,
          createLessonVideoError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_CHART:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonChartLoading: true,
          createLessonChartSuccess: false,
          createLessonChartError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_LESSON_CHART_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonChartLoading: false,
          createLessonChartSuccess: true,
          createLessonChartError: null,
        },
      };

    case CourseActionTypes.CREATE_COURSE_LESSON_CHART_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          createLessonChartLoading: false,
          createLessonChartError: payload,
        },
      };

    case CourseActionTypes.UPDATE_COURSE_LESSON:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          updateLessonLoading: true,
          updateLessonSuccess: false,
          updateLessonError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_LESSON_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          updateLessonLoading: false,
          updateLessonSuccess: true,
          updateLessonError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_LESSON_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          updateLessonLoading: false,
          updateLessonError: payload,
        },
      };

    case CourseActionTypes.DELETE_COURSE_LESSON:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          deleteLessonLoading: true,
          deleteLessonSuccess: false,
          deleteLessonError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_LESSON_SUCCESS:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          deleteLessonLoading: false,
          deleteLessonSuccess: true,
          deleteLessonError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_LESSON_ERROR:
      return {
        ...state,
        courseLessonById: {
          ...state.courseLessonById,
          deleteLessonLoading: false,
          deleteLessonError: payload,
        },
      };

    // Course Subunit
    case CourseActionTypes.GET_COURSE_SUBUNIT:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          subunitListLoading: true,
          subunitListError: null,
        },
      };
    case CourseActionTypes.GET_COURSE_SUBUNIT_SUCCESS:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          subunitListLoading: false,
          subunitListError: null,
          subunitList: payload,
        },
      };
    case CourseActionTypes.GET_COURSE_SUBUNIT_ERROR:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          subunitListLoading: false,
          subunitListError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE_SUBUNIT:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          createSubunitLoading: true,
          createSubunitSuccess: false,
          createSubunitError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_SUBUNIT_SUCCESS:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          createSubunitLoading: false,
          createSubunitSuccess: true,
          createSubunitError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_SUBUNIT_ERROR:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          createSubunitLoading: false,
          createSubunitError: payload,
        },
      };

    case CourseActionTypes.UPDATE_COURSE_SUBUNIT:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          updateSubunitLoading: true,
          updateSubunitSuccess: false,
          updateSubunitError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_SUBUNIT_SUCCESS:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          updateSubunitLoading: false,
          updateSubunitSuccess: true,
          updateSubunitError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_SUBUNIT_ERROR:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          updateSubunitLoading: false,
          updateSubunitError: payload,
        },
      };

    case CourseActionTypes.DELETE_COURSE_SUBUNIT:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          deleteSubunitLoading: true,
          deleteSubunitSuccess: false,
          deleteSubunitError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_SUBUNIT_SUCCESS:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          deleteSubunitLoading: false,
          deleteSubunitSuccess: true,
          deleteSubunitError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_SUBUNIT_ERROR:
      return {
        ...state,
        subunit: {
          ...state.subunit,
          deleteSubunitLoading: false,
          deleteSubunitError: payload,
        },
      };

    // Course Question
    case CourseActionTypes.GET_COURSE_QUESTION:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          questionListLoading: true,
          questionListError: null,
        },
      };
    case CourseActionTypes.GET_COURSE_QUESTION_SUCCESS:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          questionListLoading: false,
          questionListError: null,
          questionList: payload,
        },
      };
    case CourseActionTypes.GET_COURSE_QUESTION_ERROR:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          questionListLoading: false,
          questionListError: payload,
        },
      };

    case CourseActionTypes.CREATE_COURSE_QUESTION:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          createQuestionLoading: true,
          createQuestionSuccess: false,
          createQuestionError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_QUESTION_SUCCESS:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          createQuestionLoading: false,
          createQuestionSuccess: true,
          createQuestionError: null,
        },
      };
    case CourseActionTypes.CREATE_COURSE_QUESTION_ERROR:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          createQuestionLoading: false,
          createQuestionError: payload,
        },
      };

    case CourseActionTypes.UPDATE_COURSE_QUESTION:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          updateQuestionLoading: true,
          updateQuestionSuccess: false,
          updateQuestionError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_QUESTION_SUCCESS:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          updateQuestionLoading: false,
          updateQuestionSuccess: true,
          updateQuestionError: null,
        },
      };
    case CourseActionTypes.UPDATE_COURSE_QUESTION_ERROR:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          updateQuestionLoading: false,
          updateQuestionError: payload,
        },
      };

    case CourseActionTypes.DELETE_COURSE_QUESTION:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          deleteQuestionLoading: true,
          deleteQuestionSuccess: false,
          deleteQuestionError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_QUESTION_SUCCESS:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          deleteQuestionLoading: false,
          deleteQuestionSuccess: true,
          deleteQuestionError: null,
        },
      };
    case CourseActionTypes.DELETE_COURSE_QUESTION_ERROR:
      return {
        ...state,
        courseQuestion: {
          ...state.courseQuestion,
          deleteQuestionLoading: false,
          deleteQuestionError: payload,
        },
      };

    // Course Quiz
    case CourseActionTypes.GET_COURSE_QUIZ:
      return {
        ...state,
        courseQuiz: {
          ...state.courseQuiz,
          quizListLoading: true,
          quizListError: null,
          quizList: [],
        },
      };
    case CourseActionTypes.GET_COURSE_QUIZ_SUCCESS:
      return {
        ...state,
        quizQuestions: payload.questions,
        courseQuiz: {
          ...state.courseQuiz,
          quizListLoading: false,
          quizListError: null,
          quizList: payload.questions,
        },
      };
    case CourseActionTypes.GET_COURSE_QUIZ_ERROR:
      return {
        ...state,
        courseQuiz: {
          ...state.courseQuiz,
          quizListLoading: false,
          quizListError: payload,
          quizList: [],
        },
      };

    // case CourseActionTypes.CREATE_COURSE_QUIZ:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       createQuizLoading: true,
    //       createQuizSuccess: false,
    //       createQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.CREATE_COURSE_QUIZ_SUCCESS:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       createQuizLoading: false,
    //       createQuizSuccess: true,
    //       createQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.CREATE_COURSE_QUIZ_ERROR:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       createQuizLoading: false,
    //       createQuizError: payload,
    //     },
    //   };

    // case CourseActionTypes.UPDATE_COURSE_QUIZ:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       updateQuizLoading: true,
    //       updateQuizSuccess: false,
    //       updateQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.UPDATE_COURSE_QUIZ_SUCCESS:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       updateQuizLoading: false,
    //       updateQuizSuccess: true,
    //       updateQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.UPDATE_COURSE_QUIZ_ERROR:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       updateQuizLoading: false,
    //       updateQuizError: payload,
    //     },
    //   };

    // case CourseActionTypes.DELETE_COURSE_QUIZ:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       deleteQuizLoading: true,
    //       deleteQuizSuccess: false,
    //       deleteQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.DELETE_COURSE_QUIZ_SUCCESS:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       deleteQuizLoading: false,
    //       deleteQuizSuccess: true,
    //       deleteQuizError: null,
    //     },
    //   };
    // case CourseActionTypes.DELETE_COURSE_QUIZ_ERROR:
    //   return {
    //     ...state,
    //     courseQuiz: {
    //       ...state.courseQuiz,
    //       deleteQuizLoading: false,
    //       deleteQuizError: payload,
    //     },
    //   };

    default:
      return state;
  }
};

export default courseReducer;
