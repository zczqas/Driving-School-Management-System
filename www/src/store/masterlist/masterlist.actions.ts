import { MasterListActionTypes } from "./masterlist.types";

import axiosInstance from "@/config/axios.config";

import { AxiosResponse } from "axios";

import { Dispatch } from "redux";
import { openAlert } from "../alert/alert.actions";

export const fetchSchools =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_SCHOOLS });

    try {
      let url = `/school/get?offset=${offset}&limit=${limit}`;
      if (name) {
        url += `&name=${name}`;
      }

      const response: AxiosResponse<any> = await axiosInstance.get(url);

      if (response && response.data) {
        dispatch({
          type: MasterListActionTypes.GET_SCHOOLS_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({
        type: MasterListActionTypes.GET_SCHOOLS_ERROR,
        payload: errorMessage,
      });
    }
  };

export const fetchDrivingSchools =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_DRIVING_SCHOOLS });
    try {
      let url = `/driving-school/get?offset=${offset}&limit=${limit}`;
      if (name) {
        url += `&name=${name}`;
      }
      const response: AxiosResponse<any> = await axiosInstance.get(url);
      if (response && response.data) {
        dispatch({
          type: MasterListActionTypes.GET_DRIVING_SCHOOLS_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      let errorMessage = error.message;
      if (error.response && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      dispatch({
        type: MasterListActionTypes.GET_DRIVING_SCHOOLS_ERROR,
        payload: errorMessage,
      });
    }
  };

export const fetchSchoolById = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: MasterListActionTypes.GET_SCHOOL_BY_ID });
  try {
    const { data } = await axiosInstance.get(`/school/get/${id}`);
    dispatch({
      type: MasterListActionTypes.GET_SCHOOL_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: MasterListActionTypes.GET_SCHOOL_BY_ID_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateSchool =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_SCHOOL });
    try {
      const response = await axiosInstance.put(`/school/update/${id}`, data);
      dispatch({
        type: MasterListActionTypes.UPDATE_SCHOOL_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("School updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_SCHOOL_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update school",
          "error"
        )
      );
    }
  };

export const createSchool =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_SCHOOL });
    try {
      const response = await axiosInstance.post(`/school/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_SCHOOL_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("School created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_SCHOOL_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create school",
          "error"
        )
      );
    }
  };

export const createDrivingSchool =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_DRIVING_SCHOOL });
    try {
      const response = await axiosInstance.post(`/driving-school/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_DRIVING_SCHOOL_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Driving School created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_DRIVING_SCHOOL_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create driving school",
          "error"
        )
      );
    }
  };

export const deleteSchool =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_SCHOOL });
    try {
      const response = await axiosInstance.delete(`/school/delete/${id}`);
      dispatch({
        type: MasterListActionTypes.DELETE_SCHOOL_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("School deleted successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_SCHOOL_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete school",
          "error"
        )
      );
    }
  };

export const fetchCities =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_CITIES });
    try {
      let url = `/city/get?offset=${offset}&limit=${limit}`;
      if (name) {
        url += `&name=${name}`;
      }
      const { data } = await axiosInstance.get(url);
      dispatch({
        type: MasterListActionTypes.GET_CITIES_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_CITIES_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchCityById = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: MasterListActionTypes.GET_CITY_BY_ID });
  try {
    const { data } = await axiosInstance.get(`/city/get/${id}`);
    dispatch({
      type: MasterListActionTypes.GET_CITY_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: MasterListActionTypes.GET_CITY_BY_ID_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateCity =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_CITY });
    try {
      const response = await axiosInstance.put(`/city/update/${id}`, data);
      dispatch({
        type: MasterListActionTypes.UPDATE_CITY_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("City updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_CITY_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update city",
          "error"
        )
      );
    }
  };

export const createCity =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_CITY });
    try {
      const response = await axiosInstance.post(`/city/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_CITY_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("City created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_CITY_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create city",
          "error"
        )
      );
    }
  };

export const deleteCity =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_CITY });
    try {
      const response = await axiosInstance.delete(`/city/delete/${id}`);
      dispatch({
        type: MasterListActionTypes.DELETE_CITY_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("City deleted successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_CITY_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete city",
          "error"
        )
      );
    }
  };

export const fetchGasStations =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_GAS_STATIONS });
    let url = `/gas_station/get?offset=${offset}&limit=${limit}`;
    if (name) {
      url += `&name=${name}`;
    }
    try {
      const { data } = await axiosInstance.get(url);
      dispatch({
        type: MasterListActionTypes.GET_GAS_STATIONS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_GAS_STATIONS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchGasStationById =
  (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_GAS_STATIONS_BY_ID });
    try {
      const { data } = await axiosInstance.get(`/gas_station/get/${id}`);
      dispatch({
        type: MasterListActionTypes.GET_GAS_STATIONS_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_GAS_STATIONS_BY_ID_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateGasStation =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_GAS_STATIONS });
    try {
      const response = await axiosInstance.put(
        `/gas_station/update/${id}`,
        data
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_GAS_STATIONS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Gas Station updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_GAS_STATIONS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update gas station",
          "error"
        )
      );
    }
  };

export const createGasStation =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_GAS_STATIONS });
    try {
      const response = await axiosInstance.post(`/gas_station/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_GAS_STATIONS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Gas Station created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_GAS_STATIONS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create gas station",
          "error"
        )
      );
    }
  };

export const deleteGasStation =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_GAS_STATIONS });
    try {
      const response = await axiosInstance.delete(`/gas_station/delete/${id}`);
      dispatch({
        type: MasterListActionTypes.DELETE_GAS_STATIONS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Gas Station deleted successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_GAS_STATIONS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete gas station",
          "error"
        )
      );
    }
  };

export const fetchAppointmentStatus =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_APPOINTMENT_STATUS });
    let url = `/appointment_schedule/status/get?offset=${offset}&limit=${limit}`;
    if (name) {
      url += `&name=${name}`;
    }
    try {
      const { data } = await axiosInstance.get(url);
      dispatch({
        type: MasterListActionTypes.GET_APPOINTMENT_STATUS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_APPOINTMENT_STATUS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchAppointmentStatusById =
  (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID });
    try {
      const { data } = await axiosInstance.get(`/appointment_schedule/status/get/${id}`);
      dispatch({
        type: MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateAppointmentStatus =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_APPOINTMENT_STATUS });
    try {
      const response = await axiosInstance.put(
        `/appointment_schedule/status/update/${id}`,
        data
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_APPOINTMENT_STATUS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Appointment Status updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_APPOINTMENT_STATUS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update appointment status",
          "error"
        )
      );
    }
  };

export const createAppointmentStatus =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_APPOINTMENT_STATUS });
    try {
      const response = await axiosInstance.post(
        `/appointment_schedule/status/create`,
        data
      );
      dispatch({
        type: MasterListActionTypes.CREATE_APPOINTMENT_STATUS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Appointment Status created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_APPOINTMENT_STATUS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create appointment status",
          "error"
        )
      );
    }
  };

export const deleteAppointmentStatus =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_APPOINTMENT_STATUS });
    try {
      const response = await axiosInstance.delete(
        `/appointment_schedule/status/delete/${id}`
      );
      dispatch({
        type: MasterListActionTypes.DELETE_APPOINTMENT_STATUS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Appointment Status deleted successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_APPOINTMENT_STATUS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete appointment status",
          "error"
        )
      );
    }
  };

export const fetchVehicles =
  (offset: number = 0, limit: number = 10, name?: string) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_VEHICLES });
    let url = `/vehicle/get?limit=${limit}&offset={offset}`;
    if (name) {
      url += `&name=${name}`;
    }
    try {
      const { data } = await axiosInstance.get("/vehicle/get");
      dispatch({
        type: MasterListActionTypes.GET_VEHICLES_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_VEHICLES_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchVehicleById = (id: string) => async (dispatch: Dispatch) => {
  dispatch({ type: MasterListActionTypes.GET_VEHICLE_BY_ID });
  try {
    const { data } = await axiosInstance.get(`/vehicle/get/${id}`);
    dispatch({
      type: MasterListActionTypes.GET_VEHICLE_BY_ID_SUCCESS,
      payload: data,
    });
  } catch (error: any) {
    dispatch({
      type: MasterListActionTypes.GET_VEHICLE_BY_ID_ERROR,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateVehicle =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_VEHICLE });
    try {
      const response = await axiosInstance.put(`/vehicle/update/${id}`, data);
      dispatch({
        type: MasterListActionTypes.UPDATE_VEHICLE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Vehicle updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_VEHICLE_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update vehicle",
          "error"
        )
      );
    }
  };

export const createVehicle =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_VEHICLE });
    try {
      const response = await axiosInstance.post(`/vehicle/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_VEHICLE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Vehicle created successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_VEHICLE_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create vehicle",
          "error"
        )
      );
    }
  };

export const deleteVehicle =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_VEHICLE });
    try {
      const response = await axiosInstance.delete(`/vehicle/delete/${id}`);
      dispatch({
        type: MasterListActionTypes.DELETE_VEHICLE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Vehicle deleted successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_VEHICLE_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete vehicle",
          "error"
        )
      );
    }
  };

export const updateVehicleStatus =
  (id: number, status: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_VEHICLE_STATUS });
    try {
      const response = await axiosInstance.put(`/vehicle/update/${id}`, {
        is_available: status,
      });
      dispatch({
        type: MasterListActionTypes.UPDATE_VEHICLE_STATUS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Vehicle status updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_VEHICLE_STATUS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update vehicle status",
          "error"
        )
      );
    }
  };

export const getAllTrainingInstructions =
  (offset: number = 0, limit: number = 100) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS });
    try {
      const { data } = await axiosInstance.get(
        `/training/get?limit=${limit}&offset=${offset}`
      );
      dispatch({
        type: MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getTrainingInstructionsById =
  (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID });
    try {
      const { data } = await axiosInstance.get(`/training/get/${id}`);
      dispatch({
        type: MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createTrainingInstruction =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_TRAINING_INSTRUCTION });
    try {
      const response = await axiosInstance.post(`/training/post`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_TRAINING_INSTRUCTION_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Training instruction created successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_TRAINING_INSTRUCTION_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create training instruction",
          "error"
        )
      );
    }
  };

export const deleteTrainingInstruction =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_TRAINING_INSTRUCTION });
    try {
      const response = await axiosInstance.delete(`/training/delete/${id}`);
      dispatch({
        type: MasterListActionTypes.DELETE_TRAINING_INSTRUCTION_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Training instruction deleted successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_TRAINING_INSTRUCTION_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete training instruction",
          "error"
        )
      );
    }
  };

export const updateTrainingInstruction =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION });
    try {
      const response = await axiosInstance.put(`/training/update/${id}`, data);
      dispatch({
        type: MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Training instruction updated successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update training instruction",
          "error"
        )
      );
    }
  };

export const getAllCertificateBatch =
  (certificateType?: string) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_CERTIFICATE_BATCH });
    try {
      let url = `/dmv_certificate/get/batch`;
      if (certificateType) {
        url += `?certificate_type=${certificateType}`;
      }
      const response = await axiosInstance.get(url);
      dispatch({
        type: MasterListActionTypes.GET_CERTIFICATE_BATCH_SUCCESS,
        payload: response?.data,
      });
    } catch (error: any) {
      dispatch(
        openAlert(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
          "error"
        )
      );
      dispatch({
        type: MasterListActionTypes.GET_CERTIFICATE_BATCH_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

type CertificateStatus =
  | "ASSIGNED"
  | "NOT_ASSIGNED"
  | "LOST"
  | "VOID"
  | ""
  | "ALL";
type certificateSortBy =
  | "ID"
  | "CERTIFICATE_NUMBER"
  | "IS_ASSIGNED"
  | "CREATED_AT"
  | "BATCH_ID";
type certificateOrderBy = "ASC" | "DESC";

export const getAllCertificateDmv =
  (
    offset: number = 0,
    limit: number = 100,
    batch_id?: string | null,
    certificate_number?: string | null,
    status: CertificateStatus = "ALL",
    sort: certificateSortBy = "ID",
    order: certificateOrderBy = "ASC"
  ) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS });
    let url = `/dmv_certificate/get?limit=${limit}&offset=${offset}`;
    if (batch_id) {
      url += `&batch_id=${batch_id}`;
    }
    if (certificate_number) {
      url += `&certificate_number=${certificate_number}`;
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
    try {
      const { data } = await axiosInstance.get(url);
      dispatch({
        type: MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addCertificatesToSystem =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.ADD_CERTIFICATES_TO_SYSTEM });
    try {
      const response = await axiosInstance.post(`/dmv_certificate/post`, {
        prefix_text: data.prefix_text,
        start_number: data.start_number,
        end_number: data.end_number,
        certificate_type: data.certificate_type,
      });
      dispatch({
        type: MasterListActionTypes.ADD_CERTIFICATES_TO_SYSTEM_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Certificates added to system successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.ADD_CERTIFICATES_TO_SYSTEM_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create certificates",
          "error"
        )
      );
    }
  };

export const updateCertificates =
  (id: string, status: CertificateStatus, cb: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_CERTIFICATE_STATUS });
    try {
      const response = await axiosInstance.put(
        `/dmv_certificate/update/${id}`,
        { status, is_assigned: status === "ASSIGNED" ? true : false }
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_CERTIFICATE_STATUS_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Certificates updated successfully", "success"));
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_CERTIFICATE_STATUS_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update certificates",
          "error"
        )
      );
    }
  };

export const fetchPickupLocationTypes =
  (offset: number = 0, limit: number = 100) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES });
    try {
      const { data } = await axiosInstance.get(`/pickup_location_type/get`);
      dispatch({
        type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const fetchPickupLocationTypesById =
  (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID });
    try {
      const { data } = await axiosInstance.get(
        `/pickup_location_type/get/${id}`
      );
      dispatch({
        type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID_SUCCESS,
        payload: data,
      });
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID_ERROR,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createPickupLocationTypes =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES });
    try {
      const response = await axiosInstance.post(
        `/pickup_location_type/post`,
        data
      );
      dispatch({
        type: MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Pickup Location Type created successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to create Pickup Location Type",
          "error"
        )
      );
    }
  };

export const updatePickupLocationTypes =
  (id: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES });
    try {
      const response = await axiosInstance.put(
        `/pickup_location_type/put/${id}`,
        data
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Pickup Location Type updated successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to update Pickup Location Type",
          "error"
        )
      );
    }
  };

export const deletePickupLocationTypes =
  (id: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES });
    try {
      const response = await axiosInstance.delete(
        `/pickup_location_type/delete/${id}`
      );
      dispatch({
        type: MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES_SUCCESS,
        payload: response.data,
      });
      dispatch(
        openAlert("Pickup Location Type deleted successfully", "success")
      );
      cb();
    } catch (error: any) {
      dispatch({
        type: MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES_ERROR,
        payload:
          error.response && error.response.data.detail
            ? error.response.data.detail
            : error.detail,
      });
      dispatch(
        openAlert(
          error.response.data.detail ?? "Failed to delete Pickup Location Type",
          "error"
        )
      );
    }
  };

export const fetchCourses =
  (offset: number = 0, limit: number = 10) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_COURSES });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/get?offset=${offset}&limit=${limit}`
      );
      if (response && response.data) {
        dispatch({
          type: MasterListActionTypes.GET_COURSES_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.GET_COURSES_ERROR,
        payload: errorMessage,
      });
    }
  };

// Create a new course
export const createCourse =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_COURSE });

    try {
      const response = await axiosInstance.post(`/course/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_COURSE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Course created successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: MasterListActionTypes.CREATE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create course", "error"));
    }
  };

export const deleteCourse =
  (courseId: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_COURSE });

    try {
      const response = await axiosInstance.delete(`/course/delete/${courseId}`);
      dispatch({
        type: MasterListActionTypes.DELETE_COURSE_SUCCESS,
        payload: courseId,
      });
      dispatch(openAlert("Course deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.DELETE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete course", "error"));
    }
  };

export const updateCourse =
  (courseId: string, data: any, cb: () => void) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_COURSE });
    try {
      const response = await axiosInstance.put(
        `/course/update/${courseId}`,
        data
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_COURSE_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Course updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.UPDATE_COURSE_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update course", "error"));
    }
  };

export const fetchUnits =
  (offset: number = 0, limit: number = 10) =>
  async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.GET_UNITS });

    try {
      const response: AxiosResponse<any> = await axiosInstance.get(
        `/course/unit/get?offset=${offset}&limit=${limit}`
      );
      if (response && response.data) {
        dispatch({
          type: MasterListActionTypes.GET_UNITS_SUCCESS,
          payload: response.data,
        });
      } else {
        throw new Error("No data received from the server.");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.GET_UNITS_ERROR,
        payload: errorMessage,
      });
    }
  };

// Create a new unit
export const createUnit =
  (data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.CREATE_UNIT });

    try {
      const response = await axiosInstance.post(`/course/unit/create`, data);
      dispatch({
        type: MasterListActionTypes.CREATE_UNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Unit created successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message;
      dispatch({
        type: MasterListActionTypes.CREATE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to create unit", "error"));
    }
  };

// Update a unit
export const updateUnit =
  (unitId: string, data: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.UPDATE_UNIT });
    try {
      const response = await axiosInstance.put(
        `/course/unit/update/${unitId}`,
        data
      );
      dispatch({
        type: MasterListActionTypes.UPDATE_UNIT_SUCCESS,
        payload: response.data,
      });
      dispatch(openAlert("Unit updated successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.UPDATE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to update unit", "error"));
    }
  };

// Delete a unit
export const deleteUnit =
  (unitId: string, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: MasterListActionTypes.DELETE_UNIT });

    try {
      const response = await axiosInstance.delete(
        `/course/unit/delete/${unitId}`
      );
      dispatch({
        type: MasterListActionTypes.DELETE_UNIT_SUCCESS,
        payload: unitId,
      });
      dispatch(openAlert("Unit deleted successfully", "success"));
      cb();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message;
      dispatch({
        type: MasterListActionTypes.DELETE_UNIT_ERROR,
        payload: errorMessage,
      });
      dispatch(openAlert(errorMessage ?? "Failed to delete unit", "error"));
    }
  };
