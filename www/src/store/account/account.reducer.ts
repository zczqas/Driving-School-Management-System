import { IAccountState, EmailLogResponse } from "../interface";
import * as AccountTypes from "./account.types";

const INITIAL_STATE: IAccountState = {
  transactionList: [],
  transactionListLoading: false,
  transactionListError: null,
  transactionListByUserId: [],
  transactionListByUserIdLoading: false,
  transactionListByUserIdError: null,
  pendingTransactionListByUserId: [],
  pendingTransactionListByUserIdLoading: false,
  pendingTransactionListByUserIdError: null,
  createTransactionLoading: false,
  createTransactionSuccess: false,
  createTransactionError: null,
  deleteTransactionLoading: false,
  deleteTransactionSuccess: false,
  deleteTransactionError: null,
  transactionById: null,
  transactionByIdLoading: false,
  transactionByIdFailure: false,
  emailLogs: null,
  emailLogsLoading: false,
  emailLogsError: null,
};

const accountReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case AccountTypes.FETCH_TRANSACTIONS_START:
      return {
        ...state,
        transactionListLoading: true,
        transactionListError: null,
      };
    case AccountTypes.FETCH_TRANSACTIONS_SUCCESS:
      return {
        ...state,
        transactionList: payload,
        transactionListLoading: false,
      };
    case AccountTypes.FETCH_TRANSACTIONS_FAILURE:
      return {
        ...state,
        transactionListLoading: false,
        transactionListError: payload,
      };

    case AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_START:
      return {
        ...state,
        transactionListByUserIdLoading: true,
        transactionListByUserIdError: null,
      };

    case AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_SUCCESS:
      return {
        ...state,
        transactionListByUserId: payload,
        transactionListByUserIdLoading: false,
      };
    case AccountTypes.FETCH_TRANSACTIONS_BY_USER_ID_FAILURE:
      return {
        ...state,
        transactionListByUserIdLoading: false,
        transactionListByUserIdError: payload,
      };

    case AccountTypes.FETCH_PENDING_TRANSACTIONS_BY_USER_ID_START:
      return {
        ...state,
        pendingTransactionListByUserIdLoading: true,
        pendingTransactionListByUserIdError: null,
      };

    case AccountTypes.FETCH_PENDING_TRANSACTIONS_BY_USER_ID_SUCCESS:
      return {
        ...state,
        pendingTransactionListByUserId: payload,
        pendingTransactionListByUserIdLoading: false,
      };

    case AccountTypes.FETCH_PENDING_TRANSACTIONS_BY_USER_ID_FAILURE:
      return {
        ...state,
        pendingTransactionListByUserIdLoading: false,
        pendingTransactionListByUserIdError: payload,
      };

    case AccountTypes.CREATE_TRANSACTION_START:
      return {
        ...state,
        createTransactionLoading: true,
        createTransactionSuccess: false,
        createTransactionError: null,
      };
    case AccountTypes.CREATE_TRANSACTION_SUCCESS:
      return {
        ...state,
        createTransactionLoading: false,
        createTransactionSuccess: true,
      };
    case AccountTypes.CREATE_TRANSACTION_FAILURE:
      return {
        ...state,
        createTransactionLoading: false,
        createTransactionError: payload,
      };
    case AccountTypes.DELETE_TRANSACTION_START:
      return {
        ...state,
        deleteTransactionLoading: true,
        deleteTransactionSuccess: false,
        deleteTransactionError: null,
      };
    case AccountTypes.DELETE_TRANSACTION_SUCCESS:
      return {
        ...state,
        deleteTransactionLoading: false,
        deleteTransactionSuccess: true,
      };
    case AccountTypes.DELETE_TRANSACTION_FAILURE:
      return {
        ...state,
        deleteTransactionLoading: false,
        deleteTransactionError: payload,
      };
    case AccountTypes.DELETE_TRANSACTION_START:
      return {
        ...state,

        transactionByIdLoading: true,
      };
    case AccountTypes.FETCH_TRANSACTIONS_BY_ID_SUCCESS:
      return {
        ...state,
        transactionById: payload,
        transactionByIdLoading: false,
        transactionByIdFailure: false,
      };
    case AccountTypes.FETCH_TRANSACTIONS_BY_ID_FAILURE:
      return {
        ...state,
        transactionById: null,
        transactionByIdLoading: false,
        transactionByIdFailure: true,
      };

    case AccountTypes.FETCH_EMAIL_LOGS_START:
      return {
        ...state,
        emailLogsLoading: true,
        emailLogsError: null,
      };
    case AccountTypes.FETCH_EMAIL_LOGS_SUCCESS:
      return {
        ...state,
        emailLogs: payload as EmailLogResponse,
        emailLogsLoading: false,
      };
    case AccountTypes.FETCH_EMAIL_LOGS_FAILURE:
      return {
        ...state,
        emailLogsLoading: false,
        emailLogsError: payload,
      };

    default:
      return state;
  }
};

export default accountReducer;