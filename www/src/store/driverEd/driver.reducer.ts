import { IDriver } from "../interface";
import * as DriverTypes from "./driver.types";

const INITIAL_STATE: IDriver = {
  unitList: [],
  unitListLoading: false,
  unitLessonsById: [],
  unitLessonsByIdLoading: false,
  lessonDetail: null,
  lessonDetailLoading: false,
  unitQuizById: [],
  unitQuizByIdLoading: false,
  unitQuizSubmitLoading: false,
  unitQuizSubmitSuccess: null,
  unitQuizSubmitError: null,
  videoList: [],
  videoListLoading: false,
  videoListError: null,
  chartList: [],
  chartListLoading: false,
  chartListError: null,
  chartById: [],
  chartByIdLoading: false,
  chartByIdError: null,
  finalExam: [],
  finalExamLoading: false,
  finalExamError: null,
  finalExamSubmitLoading: false,
  finalExamSubmitSuccess: null,
  finalExamSubmitError: null,
  studentTestStatus: null,
  studentTestStatusLoading: false,
  studentTestStatusError: null,
  studentProgress: [],
  studentProgressLoading: false,
  studentProgressError: null,
};

const driverReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case DriverTypes.FETCH_UNITS_LIST_START:
      return {
        ...state,
        unitListLoading: true,
      };
    case DriverTypes.FETCH_UNITS_LIST_SUCCESS:
      return {
        ...state,
        unitList: payload,
        unitListLoading: false,
      };
    case DriverTypes.FETCH_UNITS_LIST_ERROR:
      return {
        ...state,
        unitListError: payload,
        unitListLoading: false,
      };

    case DriverTypes.FETCH_UNITS_LESSONS_BY_ID_START:
      return {
        ...state,
        unitLessonsByIdLoading: true,
      };
    case DriverTypes.FETCH_UNITS_LESSONS_BY_ID_SUCCESS:
      return {
        ...state,
        unitLessonsById: payload,
        unitLessonsByIdLoading: false,
      };
    case DriverTypes.FETCH_UNITS_LESSONS_BY_ID_ERROR:
      return {
        ...state,
        unitLessonsByIdError: payload,
        unitLessonsByIdLoading: false,
      };

    case DriverTypes.FETCH_LESSON_DETAILS_START:
      return {
        ...state,
        lessonDetailLoading: true,
      };
    case DriverTypes.FETCH_LESSON_DETAILS_SUCCESS:
      return {
        ...state,
        lessonDetail: action.payload,
        lessonDetailLoading: false,
      };
    case DriverTypes.FETCH_LESSON_DETAILS_ERROR:
      return {
        ...state,
        lessonDetailError: action.payload,
        lessonDetailLoading: false,
      };

    case DriverTypes.FETCH_UNIT_QUIZ_BY_ID_START:
      return {
        ...state,
        unitQuizByIdLoading: true,
      };
    case DriverTypes.FETCH_UNIT_QUIZ_BY_ID_SUCCESS:
      return {
        ...state,
        unitQuizById: payload,
        unitQuizByIdLoading: false,
      };
    case DriverTypes.FETCH_UNIT_QUIZ_BY_ID_ERROR:
      return {
        ...state,
        unitQuizByIdError: payload,
        unitQuizByIdLoading: false,
      };

    case DriverTypes.SUBMIT_UNIT_QUIZ_START:
      return {
        ...state,
        unitQuizSubmitLoading: true,
        unitQuizSubmitError: null,
      };
    case DriverTypes.SUBMIT_UNIT_QUIZ_SUCCESS:
      return {
        ...state,
        unitQuizSubmitLoading: false,
        unitQuizSubmitSuccess: payload,
      };
    case DriverTypes.SUBMIT_UNIT_QUIZ_ERROR:
      return {
        ...state,
        unitQuizSubmitLoading: false,
        unitQuizSubmitError: payload,
      };

    case DriverTypes.FETCH_VIDEO_LIST_START:
      return {
        ...state,
        videoListLoading: true,
      };
    case DriverTypes.FETCH_VIDEO_LIST_SUCCESS:
      return {
        ...state,
        videoList: payload,
        videoListLoading: false,
      };
    case DriverTypes.FETCH_VIDEO_LIST_ERROR:
      return {
        ...state,
        videoListError: payload,
        videoListLoading: false,
      };

    case DriverTypes.FETCH_CHART_LIST_START:
      return {
        ...state,
        chartListLoading: true,
      };
    case DriverTypes.FETCH_CHART_LIST_SUCCESS:
      return {
        ...state,
        chartList: payload,
        chartListLoading: false,
      };
    case DriverTypes.FETCH_CHART_LIST_ERROR:
      return {
        ...state,
        chartListError: payload,
        chartListLoading: false,
      };

    case DriverTypes.FETCH_CHART_BY_ID_START:
      return {
        ...state,
        chartByIdLoading: true,
      };
    case DriverTypes.FETCH_CHART_BY_ID_SUCCESS:
      return {
        ...state,
        chartById: payload,
        chartByIdLoading: false,
      };
    case DriverTypes.FETCH_CHART_BY_ID_ERROR:
      return {
        ...state,
        chartByIdError: payload,
        chartByIdLoading: false,
      };

    case DriverTypes.FETCH_FINAL_EXAM_START:
      return {
        ...state,
        finalExamLoading: true,
      };
    case DriverTypes.FETCH_FINAL_EXAM_SUCCESS:
      return {
        ...state,
        finalExam: payload,
        finalExamLoading: false,
      };
    case DriverTypes.FETCH_FINAL_EXAM_ERROR:
      return {
        ...state,
        finalExamError: payload,
        finalExamLoading: false,
      };

    case DriverTypes.SUBMIT_FINAL_EXAM_START:
      return {
        ...state,
        finalExamSubmitLoading: true,
        finalExamSubmitError: null,
      };
    case DriverTypes.SUBMIT_FINAL_EXAM_SUCCESS:
      return {
        ...state,
        finalExamSubmitLoading: false,
        finalExamSubmitSuccess: payload,
      };
    case DriverTypes.SUBMIT_FINAL_EXAM_ERROR:
      return {
        ...state,
        finalExamSubmitLoading: false,
        finalExamSubmitError: payload,
      };

    case DriverTypes.FETCH_STUDENT_TEST_STATUS_START:
      return {
        ...state,
        studentTestStatusLoading: true,
        studentTestStatusError: null,
      };

    case DriverTypes.FETCH_STUDENT_TEST_STATUS_SUCCESS:
      return {
        ...state,
        studentTestStatus: payload,
        studentTestStatusLoading: false,
      };

    case DriverTypes.FETCH_STUDENT_TEST_STATUS_ERROR:
      return {
        ...state,
        studentTestStatusError: payload,
        studentTestStatusLoading: false,
      };

    case DriverTypes.FETCH_STUDENT_PROGRESS_START:
      return {
        ...state,
        studentProgressLoading: true,
        studentProgressError: null,
      };

    case DriverTypes.FETCH_STUDENT_PROGRESS_SUCCESS:
      return {
        ...state,
        studentProgress: payload,
        studentProgressLoading: false,
      };

    case DriverTypes.FETCH_STUDENT_PROGRESS_ERROR:
      return {
        ...state,
        studentProgressError: payload,
        studentProgressLoading: false,
      };

    default:
      return state;
  }
};

export default driverReducer;
