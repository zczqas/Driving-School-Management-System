import * as AccountTypes from "./account.types";
import { Dispatch } from "redux";
import axiosInstance from "@/config/axios.config";
import { openAlert } from "../alert/alert.actions";

export const fetchTransactionsStart =
  (
    offset: number = 0,
    limit: number = 100,
    search?: string,
    date_charged?: string,
    sort?: string,
    startDate?: string,
    endDate?: string,
    drivingSchoolId?: string
  ) =>
    async (dispatch: Dispatch) => {
      dispatch({ type: AccountTypes.FETCH_TRANSACTIONS_START });
      let queryParams: {
        offset: number;
        limit: number;
        user_name?: string;
        date_charged?: string;
        sort?: string;
        from_?: string;
        to?: string;
        driving_school_id?: string;
      } = { offset, limit };

      if (search) {
        queryParams = { ...queryParams, user_name: search };
      }
      if (date_charged) {
        queryParams = { ...queryParams, date_charged };
      }
      if (sort) {
        queryParams = { ...queryParams, sort };
      }
      if (startDate) {
        queryParams = { ...queryParams, from_: startDate };
      }
      if (endDate) {
        queryParams = { ...queryParams, to: endDate };
      }
      if (drivingSchoolId) {
        queryParams = { ...queryParams, driving_school_id: drivingSchoolId };
      }
      try {
        const { data } = await axiosInstance.get("/account/get", {
          params: queryParams,
        });
        dispatch({
          type: AccountTypes.FETCH_TRANSACTIONS_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: AccountTypes.FETCH_TRANSACTIONS_FAILURE,
          payload: error,
        });
      }
    };

export const createTransactionStart =
  (transactionField: any, cb: () => void, errCb: () => void) =>
    async (dispatch: Dispatch) => {
      dispatch({ type: AccountTypes.CREATE_TRANSACTION_START });
      try {
        const { data } = await axiosInstance.post("/account/post", null, {
          params: transactionField,
        });
        dispatch({
          type: AccountTypes.CREATE_TRANSACTION_SUCCESS,
          payload: data,
        });
        cb();
        dispatch(openAlert("Transaction created successfully", "success"));
      } catch (error: any) {
        dispatch({
          type: AccountTypes.CREATE_TRANSACTION_FAILURE,
          payload: error,
        });
        dispatch(openAlert("Create Transaction Failed! Please try again.", "error"));
        dispatch(openAlert(error?.response?.data?.detail ? error?.response?.data?.detail : null, "error"));
        errCb();
      }
    };

export const fetchTransactionsByUserIdStart =
  (userId: string, status: string = "SETTLED") => async (dispatch: Dispatch) => {
    dispatch({ type: AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_START });
    try {
      const { data } = await axiosInstance.get(`/account/get`, {
        params: { user_id: userId, status },
      });
      if (status === "PENDING") {
        dispatch({
          type: AccountTypes.FETCH_PENDING_TRANSACTIONS_BY_USER_ID_SUCCESS,
          payload: data,
        });
      } else {
        dispatch({
          type: AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_SUCCESS,
          payload: data,
        });
      }
    } catch (error) {
      if (status === "PENDING") {
        dispatch({
          type: AccountTypes.FETCH_PENDING_TRANSACTIONS_BY_USER_ID_FAILURE,
          payload: error,
        });
      } else {
        dispatch({
          type: AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_FAILURE,
          payload: error,
        });
      }
    }
  };

export const fetchTransactionsByTransactionId =
  (transaction_id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AccountTypes.FETCH_TRANSACTIONS_BY_ID_START });
    try {
      const { data } = await axiosInstance.get(
        `/account/get/${transaction_id}`
      );
      dispatch({
        type: AccountTypes.FETCH_TRANSACTIONS_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: AccountTypes.FETCH_TRANSACTIONS_BY_ID_FAILURE,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message,
      });
    }
  };

export const updateTransaction =
  (transaction_id: string, transactionField: any, cb: () => void) =>
    async (dispatch: Dispatch) => {
      const transactionUpdateObject = {
        ...(transactionField?.additional_amount && { amount: transactionField.additional_amount }),
        ...(transactionField?.discount && { discount: transactionField.discount }),
        ...(transactionField?.additional_amount && { additional_amount: transactionField.additional_amount }),
        ...(transactionField?.method && { method: transactionField.method }),
        ...(transactionField?.location && { location: transactionField.location }),
        ...(transactionField?.transaction_id && { transaction_id: transactionField.transaction_id }),
        ...(transactionField?.status && { status: transactionField.status }),
        ...(transactionField?.driving_school_id && { driving_school_id: transactionField.driving_school_id }),
        ...(transactionField?.user_id && { user_id: transactionField.user_id }),
        ...(transactionField?.package_id && { package_id: transactionField.package_id }),
        date_charged: new Date().toISOString().split("T")[0], // Default to current date
        ...(transactionField?.refund !== undefined && { refund: transactionField.refund }),
        ...(transactionField?.cardholder_name && { cardholder_name: transactionField.cardholder_name }),
        ...(transactionField?.card_number && { card_number: transactionField.card_number }),
        ...(transactionField?.expiration_date && { expiration_date: transactionField.expiration_date }),
      };

      dispatch({ type: AccountTypes.CREATE_TRANSACTION_START });
      try {
        const { data } = await axiosInstance.put(
          `/account/update/${transaction_id}`,
          transactionUpdateObject
        );
        dispatch({
          type: AccountTypes.UPDATE_TRANSACTION_SUCCESS,
          payload: data,
        });
        cb();
        dispatch(openAlert("Transaction updated successfully", "success"));
      } catch (error) {
        dispatch({
          type: AccountTypes.UPDATE_TRANSACTION_FAILURE,
          payload: error,
        });
        dispatch(openAlert("Update Transaction Failed", "error"));
      }
    };

export const fetchEmailLogs = (offset = 0, limit = 10) => async (dispatch: Dispatch) => {
  dispatch({ type: AccountTypes.FETCH_EMAIL_LOGS_START });
  try {
    const { data } = await axiosInstance.get("/email_log/get", {
      params: { offset, limit },
    });
    dispatch({
      type: AccountTypes.FETCH_EMAIL_LOGS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: AccountTypes.FETCH_EMAIL_LOGS_FAILURE,
      payload: error.response?.data?.detail || error.message,
    });
  }
};

export const fetchEmailLogsByUserId = (userId: string, offset = 0, limit = 10) => async (dispatch: Dispatch) => {
  dispatch({ type: AccountTypes.FETCH_EMAIL_LOGS_START });
  try {
    const { data } = await axiosInstance.get(`/email_log/get/${userId}`, {
      params: { offset, limit },
    });
    dispatch({
      type: AccountTypes.FETCH_EMAIL_LOGS_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: AccountTypes.FETCH_EMAIL_LOGS_FAILURE,
      payload: error.response?.data?.detail || error.message,
    });
  }
};