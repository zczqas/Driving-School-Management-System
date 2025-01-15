import { Dispatch } from "@reduxjs/toolkit";
import axiosInstance from "@/config/axios.config";
import { openAlert } from "../alert/alert.actions";
import * as ScheduleTypes from "./schedule.types";

interface AxiosError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export const createScheduleAvailability =
  (availability: any, successAlert: boolean = true) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_START });
      const { data } = await axiosInstance.post(
        `/availability/create`,
        availability
      );
      dispatch({
        type: ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_SUCCESS,
        payload: availability,
      });
      if (successAlert) {
        dispatch(openAlert("Availability created successfully", "success"));
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch({
        type: ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_ERROR,
        payload: error,
      });
      dispatch(
        openAlert(
          axiosError.response?.data?.detail ||
          "Error creating schedule availability",
          "error"
        )
      );
    }
  };

interface UpdateScheduleAvailabilityType {
  available_date?: string;
  start_time?: string;
  end_time?: string;
  city_id?: number[];
  vehicle_id?: number;
}

export const updateScheduleAvailability = (availabilityId: number, availability: UpdateScheduleAvailabilityType) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.UPDATE_SCHEDULE_AVAILABILITY_START });
    const { data } = await axiosInstance.put(`/availability/update/${availabilityId}`, availability);
    dispatch({ type: ScheduleTypes.UPDATE_SCHEDULE_AVAILABILITY_SUCCESS, payload: data });
    dispatch(openAlert("Availability updated successfully", "success"));
  } catch (error) {
    dispatch({ type: ScheduleTypes.UPDATE_SCHEDULE_AVAILABILITY_ERROR, payload: error });
    dispatch(openAlert("Error updating availability", "error"));
  }
}

export const fetchAvailabilityByUserId =
  (userId: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_START });
      const { data } = await axiosInstance.get(`/availability/get/${userId}`);
      dispatch({
        type: ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error fetching user availability", "error"));
    }
  };

export const createAppointmentSchedule =
  (scheduleData: any, cb?: () => void) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_START,
        payload: scheduleData,
      });
      const { data } = await axiosInstance.post(
        `/appointment_schedule/create`,
        scheduleData
      );
      dispatch({
        type: ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_SUCCESS,
        payload: data,
      });
      dispatch(
        openAlert("Appointment schedule created successfully", "success")
      );
      if (cb) cb();
      return data; // Return the created appointment data
    } catch (error: any) {
      dispatch({
        type: ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_ERROR,
        payload: error,
      });
      dispatch(
        openAlert(
          error.response?.data?.detail ||
          "Error creating appointment schedule",
          "error"
        )
      );
    }
  };

export const fetchAppointmentByAppointmentId = (appointmentId: any) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_START });
    const { data } = await axiosInstance.get(`/appointment_schedule/get/${appointmentId}`);

    dispatch({ type: ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_SUCCESS, payload: data });
  } catch (error) {
    dispatch({ type: ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_ERROR, payload: error });
  }
};

interface UpdateAppointmentScheduleType {
  availability_id?: number;
  student_id?: number;
  scheduled_date?: string;
  lesson_id?: number;
  package_id?: number;
  driving_school_id?: number;
  pickup_location_id?: number;
  pickup_location_type_id?: number;
  pickup_location_text?: string;
  notes?: string;
  status?: 'CONFIRMED' | string;
  time_in?: string;
  time_out?: string;
}

export const updateAppointmentSchedule = (appointmentId: number, scheduleData: UpdateAppointmentScheduleType, cb?: () => void) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.UPDATE_APPOINTMENT_SCHEDULE_START });
    const { data } = await axiosInstance.put(`/appointment_schedule/update/${appointmentId}`, scheduleData);
    dispatch({ type: ScheduleTypes.UPDATE_APPOINTMENT_SCHEDULE_SUCCESS, payload: { appointmentId, scheduleData } });
    if (cb) cb();
  } catch (error) {
    dispatch({ type: ScheduleTypes.UPDATE_APPOINTMENT_SCHEDULE_ERROR, payload: error });
  }
};

export const resetAppointmentById = (cb?: () => void) => async (dispatch: Dispatch) => {
  dispatch({ type: ScheduleTypes.RESET_APPOINTMENT_BY_ID });
  if (cb) cb();
};

export const fetchPickupLocationTypes = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_START });
    const { data } = await axiosInstance.get(`/pickup_location_type/get`);
    dispatch({
      type: ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_SUCCESS,
      payload: data.pickup_location_types,
    });
  } catch (error) {
    dispatch({
      type: ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_ERROR,
      payload: error,
    });
    console.log({ error });
  }
};

export const fetchAvailabilityWithParams =
  (
    offset = 0,
    limit = 10,
    availableDate?: string,
    order = "DESC",
    sort = "CREATED_AT",
    available_day?: number,
    student_id?: number,
    isBooked?: boolean
  ) =>
    async (dispatch: Dispatch) => {
      try {
        dispatch({ type: ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_START });

        const queryParams = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
          ...(availableDate && { available_date: availableDate }),
          order,
          sort,
          ...(available_day !== undefined && {
            available_day: available_day.toString(),
          }),
          ...(student_id !== undefined && { student_id: student_id.toString() }),
          ...(isBooked !== undefined && { is_booked: isBooked.toString() }),
        }).toString();

        const { data } = await axiosInstance.get(
          `/availability/get?${queryParams}`
        );

        dispatch({
          type: ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_ERROR,
          payload: error,
        });
        dispatch(
          openAlert("Error fetching availability with parameters", "error")
        );
      }
    };

export const fetchScheduleAppointmentList =
  (studentId: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_START });

      const { data } = await axiosInstance.get(
        `/appointment_schedule/get?student_id=${studentId}`
      );

      dispatch({
        type: ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch({
        type: ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_ERROR,
        payload:
          axiosError.response?.data?.detail ||
          "Error fetching schedule appointment list",
      });
      dispatch(openAlert("Error fetching schedule appointment list", "error"));
    }
  };

export const fetchInstructorMonthlyAvailability =
  (month: number, userId: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({
        type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_START,
      });

      const { data } = await axiosInstance.get(
        `/availability/get/monthly?month=${month}&user_id=${userId}`
      );

      dispatch({
        type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_ERROR,
        payload: error,
      });
      dispatch(openAlert("Error fetching monthly availability", "error"));
    }
  };

export const resetInstructorMonthlyAvailability = () => async (dispatch: Dispatch) => {
  dispatch({ type: ScheduleTypes.RESET_INSTRUCTOR_MONTHLY_AVAILABILITY });
};

export const fetchInstructorMonthlySchedule =
  (month: number, userId: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_START });
      const { data } = await axiosInstance.get(
        `/appointment_schedule/get?instructor_id=${userId}&month=${month}`
      );
      dispatch({
        type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch({
        type: ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_ERROR,
        payload:
          axiosError.response?.data?.detail ||
          "Error fetching schedule appointment list",
      });
      dispatch(openAlert("Error fetching schedule appointment list", "error"));
    }
  };

export const fetchAvailabilityMonthly =
  (
    offset = 0,
    limit = 10,
    order = "DESC",
    sort = "CREATED_AT",
    month?: string
  ) =>
    async (dispatch: Dispatch) => {
      try {
        dispatch({ type: ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_START });

        const queryParams = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
          ...(month && { month }),
          order,
          sort,
        }).toString();

        const { data } = await axiosInstance.get(
          `/availability/get?${queryParams}`
        );

        dispatch({
          type: ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_SUCCESS,
          payload: data,
        });
      } catch (error) {
        dispatch({
          type: ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_ERROR,
          payload: error,
        });
        dispatch(
          openAlert("Error fetching availability with parameters", "error")
        );
      }
    };

export const fetchAvailabilityWeekly =
  (userId: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_START });

      const { data } = await axiosInstance.get(
        `/availability/get/weekly/${userId}`
      );

      dispatch({
        type: ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch({
        type: ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_ERROR,
        payload:
          axiosError.response?.data?.detail ||
          "Error fetching weekly availability",
      });
      dispatch(openAlert("Error fetching weekly availability", "error"));
    }
  };


export const fetchDateSpecificAvailability =
  (id: number) => async (dispatch: Dispatch) => {
    try {
      dispatch({ type: ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_START });
      const { data } = await axiosInstance.get(`/availability/get/date/${id}`);
      dispatch({
        type: ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      dispatch({
        type: ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_ERROR,
        payload:
          axiosError.response?.data?.detail ||
          "Error fetching date-specific availability",
      });
      dispatch(
        openAlert(
          axiosError.response?.data?.detail ||
          "Error fetching date-specific availability",
          "error"
        )
      );
    }
  };

export const deleteAvailability = (availabilityId: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.DELETE_AVAILABILITY_START });

    await axiosInstance.delete(`/availability/delete/${availabilityId}`);

    dispatch({
      type: ScheduleTypes.DELETE_AVAILABILITY_SUCCESS,
      payload: availabilityId,
    });

    dispatch(openAlert("Availability deleted successfully", "success"));

    return Promise.resolve(true); // Return success
  } catch (error) {
    const axiosError = error as AxiosError;
    console.log("axxx", error)
    dispatch({
      type: ScheduleTypes.DELETE_AVAILABILITY_ERROR,
      payload:
        axiosError.response?.data?.detail || "Error deleting availability",
    });

    dispatch(
      openAlert(
        axiosError.response?.data?.detail || "Error deleting availability",
        "error"
      )
    );

    return Promise.reject(error); // Return failure
  }
};

interface CreateDayOffType {
  user_id: number;
  // day_off_date?: string;
  from_?: string;
  to_?: string;
  day_?: string;
  reason?: string;
}

export const createDayOff = (dayOffData: CreateDayOffType) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.CREATE_DAY_OFF_START });
    const { data } = await axiosInstance.post(`/day_off/create`, dayOffData);
    dispatch({ type: ScheduleTypes.CREATE_DAY_OFF_SUCCESS, payload: dayOffData });
    dispatch(openAlert("Day off created successfully", "success"));
  } catch (error) {
    dispatch({ type: ScheduleTypes.CREATE_DAY_OFF_ERROR, payload: error });
    dispatch(openAlert("Error creating day off", "error"));
  }
}

/**
 * Fetch day off list
 * @param id - User ID to filter day off list by user
 * @returns 
 */
export const fetchDayOffList = (id?: string) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.FETCH_DAY_OFF_LIST_START });
    const { data } = await axiosInstance.get(`/day_off/get?${id ? `user_id=${id}` : ""}`);
    dispatch({ type: ScheduleTypes.FETCH_DAY_OFF_LIST_SUCCESS, payload: data?.day_offs });
  } catch (error) {
    dispatch({ type: ScheduleTypes.FETCH_DAY_OFF_LIST_ERROR, payload: error });
    dispatch(openAlert("Error fetching day off list", "error"));
  }
}

export const deleteDayOff = (dayOffId: number) => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: ScheduleTypes.DELETE_DAY_OFF_START });
    await axiosInstance.delete(`/day_off/delete/${dayOffId}`);
    dispatch({ type: ScheduleTypes.DELETE_DAY_OFF_SUCCESS, payload: dayOffId });
    dispatch(openAlert("Day off deleted successfully", "success"));
  } catch (error) {
    dispatch({ type: ScheduleTypes.DELETE_DAY_OFF_ERROR, payload: error });
    dispatch(openAlert("Error deleting day off", "error"));
  }
}

export const resetDayOffList = () => async (dispatch : Dispatch) =>{
  try{
    dispatch({type: ScheduleTypes.RESET_DAY_OFF_LIST});
  }catch(error){
    dispatch({type: ScheduleTypes.RESET_DAY_OFF_LIST_ERROR, payload: error});
  }
}