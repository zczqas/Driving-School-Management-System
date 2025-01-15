// third party libraries
import { Dispatch } from "redux";

// project imports
import * as UserTypes from "./user.types";
import axiosInstance from "../../config/axios.config";
import { openAlert } from "../alert/alert.actions";
import { createFormData } from "@/utils/helper";

export const fetchUsers =
  (
    role: "STUDENT" | "INSTRUCTOR" | "ALL" | "NOT_STUDENT",
    offset: number = 0,
    limit: number = 100,
    name?: string,
    email?: string,
    driving_school_id?: number,
    is_active?: boolean
  ) =>
    async (dispatch: Dispatch) => {
      dispatch({ type: UserTypes.FETCH_USER_LIST_START });
      try {
        let url = `user/get?role=${role}&offset=${offset}&limit=${limit}`;
        if (name) {
          url += `&name=${name}`;
        }
        if (email) {
          url += `&email=${email}`;
        }
        if (driving_school_id) {
          url += `&driving_school_id=${driving_school_id}`;
        }
        if (typeof is_active === 'boolean') { 
          url += `&is_active=${is_active}`;
        }
        const { data } = await axiosInstance.get(url);
        dispatch({ type: UserTypes.FETCH_USER_LIST_SUCCESS, payload: data });
      } catch (error: any) {
        dispatch({
          type: UserTypes.FETCH_USER_LIST_ERROR,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
    };

export const fetchUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.FETCH_USER_START });
  try {
    const { data } = await axiosInstance.get(`/user/get/${id}`);
    dispatch({ type: UserTypes.FETCH_USER_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

type User = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  cell_phone?: string;
  apartment?: string;
  city?: string;
  state?: string;
  gender?: string;
  dob?: string;
  school?: string | (string | null)[] | null;
  address?: string;
};

export const createUser =
  (user: User, cb?: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: UserTypes.CREATE_USER_START });
    try {
      const { data } = await axiosInstance.post("/user/post", user);
      console.log({ data });
      dispatch({ type: UserTypes.CREATE_USER_SUCCESS, payload: data });
      if (data?.user?.role === "STUDENT") {
        window.location.href = `/manage/profile/${data.user.id}?isEdit=true`;
      }
      if (cb) {
        cb();
      }
      dispatch(openAlert("User created successfully", "success"));
    } catch (error: any) {
      dispatch({
        type: UserTypes.CREATE_USER_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
      dispatch(openAlert("Failed to create user", "error"));
    }
  };

export const deleteUser = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.DELETE_USER_START });
  try {
    const { data } = await axiosInstance.delete(`/user/delete/${id}`);
    dispatch({ type: UserTypes.DELETE_USER_SUCCESS, payload: data });
  } catch (error: any) {
    dispatch({
      type: UserTypes.DELETE_USER_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserRole =
  (id: number, role: "STUDENT" | "CSR" | "INSTRUCTOR") =>
    async (dispatch: Dispatch) => {
      dispatch({ type: UserTypes.UPDATE_USER_ROLE_START });
      try {
        const { data } = await axiosInstance.patch(
          `/user/update/role/${id}?role=${role}`
        );
        dispatch({
          type: UserTypes.UPDATE_USER_ROLE_SUCCESS,
          payload: { id, role },
        });
        dispatch(openAlert(data?.message || "User role updated successfully", "success"));
      } catch (error: any) {
        dispatch({
          type: UserTypes.UPDATE_USER_ROLE_ERROR,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
        dispatch(openAlert("Failed to update user role", "error"));
      }
    };

export const fetchUserDetails = () => async (dispatch: any) => {
  try {
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_START,
    });

    const { data } = await axiosInstance.get(`/profile/get`);
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_DETAILS_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const fetchUserDetailsById = (id: string, cb?: (data: any) => void) => async (dispatch: any) => {
  try {
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_START,
    });

    const { data } = await axiosInstance.get(`/profile/get/${id}`);
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_SUCCESS,
      payload: data,
    });
    if (cb) {
      cb(data)
    }
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_USER_BY_ID_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateUserDetails =
  (userFields: any, cb: any, id?: any, errCb?: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_START,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      // const formData = createFormData(userFields);
      let formData: any = {
        first_name: userFields?.firstName,
        last_name: userFields?.lastName,
        office_note: userFields?.notes,
        cell_phone: userFields?.cell_phone,
        gender: userFields?.gender,
        dob: userFields?.birthDate,
        school_id: userFields?.school?.id ? userFields?.school?.id : null,
        address: userFields?.address,
        apartment: userFields?.unit,
        city: userFields?.city,
        state: userFields?.state,
        zip_code: userFields?.zip ?? null,
        pickup_location_title: "Alternate Pickup Location",
        pickup_location_name: userFields?.pickUpLocationAddress,
        pickup_location_address: userFields?.pickUpLocationAddress,
        pickup_location_city: userFields?.pickUpLocationCity,
        pickup_location_apartment: userFields?.pickUpLocationUnit,
        permit_number: userFields?.permitNumber,
        permit_issue_date: userFields?.permitDateIssued,
        permit_expiration_date: userFields?.permitExpDate,
        permit_endorse_date: userFields?.permitEndorsedDate,
        permit_endorse_by_id: userFields?.permitEndorsedBy?.id,
        contacts: [],
      };

      if (userFields.contactName || userFields.contactEmail || userFields.contactPhone || userFields.contactRelation) {
        formData.contacts.push({
          contact_name: userFields.contactName ? (userFields.contactName.trim() || null) : null,
          contact_email: userFields.contactEmail ? (userFields.contactEmail.trim() || null) : null,
          contact_phone: userFields.contactPhone ? (userFields.contactPhone.trim() || null) : null,
          contact_relationship: userFields.contactRelation ? (userFields.contactRelation.trim() || null) : null,
          contact_type: "FIRST_EMERGENCY_CONTACT",
        });
      }

      if (userFields.secondContactName || userFields.secondContactEmail || userFields.secondContactPhone || userFields.secondContactRelation) {
        formData.contacts.push({
          contact_name: userFields.secondContactName ? (userFields.secondContactName.trim() || null) : null,
          contact_email: userFields.secondContactEmail ? (userFields.secondContactEmail.trim() || null) : null,
          contact_phone: userFields.secondContactPhone ? (userFields.secondContactPhone.trim() || null) : null,
          contact_relationship: userFields.secondContactRelation ? (userFields.secondContactRelation.trim() || null) : null,
          contact_type: "SECOND_EMERGENCY_CONTACT",
        });
      }

      if (formData.contacts.length === 0) {
        formData.contacts = null;
      }
      let url = `/profile/update`;
      if (id) {
        url = `/profile/update/${id}`;
      }
      const { data } = await axiosInstance.put(url, formData, config);
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("User profile updated succesfully", "success"));
      dispatch(fetchUserDetails());

      if (cb) {
        cb();
      }
    } catch (error: any) {

      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
      dispatch(openAlert("Failed to update user profile", "error"));

      if (errCb) {
        errCb();
      }
    }
  };

export const uploadUserFilePDF =
  (file: any, cb: any, user_id: number, name: string, description: string) =>
    async (dispatch: any) => {
      try {
        dispatch({
          type: UserTypes.UPLOAD_FILES_PDF_START,
        });

        const formData = new FormData();
        formData.append("document_img", file);
        formData.append("name", name || "");
        formData.append("description", description || "");
        const { data } = await axiosInstance.post(
          `/document/post/${user_id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        dispatch({
          type: UserTypes.UPLOAD_FILES_PDF_SUCCESS,
          payload: data,
        });
        dispatch(openAlert("File uploaded successfully", "success"));
        dispatch(fetchUserDetails());

        if (cb) {
          cb();
        }
      } catch (error: any) {
        dispatch({
          type: UserTypes.UPLOAD_FILES_PDF_ERROR,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
        dispatch(openAlert("Failed to upload file", "error"));

        if (cb) {
          cb();
        }
      }
    };

export const addInstructorNote =
  (note: string, student_id: string, appointment_schedule_id: string, cb: any) =>
    async (dispatch: any) => {
      try {
        dispatch({
          type: UserTypes.ADD_INSTRUCTOR_NOTE_START,
        });

        const { data } = await axiosInstance.post(
          `/profile/instructor_note/create`,
          {
            note,
            student_id: parseInt(student_id),
            appointment_schedule_id: parseInt(appointment_schedule_id),
          }
        );
        dispatch({
          type: UserTypes.ADD_INSTRUCTOR_NOTE_SUCCESS,
          payload: data,
        });
        dispatch(openAlert("Note added successfully", "success"));
        dispatch(fetchUserDetails());

        if (cb) {
          cb();
        }
      } catch (error: any) {
        dispatch({
          type: UserTypes.ADD_INSTRUCTOR_NOTE_ERROR,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
        dispatch(
          openAlert(
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message ?? "Failed to add note",
            "error"
          )
        );

        if (cb) {
          cb();
        }
      }
    };

export const updateInstructorNotes =
  (note: string, note_id: string, cb: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: UserTypes.UPDATE_INSTRUCTOR_NOTE_START,
      });

      const { data } = await axiosInstance.put(
        `/profile/instructor_note/${note_id}`,
        { note }
      );
      dispatch({
        type: UserTypes.UPDATE_INSTRUCTOR_NOTE_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("Note updated successfully", "success"));
      // dispatch(fetchUserDetails());

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: UserTypes.UPDATE_INSTRUCTOR_NOTE_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
      dispatch(
        openAlert(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message ?? "Failed to update note",
          "error"
        )
      );

      if (cb) {
        cb();
      }
    }
  };
// Define an interface for the structure of training logs
interface TrainingLogs {
  [lessonId: number]: any[]; // Each lesson ID maps to an array of training logs. You can replace `any[]` with the appropriate type if known.
}

// Function to fetch training logs by user ID and lesson ID list
export const fetchTrainingLogsByUserIdAndLessonId =
  (userId: number, lessonIdList: number[]) => async (dispatch: Dispatch) => {
    // Dispatch an action to indicate the start of fetching training logs
    dispatch({
      type: UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_START,
      payload: { userId, lessonIdList }
    });
    try {
      // Create an array of promises to fetch training logs for each lesson ID
      const trainingLogPromises = lessonIdList.map(async (lessonId: number) => {
        // Fetch training logs for the current lesson ID
        const { data } = await axiosInstance.get(
          `/training_logs/get?lesson_id=${lessonId}&user_id=${userId}&offset=0&limit=10000`
        );
        // Return an object containing the lesson ID and its corresponding training logs
        return { lessonId, trainingLogs: data?.training_logs };
      });

      // Wait for all training log promises to resolve
      const trainingLogsArray = await Promise.all(trainingLogPromises);

      // Reduce the array of training logs into a single object
      const trainingLogs = trainingLogsArray.reduce(
        (acc: TrainingLogs, curr) => {
          acc[curr.lessonId] = curr.trainingLogs; // Assign the training logs to the corresponding lesson ID
          return acc;
        },
        {}
      );

      // Dispatch an action to indicate successful fetching of training logs, along with the fetched training logs
      dispatch({
        type: UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_SUCCESS,
        payload: trainingLogs,
      });
    } catch (error) {
      // Dispatch an action to indicate error in fetching training logs, along with the error object
      dispatch({
        type: UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_ERROR,
        payload: error,
      });
    }
  };

export const createTrainingLogs =
  (trainingId: number, userId: number, lessonId: number, cb: any) =>
    async (dispatch: Dispatch) => {
      dispatch({
        type: UserTypes.CREATE_TRAINING_LOG_START,
        payload: {
          training_id: trainingId,
          user_id: userId,
          lesson_id: lessonId,
          is_completed: true,
        },
      });
      try {
        const { data } = await axiosInstance.post(`/training_logs/post`, {
          training_id: trainingId,
          user_id: userId,
          lesson_id: lessonId,
          is_completed: true,
        });
        dispatch(openAlert("Training logs created successfully", "success"));
        dispatch({
          type: UserTypes.CREATE_TRAINING_LOG_SUCCESS,
          payload: data?.training_log,
        });
        if (cb) {
          cb();
        }
      } catch (error: any) {
        dispatch(openAlert("Failed to create training logs", "error"));
        dispatch({
          type: UserTypes.CREATE_TRAINING_LOG_ERROR,
          payload: {
            error,
            data: {
              training_id: trainingId,
              user_id: userId,
              lesson_id: lessonId,
              is_completed: true,
            },
          },
        });
      }
    };

export const updateTrainingLogs =
  (
    trainingLogId: number,
    trainingId: number,
    userId: number,
    lessonId: number,
    status: boolean,
    cb: any
  ) =>
    async (dispatch: Dispatch) => {
      dispatch({
        type: UserTypes.UPDATE_TRAINING_LOG_START,
        payload: {
          id: trainingLogId,
          training_id: trainingId,
          user_id: userId,
          lesson_id: lessonId,
          is_completed: status,
        },
      });
      try {
        const { data } = await axiosInstance.put(
          `/training_logs/put/${trainingLogId}`,
          {
            training_id: trainingId,
            user_id: userId,
            lesson_id: lessonId,
            is_completed: status,
          }
        );
        dispatch(openAlert("Training logs updated successfully", "success"));
        dispatch({
          type: UserTypes.UPDATE_TRAINING_LOG_SUCCESS,
          payload: {
            id: trainingLogId,
            training_id: trainingId,
            user_id: userId,
            lesson_id: lessonId,
            is_completed: status,
          },
        });
        if (cb) {
          cb();
        }
      } catch (error: any) {
        dispatch(openAlert("Failed to update training logs", "error"));
        // To revert the status of the training log in the state, dispatch an action with the previous status
        dispatch({
          type: UserTypes.UPDATE_TRAINING_LOG_ERROR,
          payload: {
            error,
            data: {
              id: trainingLogId,
              training_id: trainingId,
              user_id: userId,
              lesson_id: lessonId,
              is_completed: !status,
            },
          },
        });
      }
    };

export const getInstructorNotesByUserId =
  (userId: string) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: UserTypes.GET_INSTRUCTOR_NOTES_BY_USER_ID });
      const { data } = await axiosInstance.get(
        `/profile/instructor_note/${userId}`
      );
      dispatch({
        type: UserTypes.GET_INSTRUCTOR_NOTES_BY_USER_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch(openAlert("Failed to fetch instructor notes", "error"));
    }
  };

export const updateUserDetailsFromList =
  (formData: any, cb: any, id?: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_FROM_LIST_START,
        payload: { formData, id },
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axiosInstance.put(
        `/profile/update/${id}`,
        formData,
        config
      );
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_FROM_LIST_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("User profile updated succesfully", "success"));

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: UserTypes.UPDATE_USER_DETAILS_FROM_LIST_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
      dispatch(openAlert("Failed to update user profile", "error"));

      if (cb) {
        cb();
      }
    }
  };


// Toggle user status
export const updateUserStatus = (id: number, status: boolean) => async (dispatch: Dispatch) => {
  dispatch({
    type: UserTypes.UPDATE_USER_STATUS_START,
    payload: { id, status },
  });
  try {
    let data;
    if(!status){
     const response = await axiosInstance.patch(`/profile/lock/${id}`);
     data = response.data;
    }else{
     const response = await axiosInstance.patch(`/profile/unlock/${id}`);
     data = response.data;
    }
    dispatch({
      type: UserTypes.UPDATE_USER_STATUS_SUCCESS,
      payload: { id, status },
    });
    dispatch(openAlert(data?.message || "User status updated successfully", "success"));
  } catch (error: any) {
    dispatch({
      type: UserTypes.UPDATE_USER_STATUS_ERROR,
      payload: { id, status: !status },
    });
    dispatch(openAlert(error?.response?.data?.message || "Failed to update user status", "error"));
  }
} 

export const updateInstructor = 
  (id: number, user: Partial<User>, cb?: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: UserTypes.UPDATE_INSTRUCTOR_START });
    try {
      const { data } = await axiosInstance.put(`/profile/update/${id}`, user);
      dispatch({ type: UserTypes.UPDATE_INSTRUCTOR_SUCCESS, payload: data });
      if (cb) {
        cb();
      }
      dispatch(openAlert("Instructor updated successfully", "success"));
    } catch (error: any) {
      dispatch({
        type: UserTypes.UPDATE_INSTRUCTOR_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
      dispatch(openAlert("Failed to update instructor", "error"));
    }
  }; 

export const fetchInstructor = (id: number, cb?: (data: any) => void) => async (dispatch: Dispatch) => {
  dispatch({ type: UserTypes.FETCH_INSTRUCTOR_START });
  try {
    const { data } = await axiosInstance.get(`/profile/get/${id}`);
    dispatch({ type: UserTypes.FETCH_INSTRUCTOR_SUCCESS, payload: data });
    if (cb) {
      cb(data);
    }
  } catch (error: any) {
    dispatch({
      type: UserTypes.FETCH_INSTRUCTOR_ERROR,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const clearInstructor = () => ({
  type: UserTypes.CLEAR_INSTRUCTOR,
}); 

export const updateUserLockStatus = (id: number, status: boolean) => async (dispatch: Dispatch) => {
  dispatch({
    type: UserTypes.UPDATE_USER_LOCK_STATUS_START,
    payload: { id, status }
  });
  try {
    if(!status){
      await axiosInstance.patch(`/profile/lock/${id}`);
    }else{
      await axiosInstance.patch(`/profile/unlock/${id}`);
    }
    dispatch({
      type: UserTypes.UPDATE_USER_LOCK_STATUS_SUCCESS,
      payload: { id, status }
    });
    dispatch(openAlert("User lock status updated successfully", "success"));
  } catch (error: any) {
    dispatch({
      type: UserTypes.UPDATE_USER_LOCK_STATUS_ERROR,
      payload: { id, status }
    });
    dispatch(openAlert("Failed to update user lock status", "error"));
  }
};
