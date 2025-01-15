import * as CouponsTypes from './coupons.types';

import axiosInstance from '../../config/axios.config';
import { Dispatch } from '@reduxjs/toolkit';

import { openAlert } from '../alert/alert.actions';

type orderBY = 'ASC' | 'DESC';


export const fetchCoupons = (offset: number, limit: number, order: orderBY = "DESC") => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.GET_ALL_COUPONS_START });
    try {
        const { data } = await axiosInstance.get('/coupon/get', { params: { offset, limit, order } });
        dispatch({ type: CouponsTypes.GET_ALL_COUPONS_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: CouponsTypes.GET_ALL_COUPONS_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const fetchCouponsById = (id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.GET_COUPON_START });
    try {
        const { data } = await axiosInstance.get(`/coupon/get/${id}`);
        dispatch({ type: CouponsTypes.GET_COUPON_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: CouponsTypes.GET_COUPON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

interface couponsFields {
    code : string;
    amount : number;
    min_purchase : number;
    max_uses : number;
    expiration : string;
    type : string;
    is_active : boolean;
}

export const createCoupons = (couponsFields: couponsFields, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.CREATE_COUPON_START });
    try {
        await axiosInstance.post('/coupon/create',couponsFields);
        dispatch({ type: CouponsTypes.CREATE_COUPON_SUCCESS, payload: couponsFields });
        cb();
        dispatch(openAlert('Coupons created successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: CouponsTypes.CREATE_COUPON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Coupons creation failed', 'error'));
    }
}

export const updateCoupons = (id: string, couponsFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.UPDATE_COUPON_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/coupon/update/${id}`, couponsFields, config);
        dispatch({ type: CouponsTypes.UPDATE_COUPON_SUCCESS, payload: { id, couponsFields } });
        cb();
        dispatch(openAlert('Coupons updated successfully', 'success'));

    } catch (error: any) {
        dispatch({
            type: CouponsTypes.UPDATE_COUPON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Coupons update failed', 'error'));
    }
}

export const updateCouponsStatus = (id: number, status: boolean, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.UPDATE_COUPON_STATUS_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/coupon/update/${id}`, { is_active: status }, config);
        dispatch({ type: CouponsTypes.UPDATE_COUPON_STATUS_SUCCESS, payload: { id, status } });
        dispatch(openAlert('Coupons status updated successfully', 'success'));
        cb();
    } catch (error: any) {
        dispatch({
            type: CouponsTypes.UPDATE_COUPON_STATUS_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Coupons status update failed', 'error'));
    }
}

export const deleteCoupons = (id: number, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.DELETE_COUPON_START });
    try {
        await axiosInstance.delete(`/coupon/delete/${id}`);
        dispatch({ type: CouponsTypes.DELETE_COUPON_SUCCESS, payload: id });
        cb();
        dispatch(openAlert('Coupons deleted successfully', 'success'))
    } catch (error: any) {
        dispatch({
            type: CouponsTypes.DELETE_COUPON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Coupons deletion failed', 'error'))
    }
}

export const resetCoupons = () => (dispatch: Dispatch) => {
    dispatch({ type: CouponsTypes.RESET_COUPON });
}