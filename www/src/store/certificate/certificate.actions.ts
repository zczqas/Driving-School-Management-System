// third party libraries
import { Dispatch } from "redux";

import axiosInstance from "../../config/axios.config";
import { openAlert } from "../alert/alert.actions";

// types
import { CertificateTypes } from "./certificate.types";

type CertificateStatus = "ASSIGNED" | "NOT_ASSIGNED" | "ISSUED" | "NOT_ISSUED" | "LOST" | "VOID" | "" | "ALL";
type userCertificateSortBy = "CERTIFICATE_ID" | "USER_PROFILE_ID" | "ISSUED_DATE" | "ASSIGNED_DATE";
type certificateOrderBy = "ASC" | "DESC";
type certificateType = "GOLD" | "PINK";

export const getAssignedUserCertificate = (
  offset: number = 0,
  limit: number = 100,
  certificate_type: certificateType = "GOLD",
  status: CertificateStatus = "ALL",
  sort: userCertificateSortBy = "CERTIFICATE_ID",
  order: certificateOrderBy = "DESC",
  certificate_id?: string | null,
  user_profile_id?: string | null,
  assigned_date?: string | null,
  issued_date?: string | null,
  instructor_id?: string | null
) => async (dispatch: Dispatch) => {
  try {
    {
      certificate_type === "GOLD" ?
        dispatch({ type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD }) :
        dispatch({ type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK })
    }
    // let url = `/user_certificate/get?offset=${offset}&limit=${limit}`;
    let url = `/cert/get?offset=${offset}&limit=${limit}`;
    if (certificate_type) {
      // url += `&certificate_type=${certificate_type}`
    }
    if (certificate_id) {
      url += `&certificate_id=${certificate_id}`
    }
    if (user_profile_id) {
      url += `&user_profile_id=${user_profile_id}`;
    }
    if (assigned_date) {
      url += `&assigned_date=${assigned_date}`;
    }
    if (issued_date) {
      url += `&issued_date=${issued_date}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    if (sort) {
      url += `&sort=${sort}`;
    }
    if (order) {
      url += `&order=${order}`;
    }
    if (instructor_id) {
      url += `&instructor_id=${instructor_id}`;
    }
    const response = await axiosInstance.get(url);
    {
      certificate_type === "GOLD" ?
        dispatch({
          type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD_SUCCESS,
          payload: response.data
        }) : dispatch({
          type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK_SUCCESS,
          payload: response.data
        })
    }
  } catch (error: any) {
    {
      certificate_type === "GOLD" ?
        dispatch({
          type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD_FAILURE,
          payload: error
        }) : dispatch({
          type: CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK_FAILURE,
          payload: error
        })
    }

  }
}

export const updateUserCertificateStatus = (certificateId: string, status: CertificateStatus, instructor_id: any, certificate: string, cb: () => void,) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: CertificateTypes.UPDATE_USER_CERTIFICATE_STATUS });

    // const response = await axiosInstance.put(`/user_certificate/update/${certificateId}`, { instructor_id, status, issue: true });
    const response = await axiosInstance.put(`/cert/update/${certificateId}`, { instructor_id, status, issue: true, certificate_id: certificate });

    dispatch({
      type: CertificateTypes.UPDATE_USER_CERTIFICATE_STATUS_SUCCESS,
      payload: response.data
    });
    dispatch(openAlert(`Certificate status updated to ${status.toLowerCase()} successfully`, "success"));
    if (cb) {
      cb()
    }
  } catch (error) {
    dispatch({
      type: CertificateTypes.UPDATE_USER_CERTIFICATE_STATUS_FAILURE,
      payload: error
    });
    dispatch(openAlert("Failed to update certificate status", "error"));
  }
}

export const getUserCertificateByUserId = (userId: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID });
    const { data } = await axiosInstance.get(`/cert/get?offset=0&limit=10&user_profiles_id=${userId}&order=ASC&sort=ISSUED_DATE`);
    dispatch({ type: CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID_SUCCESS, payload: data });
  } catch (error: any) {
    const errorMessage = error.response && error.response.data.details ? error.response.data.details : error.message
    dispatch({ type: CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID_ERROR, payload: errorMessage });
    dispatch(openAlert("Failed to fetch instructor notes", "error"));
  }
}