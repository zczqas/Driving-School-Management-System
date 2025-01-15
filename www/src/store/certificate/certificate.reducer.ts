import { IUserCertificate } from '../interface';
import { CertificateTypes } from './certificate.types';

const INITIAL_STATE: IUserCertificate = {
  goldCertificateList: [],
  goldCertificateListLoading: false,
  goldCertificateListError: null,
  pinkCertificateList: [],
  pinkCertificateListLoading: false,
  pinkCertificateListError: null,
  userCertificateByUserId: null,
  userCertificateByUserIdError : null,
  userCertificateByUserIdLoading : false
};

const certificateReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD:
      return {
        ...state,
        goldCertificateListLoading: true,
      };

    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD_SUCCESS:
      return {
        ...state,
        goldCertificateList: payload,
        goldCertificateListLoading: false,
      };

    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_GOLD_FAILURE:
      return {
        ...state,
        goldCertificateListError: payload,
        goldCertificateListLoading: false,
      };

    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK:
      return {
        ...state,
        pinkCertificateListLoading: true,
      };

    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK_SUCCESS:
      return {
        ...state,
        pinkCertificateList: payload,
        pinkCertificateListLoading: false,
      };

    case CertificateTypes.GET_ASSIGNED_USER_CERTIFICATE_PINK_FAILURE:
      return {
        ...state,
        pinkCertificateListError: payload,
        pinkCertificateListLoading: false,
      };

    case CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID:
      return{
        ...state,
        userCertificateByUserIdLoading: true
      }

    case CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID_SUCCESS:
      return{
        ...state,
        userCertificateByUserId: payload,
        userCertificateByUserIdLoading: false
      }

    case CertificateTypes.GET_USER_CERTIFICATE_BY_USER_ID_ERROR:
      return{
        ...state,
        userCertificateByUserIdError: payload,
        userCertificateByUserIdLoading: false
      }

    default:
      return state;
  }
};

export default certificateReducer;
