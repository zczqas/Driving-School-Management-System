import { ILessonState } from "../interface";

import * as LessonTypes from "./lesson.types";

const INITIAL_STATE: ILessonState = {
    lessonList: {},
    lessonListLoading: false,
    lessonListError: "",
    createLessonLoading: false,
    createLessonSuccess: false,
    createLessonError: "",
    updateLessonLoading: false,
    updateLessonSuccess: false,
    updateLessonError: "",
    deleteLessonLoading: false,
    deleteLessonSuccess: false,
    deleteLessonError: "",
    lessonById: null,
    lessonByIdLoading: false,
    lessonByIdError: "",
}

const lessonReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case LessonTypes.GET_ALL_LESSONS_START:
            return {
                ...state,
                lessonListLoading: true,
            };

        case LessonTypes.GET_ALL_LESSONS_SUCCESS:
            return {
                ...state,
                lessonList: payload,
                lessonListLoading: false,
            };

        case LessonTypes.GET_ALL_LESSONS_ERROR:
            return {
                ...state,
                lessonListError: payload,
                lessonListLoading: false,
            }

        case LessonTypes.GET_LESSON_START:
            return {
                ...state,
                lessonByIdLoading: true,
            };

        case LessonTypes.GET_LESSON_SUCCESS:
            return {
                ...state,
                lessonById: payload,
                lessonByIdLoading: false,
            };

        case LessonTypes.GET_LESSON_ERROR:
            return {
                ...state,
                lessonByIdError: payload,
                lessonByIdLoading: false,
            };

        case LessonTypes.CREATE_LESSON_START:
            return {
                ...state,
                createLessonLoading: true,
            };
        case LessonTypes.CREATE_LESSON_SUCCESS:
            return {
                ...state,
                createLessonSuccess: true,
                createLessonLoading: false,
            };

        case LessonTypes.CREATE_LESSON_ERROR:
            return {
                ...state,
                createLessonError: payload,
                createLessonLoading: false,
            };

        case LessonTypes.UPDATE_LESSON_START:
            return {
                ...state,
                updateLessonLoading: true,
            };

        case LessonTypes.UPDATE_LESSON_SUCCESS:
            const updatedLessonListAfterUpdate = state?.lessonList?.lessons.map((lesson: any) => {
                if (lesson.id === payload.id) {
                    return {
                        ...lesson,
                        ...payload.lessonFields
                    };
                }
                return lesson;
            });
            return {
                ...state,
                lessonList: {
                    ...state.lessonList,
                    lessons: updatedLessonListAfterUpdate
                },
                updateLessonSuccess: true,
                updateLessonLoading: false,
                lessonById : null,
            };

        case LessonTypes.UPDATE_LESSON_ERROR:
            return {
                ...state,
                updateLessonError: payload,
                updateLessonLoading: false,
            };

        case LessonTypes.DELETE_LESSON_START:
            return {
                ...state,
                deleteLessonLoading: true,
            };

        case LessonTypes.DELETE_LESSON_SUCCESS:
            const updatedLessonListAfterDelete = state?.lessonList?.lessons.filter((lesson: any) => lesson.id !== payload);
            return {
                ...state,
                lessonList: {
                    ...state.lessonList,
                    lessons: updatedLessonListAfterDelete
                },
                deleteLessonSuccess: true,
                deleteLessonLoading: false,
            }

        case LessonTypes.DELETE_LESSON_ERROR:
            return {
                ...state,
                deleteLessonError: payload,
                deleteLessonLoading: false,
            }

        case LessonTypes.UPDATE_LESSON_STATUS_START:
            return {
                ...state,
                updateLessonLoading: true,
            };

        case LessonTypes.UPDATE_LESSON_STATUS_SUCCESS:
            const updatedLessonList = state?.lessonList?.lessons.map((lesson: any) => {
                if (lesson.id === payload.id) {
                    return {
                        ...lesson,
                        is_active: payload.status
                    };
                }
                return lesson;
            });
            return {
                ...state,
                lessonList: {
                    ...state.lessonList,
                    lessons: updatedLessonList
                },
                updateLessonSuccess: true,
                updateLessonLoading: false,
            };

        case LessonTypes.UPDATE_LESSON_STATUS_ERROR:
            return {
                ...state,
                updateLessonError: payload,
                updateLessonLoading: false,
            }
        case LessonTypes.RESET_LESSON:
            return {
                ...state,
                createLessonLoading: false,
                createLessonSuccess: false,
                createLessonError: "",
                updateLessonLoading: false,
                updateLessonSuccess: false,
                updateLessonError: "",
                deleteLessonLoading: false,
                deleteLessonSuccess: false,
                deleteLessonError: "",
                lessonById: {},
                lessonByIdLoading: false,
                lessonByIdError: "",
            }
        default:
            return state;
    }
}

export default lessonReducer;