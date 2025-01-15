import { ICouponState } from "../interface";

import * as CouponTypes from "./coupons.types";

const INITIAL_STATE: ICouponState = {
    couponList: [],
    couponListLoading: false,
    couponListError: "",
    createCouponLoading: false,
    createCouponSuccess: false,
    createCouponError: "",
    updateCouponLoading: false,
    updateCouponSuccess: false,
    updateCouponError: "",
    deleteCouponLoading: false,
    deleteCouponSuccess: false,
    deleteCouponError: "",
    couponById: null,
    couponByIdLoading: false,
    couponByIdError: "",
}

const couponReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case CouponTypes.GET_ALL_COUPONS_START:
            return {
                ...state,
                couponListLoading: true,
            };

        case CouponTypes.GET_ALL_COUPONS_SUCCESS:
            return {
                ...state,
                couponList: payload,
                couponListLoading: false,
            };

        case CouponTypes.GET_ALL_COUPONS_ERROR:
            return {
                ...state,
                couponListError: payload,
                couponListLoading: false,
            }

        case CouponTypes.GET_COUPON_START:
            return {
                ...state,
                couponByIdLoading: true,
            };

        case CouponTypes.GET_COUPON_SUCCESS:
            return {
                ...state,
                couponById: payload?.coupon,
                couponByIdLoading: false,
            };

        case CouponTypes.GET_COUPON_ERROR:
            return {
                ...state,
                couponByIdError: payload,
                couponByIdLoading: false,
            };

        case CouponTypes.CREATE_COUPON_START:
            return {
                ...state,
                createCouponLoading: true,
            };
        case CouponTypes.CREATE_COUPON_SUCCESS:
            return {
                ...state,
                createCouponSuccess: true,
                createCouponLoading: false,
            };

        case CouponTypes.CREATE_COUPON_ERROR:
            return {
                ...state,
                createCouponError: payload,
                createCouponLoading: false,
            };

        case CouponTypes.UPDATE_COUPON_START:
            return {
                ...state,
                updateCouponLoading: true,
            };

        case CouponTypes.UPDATE_COUPON_SUCCESS:
            const updatedCouponListAfterUpdate = state?.couponList?.map((coupon: any) => {
                if (coupon.id === payload.id) {
                    return {
                        ...coupon,
                        ...payload.couponsFields
                    };
                }
                return coupon;
            }) ;
            return {
                ...state,
                couponList: updatedCouponListAfterUpdate,
                updateCouponSuccess: true,
                updateCouponLoading: false,
                couponById: null,
            };

        case CouponTypes.UPDATE_COUPON_ERROR:
            return {
                ...state,
                updateCouponError: payload,
                updateCouponLoading: false,
            };

        case CouponTypes.DELETE_COUPON_START:
            return {
                ...state,
                deleteCouponLoading: true,
            };

        case CouponTypes.DELETE_COUPON_SUCCESS:
            const updatedCouponListAfterDelete = state?.couponList.filter((coupon: any) => coupon.id !== payload);
            return {
                ...state,
                couponList: updatedCouponListAfterDelete,
                deleteCouponSuccess: true,
                deleteCouponLoading: false,
            }

        case CouponTypes.DELETE_COUPON_ERROR:
            return {
                ...state,
                deleteCouponError: payload,
                deleteCouponLoading: false,
            }

        case CouponTypes.UPDATE_COUPON_STATUS_START:
            return {
                ...state,
                updateCouponLoading: true,
            };

        case CouponTypes.UPDATE_COUPON_STATUS_SUCCESS:
            const updatedCouponList = state?.couponList?.map((coupon: any) => {
                if (coupon.id === payload.id) {
                    return {
                        ...coupon,
                        is_active: payload.status
                    };
                }
                return coupon;
            });
            return {
                ...state,
                couponList: updatedCouponList,
                updateCouponSuccess: true,
                updateCouponLoading: false,
            };

        case CouponTypes.UPDATE_COUPON_STATUS_ERROR:
            return {
                ...state,
                updateCouponError: payload,
                updateCouponLoading: false,
            }
        case CouponTypes.RESET_COUPON:
            return {
                ...state,
                createCouponLoading: false,
                createCouponSuccess: false,
                createCouponError: "",
                updateCouponLoading: false,
                updateCouponSuccess: false,
                updateCouponError: "",
                deleteCouponLoading: false,
                deleteCouponSuccess: false,
                deleteCouponError: "",
                couponById: null,
                couponByIdLoading: false,
                couponByIdError: "",
            }
        default:
            return state;
    }
}

export default couponReducer;