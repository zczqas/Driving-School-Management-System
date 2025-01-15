import { IPackageState } from "../interface";

import * as PackageTypes from "./package.types";

const INITIAL_STATE: IPackageState = {
    packageList: {},
    packageListLoading: false,
    packageListError: "",
    createPackageLoading: false,
    createPackageSuccess: false,
    createPackageError: "",
    updatePackageLoading: false,
    updatePackageSuccess: false,
    updatePackageError: "",
    deletePackageLoading: false,
    deletePackageSuccess: false,
    deletePackageError: "",
    packageById: null,
    packageByIdLoading: false,
    packageByIdError: "",
}

const packageReducer = (state = INITIAL_STATE, action: any) => {
    const { type, payload } = action;
    switch (type) {
        case PackageTypes.GET_ALL_PACKAGE_START:
            return {
                ...state,
                packageListLoading: true,
            };

        case PackageTypes.GET_ALL_PACKAGE_SUCCESS:
            return {
                ...state,
                packageList: payload,
                packageListLoading: false,
            };

        case PackageTypes.GET_ALL_PACKAGE_ERROR:
            return {
                ...state,
                packageListError: payload,
                packageListLoading: false,
            }

        case PackageTypes.GET_PACKAGE_START:
            return {
                ...state,
                packageByIdLoading: true,
            };

        case PackageTypes.GET_PACKAGE_SUCCESS:
            return {
                ...state,
                packageById: payload,
                packageByIdLoading: false,
            };

        case PackageTypes.GET_PACKAGE_ERROR:
            return {
                ...state,
                packageByIdError: payload,
                packageByIdLoading: false,
            };

        case PackageTypes.CREATE_PACKAGE_START:
            return {
                ...state,
                createPackageLoading: true,
            };
        case PackageTypes.CREATE_PACKAGE_SUCCESS:
            return {
                ...state,
                createPackageSuccess: true,
                createPackageLoading: false,
            };

        case PackageTypes.CREATE_PACKAGE_ERROR:
            return {
                ...state,
                createPackageError: payload,
                createPackageLoading: false,
            };

        case PackageTypes.UPDATE_PACKAGE_START:
            return {
                ...state,
                updatePackageLoading: true,
            };

        case PackageTypes.UPDATE_PACKAGE_SUCCESS:
            const updatedpackageListAfterUpdate = state?.packageList?.packages.map((item: any) => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        ...payload.packageFields
                    };
                }
                return item;
            });
            return {
                ...state,
                packageList: {
                    ...state.packageList,
                    packages: updatedpackageListAfterUpdate
                },
                updatePackageSuccess: true,
                updatePackageLoading: false,
                packageById: null,
            };

        case PackageTypes.UPDATE_PACKAGE_ERROR:
            return {
                ...state,
                updatePackageError: payload,
                updatePackageLoading: false,
            };

        case PackageTypes.DELETE_PACKAGE_START:
            return {
                ...state,
                deletePackageLoading: true,
            };

        case PackageTypes.DELETE_PACKAGE_SUCCESS:
            const updatedpackageListAfterDelete = state?.packageList?.packages.filter((item: any) => item.id !== payload);
            return {
                ...state,
                packageList: {
                    ...state.packageList,
                    packages: updatedpackageListAfterDelete
                },
                deletePackageSuccess: true,
                deletePackageLoading: false,
            }

        case PackageTypes.DELETE_PACKAGE_ERROR:
            return {
                ...state,
                deletePackageError: payload,
                deletePackageLoading: false,
            }

        case PackageTypes.UPDATE_PACKAGE_STATUS_START:
            return {
                ...state,
                updatePackageLoading: true,
            };

        case PackageTypes.UPDATE_PACKAGE_STATUS_SUCCESS:
            const updatedpackageList = state?.packageList?.packages.map((item: any) => {
                if (item.id === payload.id) {
                    return {
                        ...item,
                        is_active: payload.status
                    };
                }
                return item;
            });
            return {
                ...state,
                packageList: {
                    ...state.packageList,
                    packages: updatedpackageList
                },
                updatePackageSuccess: true,
                updatePackageLoading: false,
            };

        case PackageTypes.UPDATE_PACKAGE_STATUS_ERROR:
            return {
                ...state,
                updatePackageError: payload,
                updatePackageLoading: false,
            }
        case PackageTypes.RESET_PACKAGE:
            return {
                ...state,
                createPackageLoading: false,
                createPackageSuccess: false,
                createPackageError: "",
                updatePackageLoading: false,
                updatePackageSuccess: false,
                updatePackageError: "",
                deletePackageLoading: false,
                deletePackageSuccess: false,
                deletePackageError: "",
                packageById: {},
                packageByIdLoading: false,
                packageByIdError: "",
            }
        default:
            return state;
    }
}

export default packageReducer;