// import { IUserState } from "../interface";
// import * as UserTypes from "./instructor.types";

// const INITIAL_STATE: any = {
//   userList: null,
//   userListLoading: false,
//   userListError: null,
//   userListSuccess: false,
//   userCreateSuccess: false,
//   userCreateLoading: false,
//   userCreateError: null,
//   userUpdateSuccess: false,
//   userUpdateLoading: false,
//   userUpdateError: null,
//   userDeleteSuccess: false,
//   userDeleteLoading: false,
//   userDeleteError: null,
// };

// const userReducer = (state = INITIAL_STATE, action: any) => {
//   const { type, payload } = action;
//   switch (type) {
//     case UserTypes.FETCH_USER_LIST_START:
//       return {
//         ...state,
//         userListLoading: true,
//       };
//     case UserTypes.FETCH_USER_LIST_SUCCESS:
//       return {
//         ...state,
//         userList: payload,
//         userListLoading: false,
//         userListSuccess: true,
//       };
//     case UserTypes.FETCH_USER_LIST_ERROR:
//       return {
//         ...state,
//         userListError: payload,
//         userListLoading: false,
//       };
//     case UserTypes.UPDATE_USER_ROLE_START:
//       return {
//         ...state,
//         userUpdateLoading: true,
//       };
//     case UserTypes.UPDATE_USER_ROLE_SUCCESS:
//       return {
//         ...state,
//         userUpdateLoading: false,
//         userUpdateSuccess: true,
//         userList: {
//           ...state.userList,
//           users: state?.userList?.users.filter(
//             (user: any) => user.id !== payload.id
//           ),
//         },
//       };
//     case UserTypes.UPDATE_USER_ROLE_ERROR:
//       return {
//         ...state,
//         userUpdateLoading: false,
//         userUpdateError: payload,
//       };

//     default:
//       return state;
//   }
// };

// export default userReducer;
