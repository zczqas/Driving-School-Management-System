// Importing Types
import { Dispatch } from "redux";
import { BLOGS_TYPES } from "./blogs.types";

// Importing Axios Instance
import axiosConfig from "@/config/axios.config";


/**
 * Loads blogs from the server.
 * @param {Dispatch} dispatch - The dispatch function from Redux to dispatch actions.
 * @param {offset , limit} - The offset and limit to fetch blogs.
 * @returns None
 */
export const fetchBlogs = (offset: number = 0, limit: number = 20) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: BLOGS_TYPES.FETCH_BLOGS_START,
        });

        const { data } = await axiosConfig.get(`blog/get?offset=${offset}&limit=${limit}`);
        dispatch({
            type: BLOGS_TYPES.FETCH_BLOGS_SUCCESS,
            payload: data,
        });
    } catch (error: any) {
        dispatch({
            type: BLOGS_TYPES.FETCH_BLOGS_FAILURE,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

interface createBlogPayload {
    title: string;
    description: string;
    content: string;
    image: string;
    meta_title: string;
    meta_description: string;
    keywords: string;
    category_id: number;
    driving_school_id: number;
    images: File[];
}


/**
 * Creates a new blog.
 * @param {Dispatch} dispatch - The dispatch function from Redux to dispatch actions.
 * @param {createBlogPayload} - The blog data to create a new blog.
 * @returns None
 */
export const createBlog = (blogData: createBlogPayload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: BLOGS_TYPES.CREATE_BLOG_START,
        });

        const formData = new FormData();
        formData.append("title", blogData?.title);
        formData.append("description", blogData?.description);
        formData.append("content", blogData?.content);
        formData.append("image", blogData?.image);
        formData.append("meta_title", blogData?.meta_title);
        formData.append("meta_description", blogData?.meta_description);
        formData.append("keywords", blogData?.keywords);
        formData.append("category_id", blogData?.category_id.toString());
        formData.append("driving_school_id", blogData?.driving_school_id.toString());
        blogData?.images.forEach((image) => {
            formData.append("images", image);
        });

        const { data } = await axiosConfig.post("blog/create", formData);
        dispatch({
            type: BLOGS_TYPES.CREATE_BLOG_SUCCESS,
            payload: data,
        });
    } catch (error: any) {
        dispatch({
            type: BLOGS_TYPES.CREATE_BLOG_FAILURE,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
}

/**
 * Updates a blog.
 * @param {Dispatch} dispatch - The dispatch function from Redux to dispatch actions.
 * @param {createBlogPayload} - The blog data to update a blog.
 * @param {blogId} - The id of the blog to update.
 * @returns None
 */
export const updateBlog = (blogId: number, blogData: createBlogPayload) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: BLOGS_TYPES.UPDATE_BLOGS_START,
            payload: { blogId, blogData }
        });

        const formData = new FormData();
        formData.append("title", blogData?.title);
        formData.append("description", blogData?.description);
        formData.append("content", blogData?.content);
        formData.append("image", blogData?.image);
        formData.append("meta_title", blogData?.meta_title);
        formData.append("meta_description", blogData?.meta_description);
        formData.append("keywords", blogData?.keywords);
        formData.append("category_id", blogData?.category_id.toString());
        formData.append("driving_school_id", blogData?.driving_school_id.toString());
        blogData?.images.forEach((image) => {
            formData.append("images", image);
        });

        const { data } = await axiosConfig.put(`/blog/update/${blogId}`, formData);
        dispatch({
            type: BLOGS_TYPES.UPDATE_BLOGS_SUCCESS,
            payload: { data, blogId, blogData }
        });
    } catch (error: any) {
        dispatch({
            type: BLOGS_TYPES.UPDATE_BLOGS_FAILURE,
            payload:
            {
                error: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
                blogId,
            }
        });
    }
}

/**
 * Deletes a blog.
 * @param {Dispatch} dispatch - The dispatch function from Redux to dispatch actions.
 * @param {blogId} - The id of the blog to delete.
 * @returns None
 */

export const deleteBlog = (blogId: number) => async (dispatch: Dispatch) => {
    try {
        dispatch({
            type: BLOGS_TYPES.DELETE_BLOGS_START,
            payload: blogId
        });

        const { data } = await axiosConfig.delete(`/blog/delete/${blogId}`);
        dispatch({
            type: BLOGS_TYPES.DELETE_BLOGS_SUCCESS,
            payload: { data, blogId },
        });
    } catch (error: any) {
        dispatch({
            type: BLOGS_TYPES.DELETE_BLOGS_FAILURE,
            payload:
            {
                error: error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
                blogId,
            }
        });
    }
}