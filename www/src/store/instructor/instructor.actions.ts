import { Dispatch } from 'redux';
import * as InstructorTypes from "./instructor.types"

import axiosInstance from "../../config/axios.config"
import { openAlert } from '../alert/alert.actions';

export const fetchInstructors = (role: "STUDENT" | "INSTRUCTOR" | "ALL") => async (dispatch: Dispatch) => {
    dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_LIST_START });
    try {
        const { data } = await axiosInstance.get('/user/get', { params: { role } });
        dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_LIST_ERROR, payload: error });
    }
}

export const fetchInstructor = (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_START });
    try {
        const { data } = await axiosInstance.get(`/user/get/${id}`);
        dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: InstructorTypes.FETCH_INSTRUCTOR_ERROR, payload: error });
    }
}

type Instructor = {
    first_name: string,
    middle_name?: string,
    last_name: string,
    email: string,
    password: string,
    role: string,
    cell_phone: string,
    apartment: string,
    city: string,
    state: string,
    gender: string,
    dob: string,
    school: string,
    address: string,
}

export const createInstructor = (user: Instructor) => async (dispatch: Dispatch) => {
    dispatch({ type: InstructorTypes.CREATE_INSTRUCTOR_START });
    try {
        const { data } = await axiosInstance.put('/user/post', user);
        dispatch({ type: InstructorTypes.CREATE_INSTRUCTOR_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: InstructorTypes.CREATE_INSTRUCTOR_ERROR, payload: error });
    }
}

export const deleteInstructor = (id: string) => async (dispatch: Dispatch) => {
    dispatch({ type: InstructorTypes.DELETE_INSTRUCTOR_START });
    try {
        const { data } = await axiosInstance.delete(`/user/delete/${id}`);
        dispatch({ type: InstructorTypes.DELETE_INSTRUCTOR_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: InstructorTypes.DELETE_INSTRUCTOR_ERROR, payload: error });
    }
}

export const updateInstructorRole = (id: number, role: "STUDENT" | "CSR" | "INSTRUCTOR") => async (dispatch: Dispatch) => {
    dispatch({ type: InstructorTypes.UPDATE_INSTRUCTOR_ROLE_START });
    try {
        const { data } = await axiosInstance.patch(`/user/update/role/${id}?role=${role}`);
        dispatch({ type: InstructorTypes.UPDATE_INSTRUCTOR_ROLE_SUCCESS, payload: { id, role } });
        dispatch(openAlert("Instructor role updated successfully", "success"));
    } catch (error) {
        console.log(error)
        dispatch({ type: InstructorTypes.UPDATE_INSTRUCTOR_ROLE_ERROR, payload: error });
        dispatch(openAlert("Failed to update user role", "error"));
    }
}