import { QuizQuestionType } from "@/types/unit";

export default interface IRootState {
  auth: IAuthState;
  user: IUserState;
  lesson: ILessonState;
  package: IPackageState;
  account: IAccountState;
  appointment: IAppointmentState;
  masterlist: IMasterListState;
  certificate: IUserCertificate;
  emails: IEmail;
  driver: IDriver;
  drivingSchoolConfig: IDrivingSchoolConfig;
  coupons: ICouponState;
  schedule: IScheduleState;
  tenant: ITenantState;
  blogs: IBlogState;
  course: ICourseState;
}

export interface IAuthState {
  access_token: string | null;
  isAuthenticated: boolean | null;
  authLoading: boolean;
  currentUser: any;
  uploading: boolean;
  newUser: any;
  error: any;
  loading: boolean;
  isEditing: boolean;
  isFetching: boolean;
  profile: any;
  // userInfo: any;
  loadUserFailed: boolean;
  recoverPassword: any;
  role: any;
  notifiedForVerification: boolean;
  id: number | null;
}

interface User {
  id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  school: string;
  email: string;
  is_active: boolean;
  driving_school: any[];
  role: string | "ADMIN" | "INSTRUCTOR" | "STUDENT";
  transactions: any;
  created_at: string;
  updated_at: string;
}
export interface IUserState {
  userList: { total_count: number; users: User[] } | null;
  userListLoading: boolean;
  userListError: any;
  userListSuccess: boolean;
  userCreateSuccess: boolean;
  userCreateLoading: boolean;
  userCreateError: any;
  userUpdateSuccess: boolean;
  userUpdateLoading: boolean;
  userUpdateError: any;
  userDeleteSuccess: boolean;
  userDeleteLoading: boolean;
  userDeleteError: any;
  userDetails: any;
  userDetailsById: any;
  uploadStudentFileProgress: number;
  uploadStudentFileSuccess: boolean;
  uploadStudentFileError: any;
  instructorTrainingLogs: any;
  instructorTrainingLogsLoading: boolean;
  instructorTrainingLogsError: any;
  instructorNotesByUserId: any;
  instructorNotesByUserIdLoading: boolean;
  instructorNotesByUserIdError: any;
  selectedInstructor: any | null;
  selectedInstructorLoading: boolean;
  selectedInstructorError: string | null;
}

export interface ILessonState {
  lessonList: any;
  lessonListLoading: boolean;
  lessonListError: any;
  createLessonLoading: boolean;
  createLessonSuccess: boolean;
  createLessonError: any;
  updateLessonLoading: boolean;
  updateLessonSuccess: boolean;
  updateLessonError: any;
  deleteLessonLoading: boolean;
  deleteLessonSuccess: boolean;
  deleteLessonError: any;
  lessonById: any;
  lessonByIdLoading: boolean;
  lessonByIdError: any;
}

export interface IPackageState {
  packageList: any;
  packageListLoading: boolean;
  packageListError: any;
  createPackageLoading: boolean;
  createPackageSuccess: boolean;
  createPackageError: any;
  updatePackageLoading: boolean;
  updatePackageSuccess: boolean;
  updatePackageError: any;
  deletePackageLoading: boolean;
  deletePackageSuccess: boolean;
  deletePackageError: any;
  packageById: any;
  packageByIdLoading: boolean;
  packageByIdError: any;
}

export interface IAccountState {
  transactionList: any;
  transactionListLoading: boolean;
  transactionListError: any;
  transactionListByUserId: any;
  transactionListByUserIdLoading: boolean;
  transactionListByUserIdError: any;
  pendingTransactionListByUserId: any;
  pendingTransactionListByUserIdLoading: boolean;
  pendingTransactionListByUserIdError: any;
  createTransactionLoading: boolean;
  createTransactionSuccess: boolean;
  createTransactionError: any;
  deleteTransactionLoading: boolean;
  deleteTransactionSuccess: boolean;
  deleteTransactionError: any;
  transactionById: any;
  transactionByIdLoading: boolean;
  transactionByIdFailure: boolean;
  emailLogs: EmailLogResponse | null;
  emailLogsLoading: boolean;
  emailLogsError: string | null;
}

export interface EmailLogResponse {
  total: number;
  offset: number;
  limit: number;
  email_logs: EmailLog[];
}

export interface EmailLog {
  id: number;
  name: string;
  user_profiles_id: number;
  user: {
    id: number;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    email: string;
    role: string;
  };
  html_file_name: string;
  content: string | null;
  created_at: string;
}

export interface IAppointmentState {
  appointmentList: any;
  appointmentListLoading: boolean;
  appointmentListError: any;
  createAppointmentLoading: boolean;
  createAppointmentSuccess: boolean;
  createAppointmentError: any;
  updateAppointmentLoading: boolean;
  updateAppointmentSuccess: boolean;
  updateAppointmentError: any;
  deleteAppointmentLoading: boolean;
  deleteAppointmentSuccess: boolean;
  deleteAppointmentError: any;
  appointmentById: any;
  appointmentByIdLoading: boolean;
  appointmentByIdError: any;
  appointmentByUserId: any;
  appointmentByUserIdLoading: boolean;
  appointmentByUserIdError: any;
  appointmentByDate: any;
  appointmentByDateLoading: boolean;
  appointmentByDateError: any;
  appointmentByPayPeriod: any;
  appointmentByPayPeriodLoading: boolean;
  appointmentByPayPeriodError: any;
}

interface MasterListSchool {
  schoolList: any;
  schoolListLoading: boolean;
  schoolListError: any;
  createSchoolLoading: boolean;
  createSchoolSuccess: boolean;
  createSchoolError: any;
  updateSchoolLoading: boolean;
  updateSchoolSuccess: boolean;
  updateSchoolError: any;
  deleteSchoolLoading: boolean;
  deleteSchoolSuccess: boolean;
  deleteSchoolError: any;
  schoolById: any;
  schoolByIdLoading: boolean;
  schoolByIdError: any;
}

interface MasterListDrivingSchool {
  drivingSchoolList: any;
  drivingSchoolListLoading: boolean;
  drivingSchoolListError: any;
}

interface MasterListCity {
  cityList: any;
  cityListLoading: boolean;
  cityListError: any;
  createCityLoading: boolean;
  createCitySuccess: boolean;
  createCityError: any;
  updateCityLoading: boolean;
  updateCitySuccess: boolean;
  updateCityError: any;
  deleteCityLoading: boolean;
  deleteCitySuccess: boolean;
  deleteCityError: any;
  cityById: any;
  cityByIdLoading: boolean;
  cityByIdError: any;
}

interface MasterListGasStation {
  gasStationList: any;
  gasStationListLoading: boolean;
  gasStationListError: any;
  createGasStationLoading: boolean;
  createGasStationSuccess: boolean;
  createGasStationError: any;
  updateGasStationLoading: boolean;
  updateGasStationSuccess: boolean;
  updateGasStationError: any;
  deleteGasStationLoading: boolean;
  deleteGasStationSuccess: boolean;
  deleteGasStationError: any;
  gasStationById: any;
  gasStationByIdLoading: boolean;
  gasStationByIdError: any;
}

interface MasterListAppointmentStatus {
  appointmentStatusList: any;
  appointmentStatusListLoading: boolean;
  appointmentStatusListError: any;
  createAppointmentStatusLoading: boolean;
  createAppointmentStatusSuccess: boolean;
  createAppointmentStatusError: any;
  updateAppointmentStatusLoading: boolean;
  updateAppointmentStatusSuccess: boolean;
  updateAppointmentStatusError: any;
  deleteAppointmentStatusLoading: boolean;
  deleteAppointmentStatusSuccess: boolean;
  deleteAppointmentStatusError: any;
  appointmentStatusById: any;
  appointmentStatusByIdLoading: boolean;
  appointmentStatusByIdError: any;
}

interface MasterListVehicle {
  vehicleList: any;
  vehicleListLoading: boolean;
  vehicleListError: any;
  createVehicleLoading: boolean;
  createVehicleSuccess: boolean;
  createVehicleError: any;
  updateVehicleLoading: boolean;
  updateVehicleSuccess: boolean;
  updateVehicleError: any;
  deleteVehicleLoading: boolean;
  deleteVehicleSuccess: boolean;
  deleteVehicleError: any;
  vehicleById: any;
  vehicleByIdLoading: boolean;
  vehicleByIdError: any;
}

interface MasterListInstructions {
  instructionsList: any;
  instructionsListLoading: boolean;
  instructionsListError: any;
  createInstructionsLoading: boolean;
  createInstructionsSuccess: boolean;
  createInstructionsError: any;
  updateInstructionsLoading: boolean;
  updateInstructionsSuccess: boolean;
  updateInstructionsError: any;
  deleteInstructionsLoading: boolean;
  deleteInstructionsSuccess: boolean;
  deleteInstructionsError: any;
  instructionsById: any;
  instructionsByIdLoading: boolean;
  instructionsByIdError: any;
}

interface MasterListCertificates {
  certificatesLogList: any;
  certificatesLogListLoading: boolean;
  certificatesLogListError: any;
  dmvCertificatesList: any;
  dmvCertificatesListLoading: boolean;
  dmvCertificatesListError: any;
  createCertificatesLoading: boolean;
  createCertificatesSuccess: boolean;
  createCertificatesError: any;
  updateCertificatesLoading: boolean;
  updateCertificatesSuccess: boolean;
  updateCertificatesError: any;
  deleteCertificatesLoading: boolean;
  deleteCertificatesSuccess: boolean;
  deleteCertificatesError: any;
  certificatesById: any;
  certificatesByIdLoading: boolean;
  certificatesByIdError: any;
}

interface PickupLocationType {
  pickUpLocationTypeList: any;
  pickUpLocationTypeListLoading: boolean;
  pickUpLocationTypeListError: any;
  createPickUpLocationTypeLoading: boolean;
  createPickUpLocationTypeSuccess: boolean;
  createPickUpLocationTypeError: any;
  updatePickUpLocationTypeLoading: boolean;
  updatePickUpLocationTypeSuccess: boolean;
  updatePickUpLocationTypeError: any;
  deletePickUpLocationTypeLoading: boolean;
  deletePickUpLocationTypeSuccess: boolean;
  deletePickUpLocationTypeError: any;
  pickUpLocationTypeById: any;
  pickUpLocationTypeByIdLoading: boolean;
  pickUpLocationTypeByIdError: any;
}

interface MasterListCourse {
  courseList: any;
  courseListLoading: boolean;
  courseListError: any;
  createCourseLoading: boolean;
  createCourseSuccess: boolean;
  createCourseError: any;
}

interface MasterListUnit {
  unitList: any;
  unitListLoading: boolean;
  unitListError: any;
  createUnitLoading: boolean;
  createUnitSuccess: boolean;
  createUnitError: any;
  updateUnitLoading: boolean;
  updateUnitSuccess: boolean;
  updateUnitError: any;
  deleteUnitLoading: boolean;
  deleteUnitSuccess: boolean;
  deleteUnitError: any;
}

export interface IMasterListState {
  school: MasterListSchool;
  city: MasterListCity;
  gasStation: MasterListGasStation;
  appointmentStatus: MasterListAppointmentStatus;
  vehicle: MasterListVehicle;
  instructions: MasterListInstructions;
  certificates: MasterListCertificates;
  drivingSchool: MasterListDrivingSchool;
  pickUpLocationType: PickupLocationType;
  course: MasterListCourse;
  unit: MasterListUnit;
}

export interface IUserCertificate {
  goldCertificateList: any;
  goldCertificateListLoading: boolean;
  goldCertificateListError: any;
  pinkCertificateList: any;
  pinkCertificateListLoading: boolean;
  pinkCertificateListError: any;
  userCertificateByUserId: any;
  userCertificateByUserIdLoading: boolean;
  userCertificateByUserIdError: any;
}

export interface IEmail {
  emailTemplateList: any;
  emailTemplateListLoading: boolean;
  emailTemplateListError: any;
  emailTemplateById: any;
  emailTemplateByIdLoading: boolean;
  emailTemplateByIdError: any;
  createEmailTemplateLoading: boolean;
  createEmailTemplateSuccess: boolean;
  createEmailTemplateError: any;
  updateEmailTemplateLoading: boolean;
  updateEmailTemplateSuccess: boolean;
}

export interface IDriver {
  unitList: any;
  unitListLoading: boolean;
  unitLessonsById: any;
  unitLessonsByIdLoading: boolean;
  lessonDetail: any;
  lessonDetailLoading: boolean;
  unitQuizById: any;
  unitQuizByIdLoading: boolean;
  unitQuizSubmitLoading: boolean;
  unitQuizSubmitSuccess: any;
  unitQuizSubmitError: any;
  videoList: any;
  videoListLoading: boolean;
  videoListError: any;
  chartList: any;
  chartListLoading: boolean;
  chartListError: any;
  chartById: any;
  chartByIdLoading: boolean;
  chartByIdError: any;
  finalExam: any;
  finalExamLoading: boolean;
  finalExamError: any;
  finalExamSubmitLoading: boolean;
  finalExamSubmitSuccess: any;
  finalExamSubmitError: any;
  studentTestStatus: any;
  studentTestStatusLoading: boolean;
  studentTestStatusError: any;
  studentProgress: any;
  studentProgressLoading: boolean;
  studentProgressError: any;
}

export interface IDrivingSchoolConfig {
  drivingSchoolById: any;
  drivingSchoolByIdLoading: boolean;
  drivingSchoolByIdError: any;
  updateDrivingSchoolLoading: boolean;
  updateDrivingSchoolSuccess: boolean;
  updateDrivingSchoolError: any;
}

export interface ICouponState {
  couponList: any;
  couponListLoading: boolean;
  couponListError: any;
  createCouponLoading: boolean;
  createCouponSuccess: boolean;
  createCouponError: any;
  updateCouponLoading: boolean;
  updateCouponSuccess: boolean;
  updateCouponError: any;
  deleteCouponLoading: boolean;
  deleteCouponSuccess: boolean;
  deleteCouponError: any;
  couponById: any;
  couponByIdLoading: boolean;
  couponByIdError: any;
}

export interface IScheduleState {
  availabilityData: any;
  instructorAvailability: any;
  instructorSchedule: any;
  appointmentScheduleData: any;
  appointmentById: any;
  pickupLocationTypes: any;
  loading: boolean;
  error: any;
  dateSpecificAvailability: any;
  createDayOffLoading: boolean;
  dayOffList: DayOffList | null;
  dayOffListLoading: boolean;
  dayOffListError: any;
}

export type DayOffList = {
  user_id: number;
  from_: string;
  to_: string;
  day_: string | null;
  reason: string;
  id: number;
}[];

export interface ITenantState {
  tenantData: any | null;
  loading: boolean;
  error: string | null;
}

//  ====== BLOGS ======
type BlogImage = {
  url: string;
  blog_id: number;
  id: number;
};

type Category = {
  name: string;
  description: string;
  id: number;
};

type Blog = {
  title: string;
  description: string;
  content: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  category_id: number;
  driving_school_id: number;
  id: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_deleted: boolean;
  blog_images: BlogImage[];
  category: Category;
};

type BlogsData = {
  total: number;
  blogs: Blog[];
};
export interface IBlogState {
  blogsData: BlogsData | null;
  blogsDataLoading: boolean;
  blogsDataError: any;

  blogCreateLoading: boolean;
  blogCreateSuccess: boolean;
  blogCreateError: any;

  blogUpdateLoading: boolean;
  blogUpdateSuccess: boolean;
  blogUpdateError: any;
}

// ====== BLOGS ENDS======

// ====== ADMIN COURSE MANAGEMENT ======
export interface ICourseState {
  sectionMenu: SectionMenu | null;
  quizQuestions: QuizQuestionType[];
  courseLessonPreview: any;
  course: AdminCourseList;
  unitsById: AdminUnitList;
  courseLessonById: CourseLesson;
  subunit: CourseSubunit;
  courseQuestion: CourseQuestion;
  courseQuiz: CourseQuiz;
}

interface AdminCourseList {
  courseList: any;
  courseListLoading: boolean;
  courseListError: any;
  courseById: {
    title: string;
    description: string;
    id: number;
  } | null;
  courseByIdLoading: false;
  courseByIdError: null;
  createCourseLoading: boolean;
  createCourseSuccess: boolean;
  createCourseError: any;
  updateCourseLoading: boolean;
  updateCourseSuccess: boolean;
  updateCourseError: any;
  deleteCourseLoading: boolean;
  deleteCourseSuccess: boolean;
  deleteCourseError: any;
}

interface AdminUnitList {
  unitList: any;
  unitListLoading: boolean;
  unitListError: any;
  unitByUnitId: any;
  unitByUnitIdLoading: false;
  unitByUnitIdError: null;
  createUnitLoading: boolean;
  createUnitSuccess: boolean;
  createUnitError: any;
  updateUnitLoading: boolean;
  updateUnitSuccess: boolean;
  updateUnitError: any;
  deleteUnitLoading: boolean;
  deleteUnitSuccess: boolean;
  deleteUnitError: any;
}

export interface SectionMenu {
  label: "Text" | "Slide" | "Chart" | "Video" | "Quiz";
  unitId: number;
  sectionId: number;
  type: "add" | "edit";
}

export interface QuizQuestionsWithUnitIdType {
  unitId: number;
  questions: QuizQuestionType[];
}

export interface CourseLessonPreview {
  previewInitiatorState: SectionMenu;
  previewContent: string;
}

export interface CourseLesson {
  lessonList: any;
  lessonListLoading: boolean;
  lessonListError: any;
  lessonById: any;
  lessonByIdLoading: boolean;
  lessonByIdError: any;
  createLessonContentLoading: boolean;
  createLessonContentSuccess: boolean;
  createLessonContentError: any;
  createLessonVideoLoading: boolean;
  createLessonVideoSuccess: boolean;
  createLessonVideoError: any;
  createLessonChartLoading: boolean;
  createLessonChartSuccess: boolean;
  createLessonChartError: any;
  updateLessonLoading: boolean;
  updateLessonSuccess: boolean;
  updateLessonError: any;
  deleteLessonLoading: boolean;
  deleteLessonSuccess: boolean;
  deleteLessonError: any;
}

export interface CourseSubunit {
  subunitList: any;
  subunitListLoading: boolean;
  subunitListError: any;
  createSubunitLoading: boolean;
  createSubunitSuccess: boolean;
  createSubunitError: any;
  updateSubunitLoading: boolean;
  updateSubunitSuccess: boolean;
  updateSubunitError: any;
  deleteSubunitLoading: boolean;
  deleteSubunitSuccess: boolean;
  deleteSubunitError: any;
}

export interface CourseQuestion {
  questionList: any;
  questionListLoading: boolean;
  questionListError: any;
  createQuestionLoading: boolean;
  createQuestionSuccess: boolean;
  createQuestionError: any;
  updateQuestionLoading: boolean;
  updateQuestionSuccess: boolean;
  updateQuestionError: any;
  deleteQuestionLoading: boolean;
  deleteQuestionSuccess: boolean;
  deleteQuestionError: any;
}

export interface CourseQuiz {
  quizList: any;
  quizListLoading: boolean;
  quizListError: any;
  // createQuizLoading: boolean;
  // createQuizSuccess: boolean;
  // createQuizError: any;
  // updateQuizLoading: boolean;
  // updateQuizSuccess: boolean;
  // updateQuizError: any;
  // deleteQuizLoading: boolean;
  // deleteQuizSuccess: boolean;
  // deleteQuizError: any;
}
