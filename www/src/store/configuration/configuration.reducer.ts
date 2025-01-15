import { IDrivingSchoolConfig } from '../interface';
import ConfigurationTypes from './configuration.types';

const INITIAL_STATE: IDrivingSchoolConfig = {
    drivingSchoolById: null,
    drivingSchoolByIdError: null,
    drivingSchoolByIdLoading: false,
    updateDrivingSchoolError: null,
    updateDrivingSchoolLoading: false,
    updateDrivingSchoolSuccess: false
};

const drivingSchoolConfigReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION:
            return {
                ...state,
                drivingSchoolByIdLoading: true
            }
        case ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION_SUCCESS:
            return {
                ...state,
                drivingSchoolById: payload,
                drivingSchoolByIdLoading: false
            }
        case ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION_ERROR:
            return {
                ...state,
                drivingSchoolByIdError: payload,
                drivingSchoolByIdLoading: false
            }

        case ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION:
            return {
                ...state,
                updateDrivingSchoolLoading: true
            }
        case ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION_SUCCESS:
            return {
                ...state,
                updateDrivingSchoolSuccess: true,
                updateDrivingSchoolLoading: false
            }
        case ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION_ERROR:
            return {
                ...state,
                updateDrivingSchoolError: payload,
                updateDrivingSchoolLoading: false
            }

        default:
            return state;
    }
}

export default drivingSchoolConfigReducer;