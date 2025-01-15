import { Dispatch } from 'redux';
import ConfigurationTypes from "./configuration.types"

import axiosInstance from "../../config/axios.config"
import { openAlert } from '../alert/alert.actions';


export const createPaymentConfiguration = (paymentConfiguration: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: ConfigurationTypes.CREATE_PAYMENT_CONFIGURATION });
    try {
        const { data } = await axiosInstance.post('/payment_api/add', paymentConfiguration);
        dispatch({ type: ConfigurationTypes.CREATE_PAYMENT_CONFIGURATION_SUCCESS, payload: data });
        if (cb) {
            cb()
        }
        dispatch(openAlert("Configuration Added Successfully", 'success'))
    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.CREATE_PAYMENT_CONFIGURATION_ERROR, payload: error });
        dispatch(openAlert((error.response && error.response.data.detail ? error.response.data.detail : error.message) ?? "Payment Configuration Creation Failed", 'error'));
    }
}

export const updatePaymentConfiguration = (paymentConfiguration: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: ConfigurationTypes.UPDATE_PAYMENT_CONFIGURATION });
    try {
        const paymentConfigurationWithoutId = { ...paymentConfiguration, id: undefined };
        const { data } = await axiosInstance.put(`/payment_api/update/${paymentConfiguration?.id}`, paymentConfigurationWithoutId);
        dispatch({ type: ConfigurationTypes.UPDATE_PAYMENT_CONFIGURATION_SUCCESS, payload: data });
        if (cb) {
            cb()
        }
        dispatch(openAlert("Configuration Updated Successfully", 'success'))

    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.UPDATE_PAYMENT_CONFIGURATION_ERROR, payload: error });
        dispatch(openAlert((error.response && error.response.data.detail ? error.response.data.detail : error.message) ?? "Payment Configuration Creation Failed", 'error'));

    }
}

export const fetchBasicConfiguration = (id: any) => async (dispatch: Dispatch) => {
    dispatch({ type: ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION });
    try {
        const { data } = await axiosInstance.get(`/driving-school/get/${id}`);
        dispatch({ type: ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.GET_DRIVING_SCHOOL_BASIC_CONFIGURATION_ERROR, payload: error });
    }

}

export interface BasicConfiguration {
    name: string;
    description: string;
    address: string;
    phone: string;
    secondary_phone: string;
    email: string;
    website: string;
    domain: string;
    primary_color: string;
    secondary_color: string;
    license_number: string;
    latitude: number;
    longitude: number;
    banner: string;
    title: string;
    operating_hours: string;
    established_year: number;
    footer_banner: string;
    hero_text: string;
    sign_in_url: string;
    sign_up_url: string;
    pricing_url: string;
    facebook_url: string;
    twitter_url: string;
    instagram_url: string;
    linkedin_url: string;
}
export const updateBasicConfiguration = (id: any, basicConfiguration: any, cb: () => void) => async (dispatch: Dispatch) => {

    dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION });
    try {
        const { data } = await axiosInstance.put(`/driving-school/update/${id}`, basicConfiguration);
        dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION_SUCCESS, payload: data });
        if (cb) {
            cb()
        }
        dispatch(openAlert("Configuration Updated Successfully", 'success'))

    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_BASIC_CONFIGURATION_ERROR, payload: error });
        dispatch(openAlert((error.response && error.response.data.detail ? error.response.data.detail : error.message) ?? "Payment Configuration Creation Failed", 'error'));

    }
}

export const createDrivingSchool = (drivingSchool: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: ConfigurationTypes.CREATE_DRIVING_SCHOOL });
    try {
        const { data } = await axiosInstance.post('/driving-school/add', drivingSchool);
        dispatch({ type: ConfigurationTypes.CREATE_DRIVING_SCHOOL_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.CREATE_DRIVING_SCHOOL_ERROR, payload: error });
    }
}

export const updateDrivingSchoolLogo = (id: any, logo: any, cb: () => void) => async (dispatch: Dispatch) => {
    dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_LOGO });
    try {
        const formData = new FormData();
        formData.append('logo', logo);
        const { data } = await axiosInstance.patch(`/driving-school/update/logo/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_LOGO_SUCCESS, payload: data });
        if (cb) {
            cb()
        }
        dispatch(openAlert("Logo Updated Successfully", 'success'))

    } catch (error: any) {
        dispatch({ type: ConfigurationTypes.UPDATE_DRIVING_SCHOOL_LOGO_ERROR, payload: error });
        dispatch(openAlert((error.response && error.response.data.detail ? error.response.data.detail : error.message) ?? "Payment Configuration Creation Failed", 'error'));

    }
}