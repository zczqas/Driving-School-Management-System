import { Dispatch } from "redux";
import * as TenantTypes from "./tenant.types";

export const setTenantData = (tenantData: any) => (dispatch: Dispatch) => {
  dispatch({ type: TenantTypes.SET_TENANT_DATA_LOADING });
  try {
    dispatch({
      type: TenantTypes.SET_TENANT_DATA,
      payload: tenantData,
    });
  } catch (error: any) {
    dispatch({
      type: TenantTypes.SET_TENANT_DATA_ERROR,
      payload: error.message,
    });
  }
};