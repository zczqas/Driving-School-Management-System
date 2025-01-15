import { Dispatch } from "@reduxjs/toolkit";
import EmailTypes from "./emails.types";
import axiosInstance from "@/config/axios.config"
import { openAlert } from "../alert/alert.actions";


export const fetchEmailTemplatesList = () => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_LIST });
        const { data } = await axiosInstance.get(`/email-templates/list`);
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_LIST_SUCCESS, payload: data?.templates });
    } catch (error) {
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_LIST_ERROR, payload: error });
        dispatch(openAlert("Error fetching email templates", "error"));
    }
}

export const fetchEmailTemplateById = (template_name: string) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID });
        const { data } = await axiosInstance.get(`/email-templates/get/${template_name}`);
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID_SUCCESS, payload: data?.content });
    } catch (error) {
        dispatch({ type: EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID_ERROR, payload: error });
        dispatch(openAlert("Error fetching email template", "error"));
    }
}

export const updateEmailTemplate = (template_name: string, content: string, cb: () => void) => async (dispatch: Dispatch) => {
    try {
        dispatch({ type: EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID });
        const { data } = await axiosInstance.put(`/email-templates/update/${template_name}`, { content });
        dispatch({ type: EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID_SUCCESS });
        dispatch(openAlert("Email template updated successfully", "success"));
        if (cb) cb();
    } catch (error) {
        dispatch({ type: EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID_ERROR, payload: error });
        dispatch(openAlert("Error updating email template", "error"));
    }
}