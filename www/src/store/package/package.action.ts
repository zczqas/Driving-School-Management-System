import * as PackageTypes from './package.types';

import axiosInstance from '../../config/axios.config';
import { Dispatch } from '@reduxjs/toolkit';

import { openAlert } from '../alert/alert.actions';

export const fetchPackages = (
    offset: number,
    limit?: number,
    name?: string,
    category_id?: string,
    price?: string,
    order: 'ASC' | 'DESC' = 'DESC',
    sort: 'NAME' | 'PRICE' | 'CREATED_AT' | 'UPDATED_AT' | 'CATEGORY_ID' = 'CREATED_AT'
) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.GET_ALL_PACKAGE_START });
    try {
        const { data } = await axiosInstance.get('/package/get', {
            params: {
                offset,
                limit,
                name,
                category_id,
                price,
                order,
                sort
            }
        });
        dispatch({ type: PackageTypes.GET_ALL_PACKAGE_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: PackageTypes.GET_ALL_PACKAGE_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const fetchPackageById = (id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.GET_PACKAGE_START });
    try {
        const { data } = await axiosInstance.get(`/package/get/${id}`);
        dispatch({ type: PackageTypes.GET_PACKAGE_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: PackageTypes.GET_PACKAGE_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const createPackage = (lessonFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.CREATE_PACKAGE_START });
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    try {
        await axiosInstance.post('/package/post', lessonFields, config);
        dispatch({ type: PackageTypes.CREATE_PACKAGE_SUCCESS, payload: lessonFields });
        cb();
        dispatch(openAlert('Package created successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: PackageTypes.CREATE_PACKAGE_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Package creation failed', 'error'));
    }
}

export const updatePackage = (id: string, lessonFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.UPDATE_PACKAGE_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/package/put/${id}`, lessonFields, config);
        dispatch({ type: PackageTypes.UPDATE_PACKAGE_SUCCESS, payload: { id, lessonFields } });
        cb();
        dispatch(openAlert('Package updated successfully', 'success'));

    } catch (error: any) {
        dispatch({
            type: PackageTypes.UPDATE_PACKAGE_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Package update failed', 'error'));
    }
}

export const updatePackageStatus = (id: number, status: boolean, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.UPDATE_PACKAGE_STATUS_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/package/put/${id}`, { is_active: status }, config);
        dispatch({ type: PackageTypes.UPDATE_PACKAGE_STATUS_SUCCESS, payload: { id, status } });
        dispatch(openAlert('Package status updated successfully', 'success'));
        cb();
    } catch (error: any) {
        dispatch({
            type: PackageTypes.UPDATE_PACKAGE_STATUS_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Package status update failed', 'error'));
    }
}

export const deletePackage = (id: number, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.DELETE_PACKAGE_START });
    try {
        await axiosInstance.delete(`/package/delete/${id}`);
        dispatch({ type: PackageTypes.DELETE_PACKAGE_SUCCESS, payload: id });
        cb();
        dispatch(openAlert('Package deleted successfully', 'success'))
    } catch (error: any) {
        dispatch({
            type: PackageTypes.DELETE_PACKAGE_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Package deletion failed', 'error'))
    }
}

export const resetPackage = () => (dispatch: Dispatch) => {
    dispatch({ type: PackageTypes.RESET_PACKAGE });
}