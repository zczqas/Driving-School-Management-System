import { ITenantState } from "../interface";
import * as TenantTypes from "./tenant.types";

const INITIAL_STATE: ITenantState = {
  tenantData: null,
  loading: false,
  error: null,
};

const tenantReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case TenantTypes.SET_TENANT_DATA:
      return {
        ...state,
        tenantData: payload,
        loading: false,
        error: null,
      };
    case TenantTypes.SET_TENANT_DATA_LOADING:
      return {
        ...state,
        loading: true,
      };
    case TenantTypes.SET_TENANT_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: payload,
      };
    default:
      return state;
  }
};

export default tenantReducer;