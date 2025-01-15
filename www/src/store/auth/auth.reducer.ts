// project imports
import * as AuthType from "./auth.types";
import { IAuthState } from "../interface";

const INITIAL_STATE: IAuthState = {
  access_token:
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null,
  isAuthenticated: null,
  authLoading: true,
  currentUser: {},
  uploading: false,
  newUser: {},
  error: null,
  loading: true,
  isEditing: false,
  isFetching: false,
  profile: null,
  loadUserFailed: false,
  notifiedForVerification: false,
  recoverPassword: {
    loading: false,
    error: null,
  },
  role: null,
  id : null,
};

const authReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case AuthType.SIGN_IN_START:
      return {
        ...state,
        error: null,
        // authLoading: true,
      };

    case AuthType.SIGN_UP_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case AuthType.LOAD_USER_START:
      return {
        ...state,
        isFetching: true,
        authLoading: true,
      };

    case AuthType.FORGET_PASSWORD_RESET_START:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: true,
        },
      };

    case AuthType.VERIFY_OTP_START:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: true,
        },
      };

    case AuthType.RESET_PASSWORD_START:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: true,
        },
      };

    case AuthType.SIGN_IN_SUCCESS:
      localStorage.setItem("access_token", payload.access_token);
      localStorage.setItem("refresh_token", payload.refresh_token);
      localStorage.setItem("expires_in", payload.expires_in);
      return {
        ...state,
        ...payload,
        access_token: payload.access_token,
        isAuthenticated: true,
        authLoading: false,
      };

    case AuthType.VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          is_verified: true,
        },
      };

    case AuthType.SIGN_UP_SUCCESS:
      return {
        ...state,
        loading: false,
        newUser: payload,
      };

    case AuthType.LOGOUT_SUCCESS:
      return {
        ...state,
        access_token:
          typeof window !== "undefined"
            ? localStorage.getItem("access_token")
            : null,
        isAuthenticated: null,
        authLoading: false,
        uploading: false,
        newUser: {},
        error: null,
        isEditing: false,
        isFetching: false,
        profile: null,
        currentUser: null,
        loadUserFailed: false,
      };

    case AuthType.LOAD_USER_SUCCESS:
      return {
        ...state,
        isFetching: false,
        currentUser: payload,
        isAuthenticated: true,
        authLoading: false,
        loadUserFailed: false,
      };

    case AuthType.FORGET_PASSWORD_RESET_SUCCESS:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
        },
      };

    case AuthType.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
        },
      };

    case AuthType.RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
        },
      };

    case AuthType.LOAD_USER_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: payload,
        isAuthenticated: false,
        currentUser: null,
        authLoading: false,
        loadUserFailed: true,
      };

    case AuthType.SIGN_IN_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
        authLoading: false,
      };

    case AuthType.SIGN_UP_FAILURE:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case AuthType.FORGET_PASSWORD_RESET_FAILURE:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
          error: payload,
        },
      };

    case AuthType.VERIFY_OTP_FAILURE:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
          error: payload,
        },
      };

    case AuthType.RESET_PASSWORD_FAILURE:
      return {
        ...state,
        recoverPassword: {
          ...state.recoverPassword,
          loading: false,
          error: payload,
        },
      };

    case AuthType.UPDATE_NOTIFIED_FOR_VERIFICATION:
      return {
        ...state,
        notifiedForVerification: true,
      };

    default:
      return state;
  }
};

export default authReducer;
