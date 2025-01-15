import { AnyAction } from "redux";
import * as ScheduleTypes from "./schedule.types";
import { IScheduleState } from "../interface";

const INITIAL_STATE: IScheduleState = {
  availabilityData: null,
  instructorAvailability: null,
  instructorSchedule: null,
  appointmentScheduleData: null,
  appointmentById: null,
  pickupLocationTypes: null,
  loading: false,
  error: null,
  dateSpecificAvailability: null,
  dayOffList: null,
  dayOffListError: null,
  createDayOffLoading: false,
  dayOffListLoading: false,
};

const scheduleReducer = (state = INITIAL_STATE, action: AnyAction) => {
  const { type, payload } = action;
  switch (type) {
    case ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_START:
    case ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_START:
    case ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_START:
    case ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_START:
    case ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_START:
    case ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_START:
    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_START:
    case ScheduleTypes.DELETE_AVAILABILITY_START:
    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_START:
    case ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_START:
    case ScheduleTypes.UPDATE_APPOINTMENT_SCHEDULE_START:
    case ScheduleTypes.CREATE_DAY_OFF_START:
    case ScheduleTypes.FETCH_DAY_OFF_LIST_START:
    case ScheduleTypes.DELETE_DAY_OFF_START:
      return {
        ...state,
        loading: true,
      };

    case ScheduleTypes.CREATE_DAY_OFF_SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case ScheduleTypes.FETCH_DAY_OFF_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        dayOffList: payload,
      };

    case ScheduleTypes.DELETE_DAY_OFF_SUCCESS:
      return {
        ...state,
        loading: false,
        dayOffList: Array.isArray(state.dayOffList)
          ? state.dayOffList.filter(
            (dayOff: any) => dayOff.id !== payload
          )
          : state.dayOffList,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_START:
    case ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_START:
      return {
        ...state,
        loading: true,
        availabilityData: null,
      };

    case ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_START:
      return {
        ...state,
        loading: true,
        dateSpecificAvailability: null,
      };

    case ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        dateSpecificAvailability: Array.isArray(state.dateSpecificAvailability)
          ? [...state.dateSpecificAvailability, ...payload]
          : payload,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_SUCCESS:
      return {
        ...state,
        instructorAvailability: payload,
        loading: false,
      };

    case ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_SUCCESS:
      return {
        ...state,
        appointmentById: payload,
        loading: false,
      };

    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_SUCCESS:
      return {
        ...state,
        instructorSchedule: payload,
        loading: false,
      };

    case ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentScheduleData: payload,
      };

    case ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        loading: false,
        pickupLocationTypes: payload,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_SUCCESS:
    case ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_SUCCESS:
      return {
        ...state,
        loading: false,
        availabilityData: payload,
      };

    case ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_SUCCESS:
      return {
        ...state,
        loading: false,
        appointmentScheduleData: payload.appointment_schedule,
      };

    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        instructorAvailability: payload.availability,
      };

    case ScheduleTypes.DELETE_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        availabilityData: Array.isArray(state.availabilityData)
          ? state.availabilityData.filter(
            (availability: any) => availability.id !== payload
          )
          : state.availabilityData,
        dateSpecificAvailability: Array.isArray(state.dateSpecificAvailability)
          ? state.dateSpecificAvailability.filter(
            (availability: any) => availability.id !== payload
          )
          : state.dateSpecificAvailability,
      };

    case ScheduleTypes.CREATE_SCHEDULE_AVAILABILITY_ERROR:
    case ScheduleTypes.FETCH_AVAILABILITY_BY_USER_ID_ERROR:
    case ScheduleTypes.CREATE_APPOINTMENT_SCHEDULE_ERROR:
    case ScheduleTypes.FETCH_PICKUP_LOCATION_TYPES_ERROR:
    case ScheduleTypes.FETCH_AVAILABILITY_WITH_PARAMS_ERROR:
    case ScheduleTypes.FETCH_AVAILABILITY_MONTHLY_ERROR:
    case ScheduleTypes.FETCH_SCHEDULE_APPOINTMENT_LIST_ERROR:
    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_AVAILABILITY_ERROR:
    case ScheduleTypes.DELETE_AVAILABILITY_ERROR:
    case ScheduleTypes.FETCH_INSTRUCTOR_MONTHLY_SCHEDULE_ERROR:
    case ScheduleTypes.FETCH_APPOINTMENT_BY_APPOINTMENT_ID_ERROR:
    case ScheduleTypes.UPDATE_APPOINTMENT_SCHEDULE_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_START:
      return {
        ...state,
        loading: true,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_SUCCESS:
      return {
        ...state,
        loading: false,
        availabilityData: payload,
      };

    case ScheduleTypes.FETCH_AVAILABILITY_WEEKLY_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_START:
      return {
        ...state,
        loading: true,
      };

    case ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_SUCCESS:
      return {
        ...state,
        loading: false,
        dateSpecificAvailability: payload,
      };

    case ScheduleTypes.FETCH_DATE_SPECIFIC_AVAILABILITY_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };


    case ScheduleTypes.RESET_INSTRUCTOR_MONTHLY_AVAILABILITY:
      return {
        ...state,
        instructorAvailability: null,
        availabilityData: null,
        instructorSchedule: null,
        appointmentScheduleData: null,

      }

    case ScheduleTypes.RESET_APPOINTMENT_BY_ID:
      return {
        ...state,
        appointmentById: null,
      };

    case ScheduleTypes.RESET_DAY_OFF_LIST:
      return {
        ...state,
        dayOffList: null,
      };
    default:
      return state;
  }
};

export default scheduleReducer;
