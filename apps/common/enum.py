from enum import Enum


class RoleEnum(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    CSR = "CSR"
    INSTRUCTOR = "INSTRUCTOR"
    STUDENT = "STUDENT"


class AdditionalRoleEnum(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    CSR = "CSR"
    INSTRUCTOR = "INSTRUCTOR"
    STUDENT = "STUDENT"


class RoleUpdateEnum(str, Enum):
    INSTRUCTOR = "INSTRUCTOR"
    CSR = "CSR"
    STUDENT = "STUDENT"
    ADMIN = "ADMIN"


class RoleFilterEnum(str, Enum):
    INSTRUCTOR = "INSTRUCTOR"
    STUDENT = "STUDENT"
    NOT_STUDENT = "NOT_STUDENT"
    ALL = "ALL"
    CSR = "CSR"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class GenderEnum(str, Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"
    OTHER = "OTHER"


class UserSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    FIRST_NAME = "FIRST_NAME"


class UserProfileSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    FIRST_NAME = "FIRST_NAME"


class OrderEnum(str, Enum):
    ASC = "ASC"
    DESC = "DESC"


class AppointmentSortEnum(str, Enum):
    APPOINTMENT_DATE = "APPOINTMENT_DATE"
    START_TIME = "START_TIME"
    END_TIME = "END_TIME"
    CREATED_AT = "CREATED_AT"
    # UPDATED_AT = "UPDATED_AT"


class AppointmentScheduleSortEnum(str, Enum):
    LESSON_ID = "LESSON_ID"
    PACKAGE_ID = "PACKAGE_ID"
    CREATED_AT = "CREATED_AT"


class AvailabilitySortEnum(str, Enum):
    AVAILABLE_DATE = "AVAILABLE_DATE"
    AVAILABLE_DAY = "AVAILABLE_DAY"
    START_TIME = "START_TIME"
    END_TIME = "END_TIME"
    CITY_ID = "CITY_ID"
    CREATED_AT = "CREATED_AT"


class InstructorAvailabilitySortEnum(str, Enum):
    AVAILABILITY_DATE = "AVAILABILITY_DATE"
    START_TIME = "START_TIME"
    END_TIME = "END_TIME"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    INSTRUCTOR_ID = "INSTRUCTOR_ID"


class TransactionMethodEnum(str, Enum):
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    DIGITAL = "DIGITAL"
    CHEQUE = "CHEQUE"


class TransactionFilterMethodEnum(str, Enum):
    ALL = "ALL"
    CASH = "CASH"
    CREDIT_CARD = "CREDIT_CARD"
    DEBIT_CARD = "DEBIT_CARD"
    DIGITAL = "DIGITAL"
    CHEQUE = "CHEQUE"


class TransactionSortEnum(str, Enum):
    NAME = "NAME"
    DATE_CHARGED = "DATE_CHARGED"
    AMOUNT = "AMOUNT"
    DISCOUNT = "DISCOUNT"
    METHOD = "METHOD"
    LOCATION = "LOCATION"
    REFUND = "REFUND"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    TRANSACTION_ID = "TRANSACTION_ID"


class TransactionStatusEnum(str, Enum):
    PENDING = "PENDING"
    SETTLED = "SETTLED"


class PackageTypeEnum(str, Enum):
    ONLINE = "ONLINE"
    OFFLINE = "OFFLINE"


class PackageSortEnum(str, Enum):
    NAME = "NAME"
    PRICE = "PRICE"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    CATEGORY_ID = "CATEGORY_ID"


class TrainingLogsSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    USER_ID = "USER_ID"
    LESSON_ID = "LESSON_ID"
    TRAINING_ID = "TRAINING_ID"


class TrainingSortEnum(str, Enum):
    ID = "ID"
    NAME = "NAME"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class ContacTypEnum(str, Enum):
    FIRST_EMERGENCY_CONTACT = "FIRST_EMERGENCY_CONTACT"
    SECOND_EMERGENCY_CONTACT = "SECOND_EMERGENCY_CONTACT"


class LessonSortEnum(str, Enum):
    NAME = "NAME"
    DURATION = "DURATION"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    IS_ACTIVE = "IS_ACTIVE"


class SchoolSortEnum(str, Enum):
    NAME = "NAME"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class VehicleSortEnum(str, Enum):
    YEAR = "YEAR"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class CitySortEnum(str, Enum):
    NAME = "NAME"
    STATE = "STATE"
    COUNTRY = "COUNTRY"
    CITY_ABBREVIATION = "CITY_ABBREVIATION"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class GasStationSortEnum(str, Enum):
    NAME = "NAME"
    ADDRESS = "ADDRESS"
    CITY_ID = "CITY_ID"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class AppointmentStatuSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"


class InstructorNotesSortEnum(str, Enum):
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
    INSTRUCTOR_ID = "INSTRUCTOR_ID"
    STUDENT_ID = "STUDENT_ID"
    APPOINTMENT_ID = "APPOINTMENT_ID"


class UserCertificateStatusEnum(str, Enum):
    ASSIGNED = "ASSIGNED"
    NOT_ASSIGNED = "NOT_ASSIGNED"
    ISSUED = "ISSUED"
    VOID = "VOID"
    LOST = "LOST"


class CertificateTypeEnum(str, Enum):
    GOLD = "GOLD"
    PINK = "PINK"


class UserCertificateStatusFilterEnum(str, Enum):
    ASSIGNED = "ASSIGNED"
    NOT_ASSIGNED = "NOT_ASSIGNED"
    ISSUED = "ISSUED"
    VOID = "VOID"
    LOST = "LOST"
    ALL = "ALL"


class DMVCertificateSortEnum(str, Enum):
    ID = "ID"
    CERTIFICATE_NUMBER = "CERTIFICATE_NUMBER"
    IS_ASSIGNED = "IS_ASSIGNED"
    CREATED_AT = "CREATED_AT"
    BATCH_ID = "BATCH_ID"


class CouponAssignableTypeEnum(str, Enum):
    SINGLE_USER = "SINGLE"
    MULTIPLE_USER = "MULTIPLE"


class UserCertificateSortEnum(str, Enum):
    CERTIFICATE_ID = "CERTIFICATE_ID"
    USER_PROFILE_ID = "USER_PROFILE_ID"
    ISSUED_DATE = "ISSUED_DATE"
    ASSIGNED_DATE = "ASSIGNED_DATE"


class PaymentAPIsTypeEnum(str, Enum):
    TEST = "TEST"
    PRODUCTION = "PRODUCTION"


class DriverEdStatusRemarksEnum(str, Enum):
    PASS = "PASS"  # nosec
    FAIL = "FAIL"
    UNKNOWN = "UNKNOWN"


class CourseStatusRemarksEnum(str, Enum):
    PASS = "PASS"  # nosec
    FAIL = "FAIL"
    UNKNOWN = "UNKNOWN"


class DayOffSortEnum(str, Enum):
    USER_ID = "USER_ID"
    TO_ = "TO_"
    FROM_ = "FROM_"
    DAY_ = "DAY_"
    CREATED_AT = "CREATED_AT"


class CertStatusEnum(str, Enum):
    ISSUED = "ISSUED"
    NOT_ISSUED = "NOT_ISSUED"


class CertTypeEnum(str, Enum):
    GOLD = "GOLD"
    PINK = "PINK"
    BLUE = "BLUE"


class CertSortEnum(str, Enum):
    CERTIFICATE_ID = "CERTIFICATE_ID"
    USER_PROFILES_ID = "USER_PROFILES_ID"
    INSTRUCTOR_ID = "INSTRUCTOR_ID"
    STATUS = "STATUS"
    CERTIFICATE_TYPE = "CERTIFICATE_TYPE"
    ASSIGNED_DATE = "ASSIGNED_DATE"
    ISSUED_DATE = "ISSUED_DATE"


class CourseSortEnum(str, Enum):
    ID = "ID"
    CREATED_AT = "CREATED_AT"
    UPDATED_AT = "UPDATED_AT"
