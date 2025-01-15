import { IAppointmentState } from "../interface";
import * as AppointmentTypes from "./appointment.types"


const INITIAL_STATE: IAppointmentState = {
    appointmentList: [],
    appointmentListLoading: false,
    appointmentListError: null,
    createAppointmentLoading: false,
    createAppointmentSuccess: false,
    createAppointmentError: null,
    updateAppointmentLoading: false,
    updateAppointmentSuccess: false,
    updateAppointmentError: null,
    deleteAppointmentLoading: false,
    deleteAppointmentSuccess: false,
    deleteAppointmentError: null,
    appointmentById: null,
    appointmentByIdLoading: false,
    appointmentByIdError: null,
    appointmentByUserId: null,
    appointmentByUserIdLoading: false,
    appointmentByUserIdError: null,
    appointmentByDate: null,
    appointmentByDateLoading: false,
    appointmentByDateError: null,
    appointmentByPayPeriod : null,
    appointmentByPayPeriodLoading: false,
    appointmentByPayPeriodError: null
}

const appointmentReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case AppointmentTypes.FETCH_APPOINTMENTS:
            return {
                ...state,
                appointmentListLoading: true,
                appointmentListError: null
            }

        case AppointmentTypes.FETCH_APPOINTMENTS_SUCCESS:
            return {
                ...state,
                appointmentList: payload,
                appointmentListLoading: false,
                appointmentListError: null
            }

        case AppointmentTypes.FETCH_APPOINTMENTS_FAILURE:
            return {
                ...state,
                appointmentList: [],
                appointmentListLoading: false,
                appointmentListError: payload
            }

        case AppointmentTypes.FETCH_APPOINTMENT_SUCCESS:
            return{
                ...state,
                appointmentById: payload,
                appointmentByIdLoading: false,
                appointmentByIdError: null
            }

        case AppointmentTypes.FETCH_APPOINTMENT_FAILURE:
            return{
                ...state,
                appointmentById: null,
                appointmentByIdLoading: false,
                appointmentByIdError: payload
            }

        case AppointmentTypes.FETCH_APPOINTMENT:
            return {
                ...state,
                appointmentByIdLoading: true,
                appointmentById: null,
                appointmentByIdError: null
            }
        
        case AppointmentTypes.FETCH_APPOINTMENT_SUCCESS:
            return {
                ...state,
                appointmentById: payload,
                appointmentByIdLoading: false,
                appointmentByIdError: null
            }
        
        case AppointmentTypes.FETCH_APPOINTMENT_FAILURE:
            return {
                ...state,
                appointmentById: null,
                appointmentByIdLoading: false,
                appointmentByIdError: payload
            }

        case AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID:
            return {
                ...state,
                appointmentByUserIdLoading: true,
                appointmentByUserId: null,
                appointmentByUserIdError: null
            }
        case AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID_SUCCESS:
            return {
                ...state,
                appointmentByUserId: payload,
                appointmentByUserIdLoading: false,
                appointmentByUserIdError: null
            }
        case AppointmentTypes.FETCH_APPOINTMENTS_BY_USER_ID_FAILURE:
            return {
                ...state,
                appointmentByUserId: null,
                appointmentByUserIdLoading: false,
                appointmentByUserIdError: payload
            }

        case AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE:
            return {
                ...state,
                appointmentByDateLoading: true,
                appointmentByDate: null,
                appointmentByDateError: null
            }
        case AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE_SUCCESS:
            return {
                ...state,
                appointmentByDate: payload,
                appointmentByDateLoading: false,
                appointmentByDateError: null
            }
        case AppointmentTypes.FETCH_APPOINTMENTS_BY_DATE_FAILURE:
            return {
                ...state,
                appointmentByDate: null,
                appointmentByDateLoading: false,
                appointmentByDateError: payload
            }

        case AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD:
            return{
                ...state,
                appointmentByPayPeriodLoading: true,
                appointmentByPayPeriod: null,
                appointmentByPayPeriodError: null
            }

        case AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD_SUCCESS:
            return{
                ...state,
                appointmentByPayPeriod: payload,
                appointmentByPayPeriodLoading: false,
                appointmentByPayPeriodError: null
            }

        case AppointmentTypes.FETCH_APPOINTMENT_OF_PAY_PERIOD_FAILURE:
            return{
                ...state,
                appointmentByPayPeriod: null,
                appointmentByPayPeriodLoading: false,
                appointmentByPayPeriodError: payload
            }
        default:
            return state;
    }
}

export default appointmentReducer;