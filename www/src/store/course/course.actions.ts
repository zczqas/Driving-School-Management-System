import axiosInstance from "@/config/axios.config";
import { AxiosResponse } from "axios";
import { Dispatch } from "redux";
import { CourseActionTypes } from "./course.type";
import { openAlert } from "../alert/alert.actions";

// Course
export const fetchCourses =
  (offset: number = 0, limit: number = 10, search?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSES });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/get`,
        { params: { offset, limit, title: search } }
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSES_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSES_ERROR,
        payload: errorMessage,
      });
    }
  };

export const fetchCourseById =
  (courseId: number) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_BY_ID });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/get/${courseId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_BY_ID_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_BY_ID_ERROR,
        payload: errorMessage,
      });
    }
  };

export const createCourse =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.CREATE_COURSE });

    try {
      const response = await axiosInstance.post(`/course/create`, data);
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Course created successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create course", "error"));
    }
  };

export const deleteCourse =
  (courseId: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.DELETE_COURSE });

    try {
      const response = await axiosInstance.delete(`/course/delete/${courseId}`);
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_SUCCESS,
        payload: courseId,
      });
      dispatch(openAlert("Course deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete course", "error"));
    }
  };

export const updateCourse =
  (courseId: number, data: any, cb: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.UPDATE_COURSE });
    try {
      const response = await axiosInstance.put(
        `/course/update/${courseId}`,
        data
      );
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Course updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update course", "error"));
    }
  };

// Course Unit
export const fetchUnitsByCourseId =
  (courseId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_UNITS_BY_COURSE_ID });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/unit/get/course/${courseId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_UNITS_BY_COURSE_ID_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_UNITS_BY_COURSE_ID_ERROR,
        payload: errorMessage,
      });
    }
  };

export const fetchUnitsById =
  (course_unit_id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/unit/get/${course_unit_id}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_UNITS_BY_COURSE_UNIT_ID_ERROR,
        payload: errorMessage,
      });
    }
  };

export const createUnit =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.CREATE_UNIT });

    try {
      const response = await axiosInstance.post(`/course/unit/create`, data);
      dispatch({
        type: CourseActionTypes.CREATE_UNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Unit created successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: CourseActionTypes.CREATE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create unit", "error"));
    }
  };

export const updateUnit =
  (unitId: number, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.UPDATE_UNIT });
    try {
      const response = await axiosInstance.put(
        `/course/unit/update/${unitId}`,
        data
      );
      dispatch({
        type: CourseActionTypes.UPDATE_UNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Unit updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.UPDATE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update unit", "error"));
    }
  };

export const deleteUnit =
  (unitId: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.DELETE_UNIT });

    try {
      const response = await axiosInstance.delete(
        `/course/unit/delete/${unitId}`
      );
      dispatch({
        type: CourseActionTypes.DELETE_UNIT_SUCCESS,
        payload: unitId,
      });
      dispatch(openAlert("Unit deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.DELETE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete unit", "error"));
    }
  };

// Course Lesson
export const fetchCourseLessonByUnitId =
  (courseId: number, cb?: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_LESSON });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/lesson/get/unit/${courseId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_LESSON_SUCCESS,
          payload: response.data,
        });
        if (cb) {
          cb();
        }
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_LESSON_ERROR,
        payload: errorMessage,
      });
    }
  };

export const getCourseLessonById =
  (lessonId: number) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_LESSON_BY_ID });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/lesson/get/${lessonId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_LESSON_BY_ID_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_LESSON_BY_ID_ERROR,
        payload: errorMessage,
      });
    }
  };

export const createCourseLessonContent =
  (data: any, cb?: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.CREATE_COURSE_LESSON_CONTENT });
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("body", data.body);
    formData.append("unit_id", data.unit_id);
    if (data.video) {
      formData.append("video", data.video);
    }
    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.image_name) {
      if (data.image_name !== "") {
        formData.append("image_name", data.image_name);
      }
    }
    if (data.video_name) {
      if (data.video_name !== "") {
        formData.append("video_name", data.video_name);
      }
    }
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    try {
      const response = await axiosInstance.post(
        `/course/lesson/create`,
        formData,
        { headers }
      );
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_LESSON_CONTENT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Lesson created successfully", "success"));
      if (cb) {
        cb();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_LESSON_CONTENT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create lesson", "error"));
    }
  };

// export const createCourseLessonVideo =
//   (data: any, cb: () => void) => async (dispatch: Dispatch) => {
//     dispatch({ type: CourseActionTypes.CREATE_COURSE_LESSON_VIDEO });

//     try {
//       const response = await axiosInstance.post(
//         `/course/lesson/video/create`,
//         data
//       );
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_LESSON_VIDEO_SUCCESS,
//         payload: response.data,
//       });
//       dispatch(openAlert("Lesson created successfully", "success"));
//       cb();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.detail || error.message;
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_LESSON_VIDEO_ERROR,
//         payload: errorMessage,
//       });
//       dispatch(openAlert(errorMessage ?? "Failed to create lesson", "error"));
//     }
//   };
// export const createCourseLessonChart =
//   (data: any, cb: () => void) => async (dispatch: Dispatch) => {
//     dispatch({ type: CourseActionTypes.CREATE_COURSE_LESSON_CHART });

//     try {
//       const response = await axiosInstance.post(
//         `/course/lesson/chart/create`,
//         data
//       );
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_LESSON_CHART_SUCCESS,
//         payload: response.data,
//       });
//       dispatch(openAlert("Lesson created successfully", "success"));
//       cb();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.detail || error.message;
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_LESSON_CHART_ERROR,
//         payload: errorMessage,
//       });
//       dispatch(openAlert(errorMessage ?? "Failed to create lesson", "error"));
//     }
//   };

export const updateCourseLesson =
  (lessonId: number, data: any, cb?: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.UPDATE_COURSE_LESSON });
    try {
      const response = await axiosInstance.put(
        `/course/lesson/update/${lessonId}`,
        data
      );
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_LESSON_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Lesson updated successfully", "success"));
      if (cb) {
        cb();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_LESSON_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update lesson", "error"));
    }
  };

export const deleteCourseLesson =
  (lessonId: number, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.DELETE_COURSE_LESSON });

    try {
      const response = await axiosInstance.delete(
        `/course/lesson/delete/${lessonId}`
      );
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_LESSON_SUCCESS,
        payload: lessonId,
      });
      dispatch(openAlert("Lesson deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_LESSON_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete lesson", "error"));
    }
  };

// Course Subunit
export const fetchCourseSubunit =
  (lessonId: string, unitId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_SUBUNIT });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/subunit/get?unit_id=${unitId}&lesson_id=${lessonId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_SUBUNIT_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_SUBUNIT_ERROR,
        payload: errorMessage,
      });
    }
  };

export const createCourseSubunit =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.CREATE_COURSE_SUBUNIT });

    try {
      const response = await axiosInstance.post(`/course/subunit/create`, data);
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_SUBUNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Subunit created successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_SUBUNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create subunit", "error"));
    }
  };

export const updateCourseSubunit =
  (subunitId: string, data: any, cb: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.UPDATE_COURSE_SUBUNIT });
    try {
      const response = await axiosInstance.put(
        `/course/subunit/update/${subunitId}`,
        data
      );
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_SUBUNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Subunit updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_SUBUNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update subunit", "error"));
    }
  };

export const deleteCourseSubunit =
  (subunitId: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.DELETE_COURSE_SUBUNIT });

    try {
      const response = await axiosInstance.delete(
        `/course/subunit/delete/${subunitId}`
      );
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_SUBUNIT_SUCCESS,
        payload: subunitId,
      });
      dispatch(openAlert("Subunit deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_SUBUNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete subunit", "error"));
    }
  };

// Course Question
export const fetchCourseQuestion =
  (unitId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_QUESTION });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/question/get/${unitId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_QUESTION_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_QUESTION_ERROR,
        payload: errorMessage,
      });
    }
  };

export const createCourseQuestion =
  (data: any, cb?: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.CREATE_COURSE_QUESTION });

    try {
      const response = await axiosInstance.post(
        `/course/question/create`,
        data
      );
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_QUESTION_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Question created successfully", "success"));
      if (cb) {
        cb();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: CourseActionTypes.CREATE_COURSE_QUESTION_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create question", "error"));
    }
  };

export const updateCourseQuestion =
  (questionId: number, data: any, cb: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.UPDATE_COURSE_QUESTION });
    try {
      const response = await axiosInstance.put(
        `/course/question/update/${questionId}`,
        data
      );
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_QUESTION_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Question updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.UPDATE_COURSE_QUESTION_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update question", "error"));
    }
  };

export const deleteCourseQuestion =
  (questionId: number, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.DELETE_COURSE_QUESTION });

    try {
      const response = await axiosInstance.delete(
        `/course/question/delete/${questionId}`
      );
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_QUESTION_SUCCESS,
        payload: questionId,
      });
      dispatch(openAlert("Question deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.DELETE_COURSE_QUESTION_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete question", "error"));
    }
  };

// Course Quiz
export const fetchCourseQuiz =
  (unitId: number) => async (dispatch: Dispatch) => {
    dispatch({ type: CourseActionTypes.GET_COURSE_QUIZ });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course_quiz/get_quiz/${unitId}`
      );
      if (response && response.data) {
        dispatch({
          type: CourseActionTypes.GET_COURSE_QUIZ_SUCCESS,
          payload: {
            questions: response.data,
            unitId: unitId,
          },
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: CourseActionTypes.GET_COURSE_QUIZ_ERROR,
        payload: errorMessage,
      });
    }
  };

// export const createCourseQuiz =
//   (data: any, cb: () => void) => async (dispatch: Dispatch) => {
//     dispatch({ type: CourseActionTypes.CREATE_COURSE_QUIZ });

//     try {
//       const response = await axiosInstance.post(`/course/quiz/create`, data);
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_QUIZ_SUCCESS,
//         payload: response.data,
//       });
//       dispatch(openAlert("Quiz created successfully", "success"));
//       cb();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.detail || error.message;
//       dispatch({
//         type: CourseActionTypes.CREATE_COURSE_QUIZ_ERROR,
//         payload: errorMessage,
//       });
//       dispatch(openAlert(errorMessage ?? "Failed to create quiz", "error"));
//     }
//   };

// export const updateCourseQuiz =
//   (quizId: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
//     dispatch({ type: CourseActionTypes.UPDATE_COURSE_QUIZ });
//     try {
//       const response = await axiosInstance.put(
//         `/course/quiz/update/${quizId}`,
//         data
//       );
//       dispatch({
//         type: CourseActionTypes.UPDATE_COURSE_QUIZ_SUCCESS,
//         payload: response.data,
//       });
//       dispatch(openAlert("Quiz updated successfully", "success"));
//       cb();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message;
//       dispatch({
//         type: CourseActionTypes.UPDATE_COURSE_QUIZ_ERROR,
//         payload: errorMessage,
//       });
//       dispatch(openAlert(errorMessage ?? "Failed to update quiz", "error"));
//     }
//   };

// export const deleteCourseQuiz =
//   (quizId: string, cb: () => void) => async (dispatch: Dispatch) => {
//     dispatch({ type: CourseActionTypes.DELETE_COURSE_QUIZ });

//     try {
//       const response = await axiosInstance.delete(
//         `/course/quiz/delete/${quizId}`
//       );
//       dispatch({
//         type: CourseActionTypes.DELETE_COURSE_QUIZ_SUCCESS,
//         payload: quizId,
//       });
//       dispatch(openAlert("Quiz deleted successfully", "success"));
//       cb();
//     } catch (error: any) {
//       const errorMessage = error.response?.data?.message || error.message;
//       dispatch({
//         type: CourseActionTypes.DELETE_COURSE_QUIZ_ERROR,
//         payload: errorMessage,
//       });
//       dispatch(openAlert(errorMessage ?? "Failed to delete quiz", "error"));
//     }
//   };
