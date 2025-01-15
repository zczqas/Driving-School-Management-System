import * as LessonTypes from './lesson.types';

import axiosInstance from '../../config/axios.config';
import { Dispatch } from '@reduxjs/toolkit';

import { openAlert } from '../alert/alert.actions';

export const fetchLessons = (offset: number, limit: number, name?: string) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.GET_ALL_LESSONS_START });
    try {
        const { data } = await axiosInstance.get('/lesson/get', { params: { offset, limit, name } });
        dispatch({ type: LessonTypes.GET_ALL_LESSONS_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: LessonTypes.GET_ALL_LESSONS_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const fetchLessonById = (id: number) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.GET_LESSON_START });
    try {
        const { data } = await axiosInstance.get(`/lesson/get/${id}`);
        dispatch({ type: LessonTypes.GET_LESSON_SUCCESS, payload: data });
    } catch (error: any) {
        dispatch({
            type: LessonTypes.GET_LESSON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
    }
}

export const createLesson = (lessonFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.CREATE_LESSON_START });
    try {
        await axiosInstance.post('/lesson/create', null, { params: lessonFields });
        dispatch({ type: LessonTypes.CREATE_LESSON_SUCCESS, payload: lessonFields });
        cb();
        dispatch(openAlert('Lesson created successfully', 'success'));
    } catch (error: any) {
        dispatch({
            type: LessonTypes.CREATE_LESSON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Lesson creation failed', 'error'));
    }
}

export const updateLesson = (id: string, lessonFields: any, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.UPDATE_LESSON_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/lesson/update/${id}`, lessonFields, config);
        dispatch({ type: LessonTypes.UPDATE_LESSON_SUCCESS, payload: { id, lessonFields } });
        cb();
        dispatch(openAlert('Lesson updated successfully', 'success'));

    } catch (error: any) {
        dispatch({
            type: LessonTypes.UPDATE_LESSON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Lesson update failed', 'error'));
    }
}

export const updateLessonStatus = (id: number, status: boolean, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.UPDATE_LESSON_STATUS_START });
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await axiosInstance.put(`/lesson/update/${id}`, { is_active: status }, config);
        dispatch({ type: LessonTypes.UPDATE_LESSON_STATUS_SUCCESS, payload: { id, status } });
        dispatch(openAlert('Lesson status updated successfully', 'success'));
        cb();
    } catch (error: any) {
        dispatch({
            type: LessonTypes.UPDATE_LESSON_STATUS_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Lesson status update failed', 'error'));
    }
}

export const deleteLesson = (id: number, cb: any) => async (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.DELETE_LESSON_START });
    try {
        await axiosInstance.delete(`/lesson/delete/${id}`);
        dispatch({ type: LessonTypes.DELETE_LESSON_SUCCESS, payload: id });
        cb();
        dispatch(openAlert('Lesson deleted successfully', 'success'))
    } catch (error: any) {
        dispatch({
            type: LessonTypes.DELETE_LESSON_ERROR,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message
        });
        dispatch(openAlert('Lesson deletion failed', 'error'))
    }
}

export const resetLesson = () => (dispatch: Dispatch) => {
    dispatch({ type: LessonTypes.RESET_LESSON });
}