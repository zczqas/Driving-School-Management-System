// third party libraries
import { Dispatch } from "redux";

// project imports
import * as AuthType from "./auth.types";
import axiosConfig from "../../config/axios.config";
import { openAlert } from "../alert/alert.actions";
import { createFormData } from "@/utils/helper";
import { useAppSelector } from "@/hooks";

type loginPayload = {
  username: string;
  password: string;
};

/**
 * Logs in a user using the provided login data.
 * @param {loginPayload} loginData - The login data containing username and password.
 * @param {function} dispatch - The dispatch function from Redux.
 * @returns None
 */
export const login = (loginData: loginPayload, cb: () => void) => async (dispatch: any) => {
  try {
    dispatch({
      type: AuthType.SIGN_IN_START,
    });

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const formData = new FormData();
    formData.append("username", loginData.username);
    formData.append("password", loginData.password);

    const { data } = await axiosConfig.post(`/auth/login`, formData, config);
    dispatch({
      type: AuthType.SIGN_IN_SUCCESS,
      payload: data,
    });
    dispatch(openAlert("Login Successful", "success"));
    dispatch(loadUser());
    if(cb) {
      cb();
    }
  } catch (error: any) {
    dispatch({
      type: AuthType.SIGN_IN_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch(openAlert(error.response && error.response.data.detail
      ? error.response.data.detail
      : "Error Logging In", "error"));
  }
};

interface registerPayload {
  first_name: string;
  username?: string;
  middle_name?: string;
  last_name: string;
  email: string;
  password: string;
  role: "STUDENT" | string;
}

/**
 * Registers a user with the provided form data and invokes a callback function upon completion.
 * @param {registerPayload} formData - The data needed to register a user.
 * @param {() => void} cb - The callback function to be invoked after registration.
 * @param {Dispatch} dispatch - The dispatch function from Redux to update the state.
 * @returns None
 */
export const register =
  (formData: registerPayload, cb: () => void) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: AuthType.SIGN_UP_START,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axiosConfig.post(
        `/auth/register`,
        formData,
        config
      );
      dispatch({
        type: AuthType.SIGN_UP_SUCCESS,
        payload: data,
      });
      dispatch(openAlert(data.message, "success"));
      dispatch(openAlert("Proceeding To Login", "success"));
      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: AuthType.SIGN_UP_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch(openAlert("Registration Failed! Please try again", "error"));
    }
  };

/**
 * Asynchronously loads user data from the server and dispatches actions based on the result.
 * @param {Dispatch} dispatch - The dispatch function from Redux to dispatch actions.
 * @returns None
 */
export const loadUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: AuthType.LOAD_USER_START,
    });

    const { data } = await axiosConfig.get(`/profile/get`);
    dispatch({
      type: AuthType.LOAD_USER_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: AuthType.LOAD_USER_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

/**
 * Logs out the user by clearing local storage and dispatching actions based on the result.
 * @returns None
 */
export const logout = () => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: AuthType.LOGOUT_START,
    });

    localStorage.clear();
    dispatch({
      type: AuthType.LOGOUT_SUCCESS,
    });
    dispatch(openAlert("Logout Successful", "success"));
  } catch (error: any) {
    dispatch({
      type: AuthType.LOGOUT_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch(openAlert("Logout Failed", "error"));
  }
};

/**
 * Sends a request to reset the password for the given email address.
 * @param {string} email - The email address for which the password reset is requested.
 * @param {Dispatch} dispatch - The dispatch function from Redux to update the state.
 * @returns None
 */
export const forgetPasswordReset =
  (email: string, cb: () => void) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: AuthType.FORGET_PASSWORD_RESET_START,
      });

      const { data } = await axiosConfig.get(`/auth/password/forget`, {
        params: {
          email: email,
        },
      });
      dispatch({
        type: AuthType.FORGET_PASSWORD_RESET_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("OTP Sent succesfully", "success"));

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: AuthType.FORGET_PASSWORD_RESET_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch(openAlert("Failed to verify email", "error"));
    }
  };

/**
 * Verify the OTP (One Time Password) by sending it to the server.
 * @param {string} otp - The One Time Password to verify.
 * @param {Dispatch} dispatch - The dispatch function from Redux.
 * @returns None
 */
export const verifyOTP =
  (otp: string, cb: () => void) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: AuthType.VERIFY_OTP_START,
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("otp", otp);

      const { data } = await axiosConfig.post(
        `/auth/password/verify-otp`,
        formData,
        config
      );
      dispatch({
        type: AuthType.VERIFY_OTP_SUCCESS,
        payload: data,
      });

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: AuthType.VERIFY_OTP_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch(openAlert("Failed to verify otp", "error"));
    }
  };

/**
 * Resets the password by sending a POST request to the server with the new password.
 * Dispatches actions based on the success or failure of the password reset operation.
 * @param {any} formValue - The form data containing the new password.
 * @param {any} cb - Callback function to be executed after the password reset operation.
 * @param {any} dispatch - The dispatch function provided by Redux.
 * @returns None
 */
export const resetPassword =
  (formValue: any, cb: any) => async (dispatch: any) => {
    try {
      dispatch({
        type: AuthType.RESET_PASSWORD_START,
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = createFormData(formValue);

      const { data } = await axiosConfig.post(
        `/auth/password/reset`,
        formData,
        config
      );
      dispatch({
        type: AuthType.RESET_PASSWORD_SUCCESS,
        payload: data,
      });
      dispatch(openAlert("Password updated succesfully", "success"));

      if (cb) {
        cb();
      }
    } catch (error: any) {
      dispatch({
        type: AuthType.RESET_PASSWORD_FAILURE,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
      dispatch(openAlert("Failed to change password", "error"));

      if (cb) {
        cb();
      }
    }
  };

export const resendEmailVerification = (email: string, cb: () => void) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: AuthType.RESEND_EMAIL_VERIFICATION_START,
    });

    const { data } = await axiosConfig.get(`/auth/resend-verification-email`, {
      params: {
        email: email,
      },
    });
    dispatch({
      type: AuthType.RESEND_EMAIL_VERIFICATION_SUCCESS,
      payload: data,
    });
    dispatch(openAlert("Email sent successfully", "success"));

    if (cb) {
      cb();
    }
  } catch (error: any) {
    dispatch({
      type: AuthType.RESEND_EMAIL_VERIFICATION_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch(openAlert("Failed to send email", "error"));
    if (cb) {
      cb();
    }
  }
}

export const verifyEmail = (token: string, cb?: () => void, errCb?: (message: string) => void) => async (dispatch: Dispatch) => {
  try {
    dispatch({
      type: AuthType.VERIFY_EMAIL_START,
    });

    const { data } = await axiosConfig.get(`/auth/verify`, {
      params: {
        token: token,
      },
    });
    dispatch({
      type: AuthType.VERIFY_EMAIL_SUCCESS,
      payload: data,
    });
    dispatch(openAlert("Email verified successfully", "success"));

    if (cb) {
      cb();
    }
  } catch (error: any) {
    dispatch({
      type: AuthType.VERIFY_EMAIL_FAILURE,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
    dispatch(openAlert("Failed to verify email", "error"));
    if (errCb) {
      errCb(error?.response?.data?.detail || "Failed to verify email");
    }
  }
}

export const updateNotifiedForVerification = () => async (dispatch: Dispatch) => {
  dispatch({
    type: AuthType.UPDATE_NOTIFIED_FOR_VERIFICATION,
  })
}