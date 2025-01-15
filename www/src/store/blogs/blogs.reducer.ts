import { IBlogState } from "../interface";
import { BLOGS_TYPES } from "./blogs.types";

const INITIAL_STATE: IBlogState = {
    blogsData: null,
    blogsDataLoading: false,
    blogsDataError: null,

    blogCreateLoading: false,
    blogCreateSuccess: false,
    blogCreateError: null,

    blogUpdateLoading: false,
    blogUpdateSuccess: false,
    blogUpdateError: null,
}


const blogsReducer = (state = INITIAL_STATE, action: any) => {
    switch (action.type) {
        case BLOGS_TYPES.FETCH_BLOGS_SUCCESS:
            return {
                ...state,
                blogsData: action.payload,
                blogsDataLoading: false,
                blogsDataError: null,
            };
        case BLOGS_TYPES.FETCH_BLOGS_START:
            return {
                ...state,
                blogsDataLoading: true,
                blogsDataError: null,
            };
        case BLOGS_TYPES.FETCH_BLOGS_FAILURE:
            return {
                ...state,
                blogsData: null,
                blogsDataLoading: false,
                blogsDataError: action.payload,
            };

        case BLOGS_TYPES.CREATE_BLOG_START:
            return {
                ...state,
                blogCreateLoading: true,
                blogCreateSuccess: false,
                blogCreateError: null,
            };

        case BLOGS_TYPES.CREATE_BLOG_SUCCESS:
            return {
                ...state,
                blogCreateLoading: false,
                blogCreateSuccess: true,
                blogCreateError: null,
            };

        case BLOGS_TYPES.CREATE_BLOG_FAILURE:
            return {
                ...state,
                blogCreateLoading: false,
                blogCreateSuccess: false,
                blogCreateError: action.payload,
            };

        case BLOGS_TYPES.UPDATE_BLOGS_START:
            return {
                ...state,
                blogUpdateLoading: true,
                blogUpdateSuccess: false,
                blogUpdateError: null,
            };

        case BLOGS_TYPES.UPDATE_BLOGS_SUCCESS:
            return {
                ...state,
                blogUpdateLoading: false,
                blogUpdateSuccess: true,
                blogUpdateError: null,
            };

        case BLOGS_TYPES.UPDATE_BLOGS_FAILURE:
            return {
                ...state,
                blogUpdateLoading: false,
                blogUpdateSuccess: false,
                blogUpdateError: action.payload,
            };


        default:
            return state;
    }
};

export default blogsReducer;