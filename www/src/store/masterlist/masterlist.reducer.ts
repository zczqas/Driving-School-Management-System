import { IMasterListState } from "../interface";
import { MasterListActionTypes } from "./masterlist.types";

const INITIAL_STATE: IMasterListState = {
  school: {
    schoolList: [],
    schoolListLoading: false,
    schoolListError: null,
    createSchoolLoading: false,
    createSchoolSuccess: false,
    createSchoolError: null,
    updateSchoolLoading: false,
    updateSchoolSuccess: false,
    updateSchoolError: null,
    deleteSchoolLoading: false,
    deleteSchoolSuccess: false,
    deleteSchoolError: null,
    schoolById: null,
    schoolByIdLoading: false,
    schoolByIdError: null,
  },
  drivingSchool: {
    drivingSchoolList: [],
    drivingSchoolListLoading: false,
    drivingSchoolListError: null,
  },
  city: {
    cityList: [],
    cityListLoading: false,
    cityListError: null,
    createCityLoading: false,
    createCitySuccess: false,
    createCityError: null,
    updateCityLoading: false,
    updateCitySuccess: false,
    updateCityError: null,
    deleteCityLoading: false,
    deleteCitySuccess: false,
    deleteCityError: null,
    cityById: null,
    cityByIdLoading: false,
    cityByIdError: null,
  },
  gasStation: {
    gasStationList: [],
    gasStationListLoading: false,
    gasStationListError: null,
    createGasStationLoading: false,
    createGasStationSuccess: false,
    createGasStationError: null,
    updateGasStationLoading: false,
    updateGasStationSuccess: false,
    updateGasStationError: null,
    deleteGasStationLoading: false,
    deleteGasStationSuccess: false,
    deleteGasStationError: null,
    gasStationById: null,
    gasStationByIdLoading: false,
    gasStationByIdError: null,
  },
  appointmentStatus: {
    appointmentStatusList: [],
    appointmentStatusListLoading: false,
    appointmentStatusListError: null,
    createAppointmentStatusLoading: false,
    createAppointmentStatusSuccess: false,
    createAppointmentStatusError: null,
    updateAppointmentStatusLoading: false,
    updateAppointmentStatusSuccess: false,
    updateAppointmentStatusError: null,
    deleteAppointmentStatusLoading: false,
    deleteAppointmentStatusSuccess: false,
    deleteAppointmentStatusError: null,
    appointmentStatusById: null,
    appointmentStatusByIdLoading: false,
    appointmentStatusByIdError: null,
  },
  vehicle: {
    vehicleList: [],
    vehicleListLoading: false,
    vehicleListError: null,
    createVehicleLoading: false,
    createVehicleSuccess: false,
    createVehicleError: null,
    updateVehicleLoading: false,
    updateVehicleSuccess: false,
    updateVehicleError: null,
    deleteVehicleLoading: false,
    deleteVehicleSuccess: false,
    deleteVehicleError: null,
    vehicleById: null,
    vehicleByIdLoading: false,
    vehicleByIdError: null,
  },
  instructions: {
    instructionsList: [],
    instructionsListLoading: false,
    instructionsListError: null,
    createInstructionsLoading: false,
    createInstructionsSuccess: false,
    createInstructionsError: null,
    updateInstructionsLoading: false,
    updateInstructionsSuccess: false,
    updateInstructionsError: null,
    deleteInstructionsLoading: false,
    deleteInstructionsSuccess: false,
    deleteInstructionsError: null,
    instructionsById: null,
    instructionsByIdLoading: false,
    instructionsByIdError: null,
  },
  certificates: {
    certificatesLogList: [],
    certificatesLogListLoading: false,
    certificatesLogListError: null,
    dmvCertificatesList: [],
    dmvCertificatesListLoading: false,
    dmvCertificatesListError: null,
    createCertificatesLoading: false,
    createCertificatesSuccess: false,
    createCertificatesError: null,
    updateCertificatesLoading: false,
    updateCertificatesSuccess: false,
    updateCertificatesError: null,
    deleteCertificatesLoading: false,
    deleteCertificatesSuccess: false,
    deleteCertificatesError: null,
    certificatesById: null,
    certificatesByIdLoading: false,
    certificatesByIdError: null,
  },
  pickUpLocationType: {
    pickUpLocationTypeList: [],
    pickUpLocationTypeListLoading: false,
    pickUpLocationTypeListError: null,
    createPickUpLocationTypeLoading: false,
    createPickUpLocationTypeSuccess: false,
    createPickUpLocationTypeError: null,
    updatePickUpLocationTypeLoading: false,
    updatePickUpLocationTypeSuccess: false,
    updatePickUpLocationTypeError: null,
    deletePickUpLocationTypeLoading: false,
    deletePickUpLocationTypeSuccess: false,
    deletePickUpLocationTypeError: null,
    pickUpLocationTypeById: null,
    pickUpLocationTypeByIdLoading: false,
    pickUpLocationTypeByIdError: null,
  },
  course: {
    courseList: [],
    courseListLoading: false,
    courseListError: null,
    createCourseLoading: false,
    createCourseSuccess: false,
    createCourseError: null,
  },
  unit: {
    unitList: [],
    unitListLoading: false,
    unitListError: null,
    createUnitLoading: false,
    createUnitSuccess: false,
    createUnitError: null,
    updateUnitLoading: false,
    updateUnitSuccess: false,
    updateUnitError: null,
    deleteUnitLoading: false,
    deleteUnitSuccess: false,
    deleteUnitError: null,
  },
};

const masterListReducer = (state = INITIAL_STATE, action: any) => {
  const { type, payload } = action;
  switch (type) {
    case MasterListActionTypes.GET_SCHOOLS:
      return {
        ...state,
        school: {
          ...state.school,
          schoolListLoading: true,
          schoolById: null,
        },
      };
    case MasterListActionTypes.GET_SCHOOLS_SUCCESS:
      return {
        ...state,
        school: {
          ...state.school,
          schoolListLoading: false,
          schoolList: payload,
        },
      };
    case MasterListActionTypes.GET_SCHOOLS_ERROR:
      return {
        ...state,
        school: {
          ...state.school,
          schoolListLoading: false,
          schoolListError: payload,
        },
      };

    case MasterListActionTypes.GET_DRIVING_SCHOOLS:
      return {
        ...state,
        drivingSchool: {
          ...state.drivingSchool,
          drivingSchoolListLoading: true,
          drivingSchoolList: null,
        },
      };

    case MasterListActionTypes.GET_DRIVING_SCHOOLS_SUCCESS:
      return {
        ...state,
        drivingSchool: {
          ...state.drivingSchool,
          drivingSchoolListLoading: false,
          drivingSchoolList: payload,
        },
      };
    case MasterListActionTypes.GET_DRIVING_SCHOOLS_ERROR:
      return {
        ...state,
        drivingSchool: {
          ...state.drivingSchool,
          drivingSchoolListLoading: false,
          drivingSchoolListError: payload,
        },
      };
    case MasterListActionTypes.GET_SCHOOL_BY_ID:
      return {
        ...state,
        school: {
          ...state.school,
          schoolByIdLoading: true,
          schoolById: null,
        },
      };

    case MasterListActionTypes.GET_SCHOOL_BY_ID_SUCCESS:
      return {
        ...state,
        school: {
          ...state.school,
          schoolByIdLoading: false,
          schoolById: payload,
        },
      };

    case MasterListActionTypes.GET_CITIES:
      return {
        ...state,
        city: {
          ...state.city,
          cityListLoading: true,
          cityById: null,
        },
      };
    case MasterListActionTypes.GET_CITIES_SUCCESS:
      return {
        ...state,
        city: {
          ...state.city,
          cityListLoading: false,
          cityList: payload,
        },
      };
    case MasterListActionTypes.GET_CITIES_ERROR:
      return {
        ...state,
        city: {
          ...state.city,
          cityListLoading: false,
          cityListError: payload,
        },
      };

    case MasterListActionTypes.GET_CITY_BY_ID:
      return {
        ...state,
        city: {
          ...state.city,
          cityByIdLoading: true,
          cityById: null,
        },
      };

    case MasterListActionTypes.GET_CITY_BY_ID_SUCCESS:
      return {
        ...state,
        city: {
          ...state.city,
          cityByIdLoading: false,
          cityById: payload,
        },
      };

    case MasterListActionTypes.GET_CITY_BY_ID_ERROR:
      return {
        ...state,
        city: {
          ...state.city,
          cityByIdLoading: false,
          cityByIdError: payload,
        },
      };
    case MasterListActionTypes.GET_GAS_STATIONS:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationListLoading: true,
          gasStationById: null,
        },
      };
    case MasterListActionTypes.GET_GAS_STATIONS_SUCCESS:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationListLoading: false,
          gasStationList: payload,
        },
      };
    case MasterListActionTypes.GET_GAS_STATIONS_ERROR:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationListLoading: false,
          gasStationListError: payload,
        },
      };

    case MasterListActionTypes.GET_GAS_STATIONS_BY_ID:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationByIdLoading: true,
          gasStationById: null,
        },
      };

    case MasterListActionTypes.GET_GAS_STATIONS_BY_ID_SUCCESS:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationByIdLoading: false,
          gasStationById: payload,
        },
      };

    case MasterListActionTypes.GET_GAS_STATIONS_BY_ID_ERROR:
      return {
        ...state,
        gasStation: {
          ...state.gasStation,
          gasStationByIdLoading: false,
          gasStationByIdError: payload,
        },
      };

    case MasterListActionTypes.GET_APPOINTMENT_STATUS:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusListLoading: true,
          appointmentStatusById: null,
        },
      };
    case MasterListActionTypes.GET_APPOINTMENT_STATUS_SUCCESS:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusListLoading: false,
          appointmentStatusList: payload,
        },
      };
    case MasterListActionTypes.GET_APPOINTMENT_STATUS_ERROR:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusListLoading: false,
          appointmentStatusListError: payload,
        },
      };

    case MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusByIdLoading: true,
          appointmentStatusById: null,
        },
      };

    case MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID_SUCCESS:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusByIdLoading: false,
          appointmentStatusById: payload,
        },
      };

    case MasterListActionTypes.GET_APPOINTMENT_STATUS_BY_ID_ERROR:
      return {
        ...state,
        appointmentStatus: {
          ...state.appointmentStatus,
          appointmentStatusByIdLoading: false,
          appointmentStatusByIdError: payload,
        },
      };

    case MasterListActionTypes.GET_VEHICLES:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleListLoading: true,
          vehicleById: null,
        },
      };
    case MasterListActionTypes.GET_VEHICLES_SUCCESS:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleListLoading: false,
          vehicleList: payload,
        },
      };
    case MasterListActionTypes.GET_VEHICLES_ERROR:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleListLoading: false,
          vehicleListError: payload,
        },
      };

    case MasterListActionTypes.GET_VEHICLE_BY_ID:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleByIdLoading: true,
          vehicleById: null,
        },
      };

    case MasterListActionTypes.GET_VEHICLE_BY_ID_SUCCESS:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleByIdLoading: false,
          vehicleById: payload,
        },
      };

    case MasterListActionTypes.GET_VEHICLE_BY_ID_ERROR:
      return {
        ...state,
        vehicle: {
          ...state.vehicle,
          vehicleByIdLoading: false,
          vehicleByIdError: payload,
        },
      };

    case MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsListLoading: true,
          instructionsById: null,
        },
      };

    case MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS_SUCCESS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsListLoading: false,
          instructionsList: payload,
          instructionsListError: null,
        },
      };

    case MasterListActionTypes.GET_ALL_TRAINING_INSTRUCTIONS_ERROR:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsListLoading: false,
          instructionsListError: payload,
        },
      };

    case MasterListActionTypes.CREATE_TRAINING_INSTRUCTION:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          createInstructionsLoading: true,
          createInstructionsSuccess: false,
          createInstructionsError: null,
        },
      };

    case MasterListActionTypes.CREATE_TRAINING_INSTRUCTION_SUCCESS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          createInstructionsLoading: false,
          createInstructionsSuccess: true,
        },
      };

    case MasterListActionTypes.CREATE_TRAINING_INSTRUCTION_ERROR:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          createInstructionsLoading: false,
          createInstructionsError: payload,
        },
      };

    case MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          updateInstructionsLoading: true,
          updateInstructionsSuccess: false,
          updateInstructionsError: null,
        },
      };

    case MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION_SUCCESS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          updateInstructionsLoading: false,
          updateInstructionsSuccess: true,
        },
      };

    case MasterListActionTypes.UPDATE_TRAINING_INSTRUCTION_ERROR:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          updateInstructionsLoading: false,
          updateInstructionsError: payload,
        },
      };

    case MasterListActionTypes.DELETE_TRAINING_INSTRUCTION:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          deleteInstructionsLoading: true,
          deleteInstructionsSuccess: false,
          deleteInstructionsError: null,
        },
      };

    case MasterListActionTypes.DELETE_TRAINING_INSTRUCTION_SUCCESS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          deleteInstructionsLoading: false,
          deleteInstructionsSuccess: true,
        },
      };

    case MasterListActionTypes.DELETE_TRAINING_INSTRUCTION_ERROR:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          deleteInstructionsLoading: false,
          deleteInstructionsError: payload,
        },
      };

    case MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsByIdLoading: true,
          instructionsById: null,
        },
      };

    case MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID_SUCCESS:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsByIdLoading: false,
          instructionsById: payload,
        },
      };

    case MasterListActionTypes.GET_TRAINING_INSTRUCTION_BY_ID_ERROR:
      return {
        ...state,
        instructions: {
          ...state.instructions,
          instructionsByIdLoading: false,
          instructionsByIdError: payload,
        },
      };

    case MasterListActionTypes.GET_CERTIFICATE_BATCH:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          certificatesLogListLoading: true,
          certificatesById: null,
        },
      };

    case MasterListActionTypes.GET_CERTIFICATE_BATCH_SUCCESS:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          certificatesLogListLoading: false,
          certificatesLogList: payload,
        },
      };

    case MasterListActionTypes.GET_CERTIFICATE_BATCH_ERROR:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          certificatesLogListLoading: false,
          certificatesLogListError: payload,
        },
      };

    case MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          dmvCertificatesListLoading: true,
          certificatesById: null,
        },
      };

    case MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS_SUCCESS:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          dmvCertificatesListLoading: false,
          dmvCertificatesList: payload,
        },
      };

    case MasterListActionTypes.GET_DMV_CERTIFICATE_LOGS_ERROR:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          dmvCertificatesListLoading: false,
          dmvCertificatesListError: payload,
        },
      };

    case MasterListActionTypes.ADD_CERTIFICATES_TO_SYSTEM:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          createCertificatesLoading: true,
          createCertificatesSuccess: false,
          createCertificatesError: null,
        },
      };

    case MasterListActionTypes.ADD_CERTIFICATES_TO_SYSTEM_SUCCESS:
      return {
        ...state,
        certificates: {
          ...state.certificates,
          createCertificatesLoading: false,
          createCertificatesSuccess: true,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeListLoading: true,
          pickUpLocationTypeById: null,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeListLoading: false,
          pickUpLocationTypeList: payload,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_ERROR:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeListLoading: false,
          pickUpLocationTypeListError: payload,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeByIdLoading: true,
          pickUpLocationTypeById: null,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID_SUCCESS:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeByIdLoading: false,
          pickUpLocationTypeById: payload,
        },
      };

    case MasterListActionTypes.GET_PICKUP_LOCATION_TYPES_BY_ID_ERROR:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          pickUpLocationTypeByIdLoading: false,
          pickUpLocationTypeByIdError: payload,
        },
      };

    case MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          createPickUpLocationTypeLoading: true,
          createPickUpLocationTypeSuccess: false,
          createPickUpLocationTypeError: null,
        },
      };

    case MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          createPickUpLocationTypeLoading: false,
          createPickUpLocationTypeSuccess: true,
        },
      };

    case MasterListActionTypes.CREATE_PICKUP_LOCATION_TYPES_ERROR:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          createPickUpLocationTypeLoading: false,
          createPickUpLocationTypeError: payload,
        },
      };

    case MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          updatePickUpLocationTypeLoading: true,
          updatePickUpLocationTypeSuccess: false,
          updatePickUpLocationTypeError: null,
        },
      };

    case MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          updatePickUpLocationTypeLoading: false,
          updatePickUpLocationTypeSuccess: true,
        },
      };

    case MasterListActionTypes.UPDATE_PICKUP_LOCATION_TYPES_ERROR:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          updatePickUpLocationTypeLoading: false,
          updatePickUpLocationTypeError: payload,
        },
      };

    case MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          deletePickUpLocationTypeLoading: true,
          deletePickUpLocationTypeSuccess: false,
          deletePickUpLocationTypeError: null,
        },
      };

    case MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES_SUCCESS:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          deletePickUpLocationTypeLoading: false,
          deletePickUpLocationTypeSuccess: true,
        },
      };

    case MasterListActionTypes.DELETE_PICKUP_LOCATION_TYPES_ERROR:
      return {
        ...state,
        pickUpLocationType: {
          ...state.pickUpLocationType,
          deletePickUpLocationTypeLoading: false,
          deletePickUpLocationTypeError: payload,
        },
      };

    case MasterListActionTypes.GET_COURSES:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: true,
        },
      };
    case MasterListActionTypes.GET_COURSES_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: false,
          courseList: payload,
        },
      };
    case MasterListActionTypes.GET_COURSES_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          courseListLoading: false,
          courseListError: payload,
        },
      };

    case MasterListActionTypes.CREATE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: true,
          createCourseSuccess: false,
          createCourseError: null,
        },
      };
    case MasterListActionTypes.CREATE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: false,
          createCourseSuccess: true,
        },
      };
    case MasterListActionTypes.CREATE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          createCourseLoading: false,
          createCourseError: payload,
        },
      };

    case MasterListActionTypes.DELETE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: true,
          deleteCourseSuccess: false,
          deleteCourseError: null,
        },
      };
    case MasterListActionTypes.DELETE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: false,
          deleteCourseSuccess: true,
        },
      };
    case MasterListActionTypes.DELETE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          deleteCourseLoading: false,
          deleteCourseError: payload,
        },
      };

    case MasterListActionTypes.UPDATE_COURSE:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: true,
          updateCourseSuccess: false,
          updateCourseError: null,
        },
      };

    case MasterListActionTypes.UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: false,
          updateCourseSuccess: true,
        },
      };

    case MasterListActionTypes.UPDATE_COURSE_ERROR:
      return {
        ...state,
        course: {
          ...state.course,
          updateCourseLoading: false,
          updateCourseError: payload,
        },
      };

    case MasterListActionTypes.GET_UNITS:
      return {
        ...state,
        unit: {
          ...state.unit,
          unitListLoading: true,
        },
      };
    case MasterListActionTypes.GET_UNITS_SUCCESS:
      return {
        ...state,
        unit: {
          ...state.unit,
          unitListLoading: false,
          unitList: payload,
        },
      };
    case MasterListActionTypes.GET_UNITS_ERROR:
      return {
        ...state,
        unit: {
          ...state.unit,
          unitListLoading: false,
          unitListError: payload,
        },
      };

    case MasterListActionTypes.CREATE_UNIT:
      return {
        ...state,
        unit: {
          ...state.unit,
          createUnitLoading: true,
          createUnitSuccess: false,
          createUnitError: null,
        },
      };
    case MasterListActionTypes.CREATE_UNIT_SUCCESS:
      return {
        ...state,
        unit: {
          ...state.unit,
          createUnitLoading: false,
          createUnitSuccess: true,
        },
      };
    case MasterListActionTypes.CREATE_UNIT_ERROR:
      return {
        ...state,
        unit: {
          ...state.unit,
          createUnitLoading: false,
          createUnitError: payload,
        },
      };

    case MasterListActionTypes.UPDATE_UNIT:
      return {
        ...state,
        unit: {
          ...state.unit,
          updateUnitLoading: true,
          updateUnitSuccess: false,
          updateUnitError: null,
        },
      };
    case MasterListActionTypes.UPDATE_UNIT_SUCCESS:
      return {
        ...state,
        unit: {
          ...state.unit,
          updateUnitLoading: false,
          updateUnitSuccess: true,
        },
      };
    case MasterListActionTypes.UPDATE_UNIT_ERROR:
      return {
        ...state,
        unit: {
          ...state.unit,
          updateUnitLoading: false,
          updateUnitError: payload,
        },
      };

    case MasterListActionTypes.DELETE_UNIT:
      return {
        ...state,
        unit: {
          ...state.unit,
          deleteUnitLoading: true,
          deleteUnitSuccess: false,
          deleteUnitError: null,
        },
      };
    case MasterListActionTypes.DELETE_UNIT_SUCCESS:
      return {
        ...state,
        unit: {
          ...state.unit,
          deleteUnitLoading: false,
          deleteUnitSuccess: true,
        },
      };
    case MasterListActionTypes.DELETE_UNIT_ERROR:
      return {
        ...state,
        unit: {
          ...state.unit,
          deleteUnitLoading: false,
          deleteUnitError: payload,
        },
      };

    default:
      return state;
  }
};

export default masterListReducer;
