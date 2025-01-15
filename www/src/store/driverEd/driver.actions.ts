import { Dispatch } from "@reduxjs/toolkit";
import * as DriverTypes from "./driver.types";
import axiosInstance from "@/config/axios.config";
import { openAlert } from "../alert/alert.actions";

export const fetchUnitsList = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_UNITS_LIST_START });
    const { data } = await axiosInstance.get(`/driver_ed_unit/get`);
    dispatch({
      type: DriverTypes.FETCH_UNITS_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_UNITS_LIST_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error fetching units", "error"));
  }
};

export const fetchUnitLessonById =
  (id: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: DriverTypes.FETCH_UNITS_LESSONS_BY_ID_START });
      const { data } = await axiosInstance.get(`/driver_ed_lesson/get/${id}`);
      dispatch({
        type: DriverTypes.FETCH_UNITS_LESSONS_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DriverTypes.FETCH_UNITS_LESSONS_BY_ID_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error lessons for unit", "error"));
    }
  };

export const fetchLessonDetails =
  (lessonId: string, unitId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: DriverTypes.FETCH_LESSON_DETAILS_START });
      const { data } = await axiosInstance.get(
        `/driver_ed_section/get?unit_id=${unitId}&lesson_id=${lessonId}`
      );
      dispatch({
        type: DriverTypes.FETCH_LESSON_DETAILS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DriverTypes.FETCH_LESSON_DETAILS_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error fetching lesson details", "error"));
    }
  };

export const fetchUnitQuizById = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_UNIT_QUIZ_BY_ID_START });
    const { data } = await axiosInstance.get(`/driver_ed_question/get/${id}`);
    dispatch({
      type: DriverTypes.FETCH_UNIT_QUIZ_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_UNIT_QUIZ_BY_ID_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error quiz for unit", "error"));
  }
};

interface QuizSubmission {
  question_id: number;
  selected_option: string;
}

export const submitUnitQuiz =
  (unitId: string, formData: QuizSubmission[]) =>
  async (dispatch: Dispatch) => {
    try {
      dispatch({ type: DriverTypes.SUBMIT_UNIT_QUIZ_START });
      const { data } = await axiosInstance.post(
        `/driver_ed_quiz/submit_quiz/${unitId}`,
        formData
      );
      dispatch({
        type: DriverTypes.SUBMIT_UNIT_QUIZ_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DriverTypes.SUBMIT_UNIT_QUIZ_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error submitting quiz", "error"));
    }
  };

export const fetchVideoList = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_VIDEO_LIST_START });
    const { data } = await axiosInstance.get(`/driver_ed_optional_video/get`);
    dispatch({
      type: DriverTypes.FETCH_VIDEO_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_VIDEO_LIST_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error fetching videos", "error"));
  }
};

export const fetchChartList = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_CHART_LIST_START });
    const { data } = await axiosInstance.get(`/driver_ed_images/get/sections`);
    dispatch({
      type: DriverTypes.FETCH_CHART_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_CHART_LIST_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error fetching chart's sections", "error"));
  }
};

export const fetchChartById = (id: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_CHART_BY_ID_START });
    const { data } = await axiosInstance.get(
      `/driver_ed_images/get/images/${id}`
    );
    dispatch({
      type: DriverTypes.FETCH_CHART_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_CHART_BY_ID_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error quiz for unit", "error"));
  }
};

export const fetchFinalExam = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_FINAL_EXAM_START });
    const { data } = await axiosInstance.get(`/driver_ed_question/get/final`);
    dispatch({
      type: DriverTypes.FETCH_FINAL_EXAM_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_FINAL_EXAM_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error fetching final exam", "error"));
  }
};

export const submitFinalExam =
  (formData: QuizSubmission[]) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: DriverTypes.SUBMIT_FINAL_EXAM_START });
      const { data } = await axiosInstance.post(
        `/driver_ed_quiz/submit_quiz`,
        formData
      );
      dispatch({
        type: DriverTypes.SUBMIT_FINAL_EXAM_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DriverTypes.SUBMIT_FINAL_EXAM_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error submitting quiz", "error"));
    }
  };

export const fetchStudentTestStatus =
  (userId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: DriverTypes.FETCH_STUDENT_TEST_STATUS_START });
      const { data } = await axiosInstance.get(
        `/driver_ed_quiz/log/user/${userId}`
      );
      dispatch({
        type: DriverTypes.FETCH_STUDENT_TEST_STATUS_SUCCESS,
        payload: data.quiz_log,
      });
    } catch (error) {
      dispatch({
        type: DriverTypes.FETCH_STUDENT_TEST_STATUS_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error fetching student test status", "error"));
    }
  };

export const fetchStudentProgress = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: DriverTypes.FETCH_STUDENT_PROGRESS_START });
    const { data } = await axiosInstance.get(`/driver_ed_lesson/log/get`);
    dispatch({
      type: DriverTypes.FETCH_STUDENT_PROGRESS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DriverTypes.FETCH_STUDENT_PROGRESS_ERROR,
      payload: error,
    });
    dispatch(openAlert("Error fetching student progress", "error"));
  }
};
