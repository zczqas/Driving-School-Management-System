import { Dispatch } from "@reduxjs/toolkit";

import axiosInstance from "@/config/axios.config";
import * as AppointmentTypes from "./appointment.types"
import { openAlert } from "../alert/alert.actions";

// Being used in : /instructors-schedule
export const fetchAppointments = (offset: number = 0, limit: number = 10, scheduled_date: string = "", name: string = "", instructor_id?: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS, payload: { offset, limit, scheduled_date } })

    try {
        let params: {
            offset: number;
            limit: number;
            scheduled_date?: string;
            name?: string;
            instructor_id?: string;
        } = { offset, limit };
        if (scheduled_date) {
            params = { ...params, scheduled_date };
        }
        if (name) {
            params = { ...params, name };
        } if (instructor_id) {
            params = { ...params, instructor_id };
        }
        // Updating the enpoint to new schedule
        // const { data } = await axiosInstance.get('/appointment/get', { params: params });    
        const { data } = await axiosInstance.get('/appointment_schedule/get', { params: params });
        dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.FETCH_APPOINTMENTS_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

// Being used in : /instructors-appointment-management
export const fetchAppointmentsByUserId = (userRole: string = "STUDENT", userId: string, offset: number = 0, limit: number = 10) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID, payload: { userId, offset, limit } })
    let queryParams: { offset: number; limit: number; student_id?: string; instructor_id?: string; } = { offset, limit };
    console.log("userRole", userRole, userId)
    if (userRole === 'STUDENT') {
        queryParams = { ...queryParams, student_id: userId };
    } else if (userRole === 'INSTRUCTOR') {
        queryParams = { ...queryParams, instructor_id: userId };
    }
    try {
        const { data } = await axiosInstance.get('/appointment/get', {
            params: queryParams
        });
        dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

// Being used in : /instructors-daily-lesson-listing
export const fetchAppointmentsByDate = (date: string, userId: string, offset: number = 0, limit: number = 100) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE, payload: { appointment_date: date, instructor_id: userId, offset, limit } })

    try {
        // Updating the enpoint to new schedule
        // const { data } = await axiosInstance.get('/appointment/get', {
        //     params: { appointment_date: date, instructor_id: userId, offset, limit }
        // });
        const { data } = await axiosInstance.get('/appointment_schedule/get', {
            params: { instructor_id: userId, scheduled_date: date }
        });
        dispatch({ type: AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const fetchAppointmentOfPayPeriod = (scheduled_date_from
    : string, userId: string, offset: number = 0, limit: number = 10) => async (dispatch: Dispatch) => {
        dispatch({ type: AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD, payload: { scheduled_date_from, instructor_id: userId, offset, limit } })

        try {
            const { data } = await axiosInstance.get('/appointment_schedule/get', {
                params: {
                    scheduled_date_from, instructor_id: userId
                    , offset, limit
                }
            });
            dispatch({ type: AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD_SUCCESS, payload: data });
        } catch (error: any) {
            dispatch({
                type: AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD_FAILURE,
                payload: error.response && error.response.data.message ? error.response.data.message : error.message
            });
        }
    }

export const updateAppointmentTime = (id: string, time_in: string, time_out: string, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT, payload: { time_in, time_out } });

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        // Updating the enpoint to new schedule
        // const { data } = await axiosInstance.put(`/appointment/update/${id}`, { actual_start_time, actual_end_time }, config);
        const { data } = await axiosInstance.put(`/appointment_schedule/update/${id}`, { time_in, time_out }, config);
        dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT_SUCCESS, payload: { time_in, time_out } });
        cb();
        dispatch(openAlert('Appointment updated successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.UPDATE_APPOINTMENT_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Appointment update failed', 'error'));
    }
}

export const updateVehicleMileage = (id: string, start_mileage: string, end_mileage: string, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT, payload: { start_mileage, end_mileage } });

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/appointment_schedule/update/${id}`, { start_mileage, end_mileage }, config);
        dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT_SUCCESS, payload: { start_mileage, end_mileage } });
        cb();
        dispatch(openAlert('Appointment updated successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.UPDATE_APPOINTMENT_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Appointment update failed', 'error'));
    }
}

export const fetchAppointmentById = (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.FETCH_APPOINTMENT, payload: id });

    try {
        const { data } = await axiosInstance.get(`/appointment/get/${id}`);
        dispatch({ type: AppointmentTypes.FETCH_APPOINTMENT_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.FETCH_APPOINTMENT_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

type appointmentFields = {
    student_id?: string;
    instructor_id?: string;
    appointment_date?: string;
    start_time?: string;
    end_time?: string;
    lesson_id?: string;
    vehicle?: string;
    city_abbreviation?: string;
    pickup_location_id?: string;
    note?: string;
    pickup_text?: string;
}

export const createAppointment = (appointmentFields: appointmentFields, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.CREATE_APPOINTMENT, payload: appointmentFields });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    try {
        await axiosInstance.post('/appointment/post', null, { params: appointmentFields });
        dispatch({ type: AppointmentTypes.CREATE_APPOINTMENT_SUCCESS, payload: appointmentFields });
        cb();
        dispatch(openAlert('Appointment created successfully', 'success'));
    } catch (error: any) {
        if (error?.response?.status === 422) {
            dispatch(openAlert("Please fill all fields properly", 'error'));
        } else {

            dispatch({
                type: AppointmentTypes.CREATE_APPOINTMENT_FAILURE,
                payload: error.response && error.response.data.detail ? error.response.data.detail : error.message
            });
            dispatch(openAlert((error.response && error.response.data.detail ? error.response.data.detail : error.message) ?? "Appointment Creation Failed", 'error'));
        }
    }
}

export const updateAppointment = (id: string, appointmentFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT, payload: appointmentFields });

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/appointment/update/${id}`, appointmentFields, config);
        dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT_SUCCESS, payload: appointmentFields });
        cb();
        dispatch(openAlert('Appointment updated successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.UPDATE_APPOINTMENT_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Appointment update failed', 'error'));
    }
}

export const deleteAppointment = (id: number, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.DELETE_APPOINTMENT, payload: id });

    try {
        await axiosInstance.delete(`/appointment/delete/${id}`);
        dispatch({ type: AppointmentTypes.DELETE_APPOINTMENT_SUCCESS, payload: id });
        cb();
        dispatch(openAlert('Appointment deleted successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.DELETE_APPOINTMENT_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Appointment deletion failed', 'error'));
    }
}

export const updateAppointmentStatus = (id: string, status_id: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT_STATUS, payload: { id, status_id } });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/appointment_schedule/update/${id}`, { status_id }, config);
        dispatch({ type: AppointmentTypes.UPDATE_APPOINTMENT_STATUS_SUCCESS, payload: { id, status_id } });
        dispatch(openAlert('Appointment status updated successfully', 'success'));
        if (cb) cb()
    } catch (error: any) {
        dispatch({
            type: AppointmentTypes.UPDATE_APPOINTMENT_STATUS_FAILURE,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Appointment status update failed', 'error'));
    }
}