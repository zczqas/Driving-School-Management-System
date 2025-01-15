import { IUserState } from "../interface";
import * as UserTypes from "./user.types";

const INITIAL_STATE: IUserState = {
  userList: null,
  userListLoading: false,
  userListError: null,
  userListSuccess: false,
  userCreateSuccess: false,
  userCreateLoading: false,
  userCreateError: null,
  userUpdateSuccess: false,
  userUpdateLoading: false,
  userUpdateError: null,
  userDeleteSuccess: false,
  userDeleteLoading: false,
  userDeleteError: null,
  userDetails: {
    loading: false,
    isUpdating: false,
    details: null,
    error: null,
  },
  userDetailsById: {
    loading: false,
    isUpdating: false,
    details: null,
    error: null,
  },
  uploadStudentFileError: null,
  uploadStudentFileProgress: 0,
  uploadStudentFileSuccess: false,
  instructorTrainingLogs: null,
  instructorTrainingLogsLoading: false,
  instructorTrainingLogsError: null,
  instructorNotesByUserId: null,
  instructorNotesByUserIdLoading: false,
  instructorNotesByUserIdError: null,
  selectedInstructor: null,
  selectedInstructorLoading: false,
  selectedInstructorError: null,
};

const userReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case UserTypes.FETCH_USER_LIST_START:
      return {
        ...state,
        userListLoading: true,
        userList: null,
      };

    case UserTypes.FETCH_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          loading: true,
        },
      };

    case UserTypes.FETCH_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          loading: true,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          isUpdating: true,
        },
      };

    case UserTypes.FETCH_USER_LIST_SUCCESS:
      return {
        ...state,
        userList: payload,
        userListLoading: false,
        userListSuccess: true,
      };

    case UserTypes.FETCH_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          details: payload,
          loading: false,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          // details: payload,
          isUpdating: false,
        },
      };

    case UserTypes.FETCH_USER_LIST_ERROR:
      return {
        ...state,
        userListError: payload,
        userListLoading: false,
      };
    case UserTypes.UPDATE_USER_ROLE_START:
      return {
        ...state,
        userUpdateLoading: true,
      };
    case UserTypes.UPDATE_USER_ROLE_SUCCESS:
      return {
        ...state,
        userUpdateLoading: false,
        userUpdateSuccess: true,
        userList: {
          ...state.userList,
          users: state?.userList?.users.filter(
            (user: any) => user.id !== payload.id
          ),
        },
      };
    case UserTypes.UPDATE_USER_ROLE_ERROR:
      return {
        ...state,
        userUpdateLoading: false,
        userUpdateError: payload,
      };

    case UserTypes.FETCH_USER_DETAILS_ERROR:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          error: payload,
          loading: false,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_ERROR:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          error: payload,
          isUpdating: false,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_START:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          loading: true,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_SUCCESS:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          details: payload,
          loading: false,
        },
      };

    case UserTypes.FETCH_USER_BY_ID_ERROR:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          error: payload,
          loading: false,
        },
      };

    case UserTypes.UPLOAD_FILES_PDF_START:
      return {
        ...state,
        uploadStudentFileError: payload,
        uploadStudentFileSuccess: false,
      };
    case UserTypes.UPLOAD_FILES_PDF_SUCCESS:
      return {
        ...state,
        uploadStudentFileError: null,
        uploadStudentFileSuccess: true,
      };
    case UserTypes.UPLOAD_FILES_PDF_ERROR:
      return {
        ...state,
        uploadStudentFileError: payload,
        uploadStudentFileSuccess: false,
      };

    case UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_START:
      return {
        ...state,
        instructorTrainingLogs: null,
        instructorTrainingLogsLoading: true,
      };

    case UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_SUCCESS:
      return {
        ...state,
        instructorTrainingLogs: payload,
        instructorTrainingLogsLoading: false,
      };

    case UserTypes.FETCH_TRAINING_LOGS_BY_USER_ID_AND_LESSON_ID_ERROR:
      return {
        ...state,
        instructorTrainingLogsError: payload,
        instructorTrainingLogsLoading: false,
      };

    case UserTypes.CREATE_TRAINING_LOG_START:
      return {
        ...state,
        instructorTrainingLogs: {
          ...state.instructorTrainingLogs,
          [payload?.lesson_id]: [
            ...state.instructorTrainingLogs?.[payload?.lesson_id],
            payload,
          ],
        },
        // instructorTrainingLogsLoading: true,
      };

    case UserTypes.CREATE_TRAINING_LOG_SUCCESS:
      return {
        ...state,
        instructorTrainingLogsLoading: false,
        instructorTrainingLogs: {
          ...state.instructorTrainingLogs,
          [payload.lesson_id]: state.instructorTrainingLogs[
            payload.lesson_id
          ].map((log: any) =>
            log.lesson_id === payload.lesson_id &&
              log.training_id === payload.training_id
              ? payload
              : log
          ),
        },
        // instructorTrainingLogs: { ...state.instructorTrainingLogs, [payload?.lesson_id]: [...state.instructorTrainingLogs?.[payload?.lesson_id], payload] },
      };

    case UserTypes.CREATE_TRAINING_LOG_ERROR:
      return {
        ...state,
        instructorTrainingLogs: {
          ...state.instructorTrainingLogs,
          [payload?.data.lesson_id]: state.instructorTrainingLogs[
            payload?.data.lesson_id
          ].filter(
            (log: any) =>
              log.lesson_id !== payload.data.lesson_id &&
              log.training_id !== payload.data.training_id
          ),
        },
        // instructorTrainingLogsLoading: false,
      };

    case UserTypes.UPDATE_TRAINING_LOG_START:
      return {
        ...state,
        instructorTrainingLogs: {
          ...state.instructorTrainingLogs,
          [payload.lesson_id]: state.instructorTrainingLogs[
            payload.lesson_id
          ].map((log: any) => (log.id === payload.id ? payload : log)),
        },
      };
    case UserTypes.UPDATE_TRAINING_LOG_SUCCESS:
      return {
        ...state,
        // instructorTrainingLogs: {
        //   ...state.instructorTrainingLogs,
        //   [payload.lesson_id]: state.instructorTrainingLogs[payload.lesson_id].map((log: any) => log.id === payload.id ? payload : log),
        // },
      };
    case UserTypes.UPDATE_TRAINING_LOG_ERROR:
      return {
        ...state,
        instructorTrainingLogs: {
          ...state.instructorTrainingLogs,
          [payload?.data.lesson_id]: state.instructorTrainingLogs[
            payload?.data.lesson_id
          ].map((log: any) =>
            log.id === payload?.data.id ? payload?.data : log
          ),
        },
      };

    case UserTypes.GET_INSTRUCTOR_NOTES_BY_USER_ID:
      return {
        ...state,
        instructorNotesByUserIdLoading: true,
      };

    case UserTypes.GET_INSTRUCTOR_NOTES_BY_USER_ID_SUCCESS:
      return {
        ...state,
        instructorNotesByUserId: payload,
        instructorNotesByUserIdLoading: false,
      };

    case UserTypes.GET_INSTRUCTOR_NOTES_BY_USER_ID_ERROR:
      return {
        ...state,
        instructorNotesByUserIdError: payload,
        instructorNotesByUserIdLoading: false,
      };

    case UserTypes.UPDATE_USER_DETAILS_FROM_LIST_START:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          isUpdating: true,
        },
        userList: {
          ...state.userList,
          users: state?.userList?.users.map((user: any) =>
            user.id === payload.id ? { ...user, ...payload.formData } : user
          ),
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_FROM_LIST_SUCCESS:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          // details: payload,
          isUpdating: false,
        },
      };

    case UserTypes.UPDATE_USER_DETAILS_FROM_LIST_ERROR:
      return {
        ...state,
        userDetails: {
          ...state.userDetails,
          error: payload,
          isUpdating: false,
        },
      };

    case UserTypes.UPDATE_USER_STATUS_START:
      return {
        ...state,
        userList: {
          ...state.userList,
          users: state?.userList?.users.map((user: any) =>
            user.id === payload.id ? { ...user, is_active: payload.status } : user
          ),
        },
      };

    case UserTypes.UPDATE_USER_STATUS_SUCCESS:
      return {
        ...state,
      };

    case UserTypes.UPDATE_USER_STATUS_ERROR:
      return {
        ...state,
        userList: {
          ...state.userList,
          users: state?.userList?.users.map((user: any) =>
            user.id === payload.id ? { ...user, is_active: payload.status } : user
          ),
        },
      };

    case UserTypes.FETCH_INSTRUCTOR_START:
      return {
        ...state,
        selectedInstructorLoading: true,
        selectedInstructorError: null,
      };

    case UserTypes.FETCH_INSTRUCTOR_SUCCESS:
      return {
        ...state,
        selectedInstructor: payload,
        selectedInstructorLoading: false,
      };

    case UserTypes.FETCH_INSTRUCTOR_ERROR:
      return {
        ...state,
        selectedInstructorError: payload,
        selectedInstructorLoading: false,
      };

    case UserTypes.CLEAR_INSTRUCTOR:
      return {
        ...state,
        selectedInstructor: null,
        selectedInstructorError: null,
      };

    case UserTypes.UPDATE_USER_LOCK_STATUS_START:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          details: {
            ...state.userDetailsById.details,
            user: {
              ...state.userDetailsById.details.user,
              is_active: payload.status
            }
          }
        }
      };

    case UserTypes.UPDATE_USER_LOCK_STATUS_SUCCESS:
      return {
        ...state,
      };

    case UserTypes.UPDATE_USER_LOCK_STATUS_ERROR:
      return {
        ...state,
        userDetailsById: {
          ...state.userDetailsById,
          details: {
            ...state.userDetailsById.details,
            user: {
              ...state.userDetailsById.details.user,
              is_active: !payload.status
            }
          }
        }
      };

    default:
      return state;
  }
};

export default userReducer;
