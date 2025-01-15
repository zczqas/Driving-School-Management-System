import {
  Action,
  AnyAction,
  combineReducers,
  configureStore,
  ThunkAction,
} from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import alertReducer from "./alert/alert.reducer";
import authReducer from "./auth/auth.reducer";
import userReducer from "./user/user.reducer";
import lessonReducer from "./lesson/lesson.reducer";
import packageReducer from "./package/package.reducer";
import accountReducer from "./account/account.reducer";
import appointmentReducer from "./appointment/appointment.reducer";
import masterListReducer from "./masterlist/masterlist.reducer";
import certificateReducer from "./certificate/certificate.reducer";
import emailReducer from "./emails/emails.reducer";
import driverReducer from "./driverEd/driver.reducer";
import drivingSchoolConfigReducer from "./configuration/configuration.reducer";
import coupons from "@/pages/manage/coupons";
import couponReducer from "./coupons/coupons.reducer";
import scheduleReducer from "./schedule/schedule.reducer";
import tenantReducer from "./tenant/tenant.reducer";
import blogsReducer from "./blogs/blogs.reducer";
import courseReducer from "./course/course.reducer";

const combinedReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  user: userReducer,
  lesson: lessonReducer,
  package: packageReducer,
  account: accountReducer,
  appointment: appointmentReducer,
  masterlist: masterListReducer,
  certificate: certificateReducer,
  emails: emailReducer,
  driver: driverReducer,
  drivingSchoolConfig: drivingSchoolConfigReducer,
  coupons: couponReducer,
  schedule: scheduleReducer,
  tenant: tenantReducer,
  blogs: blogsReducer,
  course: courseReducer,
});

const reducer = (
  state: ReturnType<typeof combinedReducer>,
  action: AnyAction
) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    // Preserve the current `auth` state if it exists

    if (state.auth) {
      nextState.auth = state.auth;
    }

    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
  });

type Store = ReturnType<typeof makeStore>;

export type AppDispatch = Store["dispatch"];
export type RootState = ReturnType<Store["getState"]>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export const wrapper = createWrapper(makeStore, { debug: false });
