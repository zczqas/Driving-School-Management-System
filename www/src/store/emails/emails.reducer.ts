import { IEmail } from "../interface";
import EmailTypes from "./emails.types";


const INITIAL_STATE: IEmail = {
    emailTemplateList: [],
    emailTemplateListLoading: false,
    emailTemplateListError: null,
    emailTemplateById: null,
    emailTemplateByIdLoading: false,
    emailTemplateByIdError: null,
    createEmailTemplateLoading: false,
    createEmailTemplateSuccess: false,
    createEmailTemplateError: null,
    updateEmailTemplateLoading: false,
    updateEmailTemplateSuccess: false,
}

const emailReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case EmailTypes.FETCH_EMAILS_TEMPLATES_LIST:
            return {
                ...state,
                emailTemplateListLoading: true,
            }
        case EmailTypes.FETCH_EMAILS_TEMPLATES_LIST_SUCCESS:
            return {
                ...state,
                emailTemplateList: payload,
                emailTemplateListLoading: false,
            }
        case EmailTypes.FETCH_EMAILS_TEMPLATES_LIST_ERROR:
            return {
                ...state,
                emailTemplateListError: payload,
                emailTemplateListLoading: false,
            }
        case EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID:
            return {
                ...state,
                emailTemplateByIdLoading: true,
            }
        case EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID_SUCCESS:
            return {
                ...state,
                emailTemplateById: payload,
                emailTemplateByIdLoading: false,
            }
        case EmailTypes.FETCH_EMAILS_TEMPLATES_BY_ID_ERROR:
            return {
                ...state,
                emailTemplateByIdError: payload,
                emailTemplateByIdLoading: false,
            }
        case EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID:
            return {
                ...state,
                updateEmailTemplateLoading: true,
            }
        case EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID_SUCCESS:
            return {
                ...state,
                updateEmailTemplateSuccess: true,
                updateEmailTemplateLoading: false,
            }
        case EmailTypes.UPDATE_EMAILS_TEMPLATES_BY_ID_ERROR:
            return {
                ...state,
                updateEmailTemplateSuccess: false,
                updateEmailTemplateLoading: false,
            }
        default:
            return state;
    }
}

export default emailReducer;