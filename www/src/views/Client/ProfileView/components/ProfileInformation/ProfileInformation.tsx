import * as React from "react";

// third party libraries
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {
  Backdrop,
  Button,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  FormLabel,
} from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";
import { ConnectedFocusError } from "focus-formik-error";

// style + assets
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveAltRoundedIcon from "@mui/icons-material/SaveAltRounded";
import { alpha, styled, useTheme } from "@mui/material/styles";

// project imports
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchUserDetails,
  fetchUserDetailsById,
  updateUserDetails,
} from "@/store/user/user.actions";
import EditCertificateForm from "./components/Certificate/EditCertificateForm";
import ContactInformation from "./components/ContactInformation/ContactInformation";
import EditContactInformationForm from "./components/ContactInformation/EditContactInformationForm";
import PermitInfo from "./components/PermitInfo/PermitInfo";
import EditPermitInfoForm from "./components/PermitInfo/EditPermitInfoForm";
import PickUpLocation from "./components/PickupLocation/PickupLocation";
import EditPickUpLocationForm from "./components/PickupLocation/EditPickUpLocationForm";
import StudentInformation from "./components/StudentInformation/StudentInformation";
import EditStudentInformationForm from "./components/StudentInformation/EditStudentInformationForm";
import { openAlert } from "@/store/alert/alert.actions";
import { useRouter } from "next/router";
import { forEach } from "lodash";
import { loadUser } from "@/store/auth/auth.actions";
import IRootState from "@/store/interface";

// custom styles
export const InputFormLabel = styled(FormLabel)(({ theme }) => ({
  fontWeight: 500,
  fontSize: "16px",
  lineHeight: "16px",
  color: "#4F5B67",
  fontFamily: theme.typography.button.fontFamily,
  marginBottom: theme.spacing(2),
}));

export const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    borderRadius: "32px",
    "&.Mui-focused fieldset": {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
    "& > input": {
      "&:-webkit-autofill": {
        WebkitBoxShadow: "0 0 0 100px #fff inset",
        WebkitTextFillColor: "#212121",
      },
    },
  },
}));

export const PageSection = styled("section")(({ theme }) => ({
  padding: "30px 0",
  "& > h4": {
    color: theme.palette.common.black,
    lineHeight: "32.5px",
    marginBottom: theme.spacing(4),
  },
}));

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// ==============================|| PROFILE INFORMATION VIEW ||============================== //
const ProfileInformation = ({ userRole = "Student" }) => {
  const [value, setValue] = React.useState(0);
  const [editMode, setEditMode] = React.useState(false);
  const [changesMade, setChangesMade] = React.useState(false);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const permitNumberRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { id, isEdit, permitMissing } = router.query;

  const dispatch = useAppDispatch();
  const {
    userDetails: { details, loading },
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);

  const { user } = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser
  );

  React.useEffect(() => {
    if (!id) {
      dispatch(fetchUserDetails());
    } else {
      dispatch(fetchUserDetailsById(id as string));
    }
  }, [dispatch, id]);

  React.useEffect(() => {
    if (isEdit === "true" && !editMode && detailsById) {
      setEditMode(true);
    }
  }, [isEdit, editMode, detailsById]);

  React.useEffect(() => {
    if (permitMissing === "true" && editMode) {
      setTimeout(() => {
        if (permitNumberRef.current) {
          permitNumberRef.current.focus();
          permitNumberRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        } else {
          setValue(3);
          scrollToSection(3); // Index for Permit Info section
        }
      }, 500);
    }
  }, [permitMissing, editMode]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    scrollToSection(newValue);
  };

  const tabLists = [
    `${userRole} Information`,
    "Emergency Contact Information",
    "Pickup Location",
    "Permit Info",
    // "Certificate",
  ];

  const scrollToSection = (index: number) => {
    const sectionId = `#field${index + 1}`;
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const theme = useTheme();

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const handleScroll = () => {
      const sections = Array.from(
        container.querySelectorAll('section[id^="field"]')
      );

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        let offset = 50;
        if (index === 4) {
          offset = 300;
        }

        // Check if section is in view
        if (rect.top >= 0 && rect.bottom <= container.clientHeight + offset) {
          console.log({
            rect,
            index,
            ch: container.clientHeight,
          });
          setValue(index);
        }
      });
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const phoneRegExp = /^\d{3}-\d{3}-\d{4}$/;

  console.log({ detailsById });

  return (
    <React.Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={id ? loadingById : loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loading && !loadingById && (
        <Formik
          initialValues={{
            firstName: id
              ? detailsById?.user?.first_name
              : details?.user?.first_name ?? "",
            lastName: id
              ? detailsById?.user?.last_name
              : details?.user?.last_name ?? "",
            email: id ? detailsById?.user?.email : details?.user?.email ?? "",
            notes: id
              ? detailsById?.profile?.office_note
              : details?.profile?.office_note ?? "",
            address: id
              ? detailsById?.profile?.address
              : details?.profile?.address ?? "",
            unit: id
              ? detailsById?.profile?.apartment
              : details?.profile?.apartment ?? "",
            city: id
              ? detailsById?.profile?.city
              : details?.profile?.city ?? "",
            state: id
              ? detailsById?.profile?.state
              : details?.profile?.state ?? "",
            zip: id
              ? detailsById?.profile?.zip_code
              : details?.profile?.zip_code ?? null,
            phone: id
              ? detailsById?.profile?.cell_phone
              : details?.profile?.cell_phone ?? "",
            gender: id
              ? detailsById?.profile?.gender
              : details?.profile?.gender ?? "",
            birthDate: id
              ? detailsById?.profile?.dob
              : details?.profile?.dob ?? "",
            school: id
              ? detailsById?.user?.school
              : details?.user?.school ?? "",
            receiveCertificate: id ? detailsById?.profile?.recieved : "",
            contactName: "",
            contactRelation: "",
            contactEmail: "",
            contactPhone: "",
            secondContactName: "",
            secondContactRelation: "",
            secondContactEmail: "",
            secondContactPhone: "",
            pickUpLocationName: id
              ? detailsById?.profile?.pickup_location[0]?.name
              : "",
            pickUpLocationAddress: id
              ? detailsById?.profile?.pickup_location[0]?.address
              : "",
            pickUpLocationUnit: id
              ? detailsById?.profile?.pickup_location[0]?.apartment
              : "",
            pickUpLocationCity: id
              ? detailsById?.profile?.pickup_location[0]?.city
              : "",
            permitNumber: id
              ? detailsById?.user?.permit_information[0]?.permit_number ?? ""
              : null,
            permitDateIssued: id
              ? detailsById?.user?.permit_information[0]?.permit_issue_date ??
                null
              : null,
            permitExpDate: id
              ? detailsById?.user?.permit_information[0]
                  ?.permit_expiration_date ?? null
              : null,
            permitEndorsedBy: id
              ? detailsById?.user?.permit_information[0]?.permit_endorse_by ??
                null
              : null,
            permitEndorsedDate: id
              ? detailsById?.user?.permit_information[0]?.permit_endorse_date ??
                null
              : null,
            pinkCertNum: "",
            pinkCertDate: "",
            pinkCertInst: "",
            pinkCertEndorDate: "",
            goldCertNum: "",
            goldCertDate: "",
            goldCertInst: "",
            goldCertEndorDate: "",
          }}
          validationSchema={Yup.object().shape({
            firstName: Yup.string().required("First Name is required"),
            lastName: Yup.string().required("Last Name is required"),

            address: Yup.string().required("Address is required"),
            gender: Yup.string().required("Gender is required"),
            birthDate: Yup.date().required("Birth Date is required"),
            zip: Yup.number().required("Zip Code is required"),
            school: Yup.object().required("School is required"),
            phone: Yup.string()
              .required("Phone number is required")
              .matches(phoneRegExp, "Phone number must be exactly 10 digits"),

            // Pickup Location validations
            pickUpLocationName: Yup.string().required(
              "Pickup Location Name is required"
            ),
            pickUpLocationAddress: Yup.string().required(
              "Pickup Location Address is required"
            ),
            pickUpLocationCity: Yup.string().required(
              "Pickup Location City is required"
            ),
            // pickUpLocationUnit: Yup.string().required(
            //   "Pickup apartment is required"
            // ),

            // 1st Emergency Contact validations
            contactName: Yup.string().required("Contact Name is required"),
            contactRelation: Yup.string().required(
              "Contact Relation is required"
            ),
            contactEmail: Yup.string()
              // .required()
              .email("Invalid email address"),
            contactPhone: Yup.string()
              .required("Phone Number is required")
              .matches(phoneRegExp, "Phone number must be exactly 10 digits"),

            // // 2nd Emergency Contact validations
            secondContactName: Yup.string(),
            secondContactRelation: Yup.string(),
            secondContactEmail: Yup.string().email("Invalid email address"),
            secondContactPhone: Yup.string().matches(
              phoneRegExp,
              "Phone number must be exactly 10 digits"
            ),

            // Permit validations
            // permitNumber: Yup.string().required("Permit Number is required"),
            // permitDateIssued: Yup.date().required(
            //   "Permit Issue Date is required"
            // ),
            // permitExpDate: Yup.date()
            //   .required("Permit Expiration Date is required")
            //   .min(
            //     Yup.ref("permitDateIssued"),
            //     "Expiration date must be after the issue date"
            //   ),
            permitEndorsedBy: Yup.object().nullable(),

            // permitEndorsedDate: Yup.date()
            // .required("Permit Endorsement Date is required")
            // .min(
            //   Yup.ref("permitDateIssued"),
            //   "Endorsement date must be after the issue date"
            // )
            // .max(
            //   Yup.ref("permitExpDate"),
            //   "Endorsement date must be before the expiration date"
            // )
            // .nullable(),
          })}
          // enableReinitialize
          onSubmit={async (
            values,
            { setErrors, setStatus, setSubmitting, setFieldValue }
          ) => {
            let formData = {
              ...values,
              cell_phone: values?.phone as string,
              permit_number:
                values?.permitNumber === ""
                  ? null
                  : values?.permitNumber ?? null,
              permit_issue_date: values?.permitDateIssued ?? null,
              permit_expiration_date: values?.permitExpDate ?? null,
              // permit_endorse_date: values?.permitEndorsedDate,
              permit_endorse_date: null,
              permit_endorse_by_id: values?.permitEndorsedBy?.id,
            };
            if (values?.permitEndorsedDate && values?.permitEndorsedBy?.id) {
              formData = {
                ...formData,
                permit_endorse_date: values.permitEndorsedDate,
              };
            }

            // const formData = Object.fromEntries(
            //   Object.entries(values).filter(([_, value]) =>
            //   value !== "")
            // );

            delete formData?.phone;

            console.log({ formData });

            try {
              if (changesMade) {
                if (id) {
                  dispatch(
                    updateUserDetails(
                      { ...formData },
                      () => {
                        setEditMode(false);
                        dispatch(loadUser());
                        if (isEdit === "true") {
                          router.replace("/manage/profile/" + id, undefined, {
                            shallow: true,
                          });
                        } else if (
                          user?.role === "STUDENT" &&
                          user?.package?.length === 0
                        ) {
                          router.replace(
                            "/manage/accounting/create",
                            undefined,
                            {
                              shallow: true,
                            }
                          );
                        }
                      },
                      id,
                      () => {}
                    )
                  );
                } else {
                  dispatch(
                    updateUserDetails({ ...formData }, () => {
                      setEditMode(false);
                      dispatch(loadUser());
                      if (isEdit === "true") {
                        router.replace("/manage/profile/", undefined, {
                          shallow: true,
                        });
                      }
                    })
                  );
                }
              } else {
                dispatch(openAlert("No any changes made to save", "error"));
                setEditMode(false);
              }
            } catch (err) {
              setStatus({ success: false });
              setSubmitting(false);
            }
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue,
            dirty,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              console.log({ errors });
            }, [errors]);
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              setChangesMade(dirty);
            }, [dirty]);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (detailsById?.profile?.contact_information?.length > 0) {
                forEach(
                  detailsById?.profile?.contact_information,
                  (contact, index) => {
                    if (contact.contact_type === "FIRST_EMERGENCY_CONTACT") {
                      setFieldValue(`contactName`, contact.contact_name);
                      setFieldValue(
                        `contactRelation`,
                        contact.contact_relationship
                      );
                      setFieldValue(`contactEmail`, contact.contact_email);
                      setFieldValue(`contactPhone`, contact.contact_phone);
                    } else if (
                      contact.contact_type === "SECOND_EMERGENCY_CONTACT"
                    ) {
                      setFieldValue(`secondContactName`, contact.contact_name);
                      setFieldValue(
                        `secondContactRelation`,
                        contact.contact_relationship
                      );
                      setFieldValue(
                        `secondContactEmail`,
                        contact.contact_email
                      );
                      setFieldValue(
                        `secondContactPhone`,
                        contact.contact_phone
                      );
                    }
                  }
                );
              }
            }, [detailsById]);
            return (
              <React.Fragment>
                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  spacing={4}
                >
                  <Box
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Tabs
                      value={value}
                      aria-label="user-details-tabs"
                      onChange={handleTabChange}
                      variant="scrollable"
                      scrollButtons="auto"
                      sx={{
                        "& .MuiTab-root": {
                          fontSize: "16px",
                          lineHeight: "26px",
                          fontWeight: 600,
                          color: theme.palette.common.black,
                        },
                        "& .MuiTab-root.Mui-selected": {
                          color: "#F37736",
                        },
                      }}
                      TabIndicatorProps={{
                        sx: {
                          backgroundColor: "#F37736",
                        },
                      }}
                    >
                      {tabLists.map((tab, index) => (
                        <Tab label={tab} {...a11yProps(index)} key={index} />
                      ))}
                    </Tabs>
                  </Box>

                  <Box>
                    <Button
                      variant="contained"
                      endIcon={
                        !editMode ? <EditRoundedIcon /> : <SaveAltRoundedIcon />
                      }
                      sx={{
                        borderRadius: "32px",
                        width: "118px",
                        backgroundColor: editMode
                          ? "primary.dark"
                          : "success.dark",
                        "&:hover": {
                          backgroundColor: editMode
                            ? "primary.dark"
                            : "success.dark",
                        },
                      }}
                      onClick={() => {
                        if (editMode) {
                          handleSubmit();
                        } else {
                          setEditMode(true);
                        }
                      }}
                    >
                      {editMode ? "Save Info" : "Edit Info"}
                    </Button>
                  </Box>
                </Stack>
                <form noValidate onSubmit={handleSubmit}>
                  <ConnectedFocusError />
                  <Box
                    sx={{
                      height: "calc(100vh - 300px)",
                      overflowY: "auto",
                      paddingX: 2,
                      mt: 2,
                    }}
                    ref={containerRef}
                  >
                    {editMode ? (
                      <EditStudentInformationForm
                        touched={touched}
                        errors={errors}
                        values={values}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        editMode={editMode}
                      />
                    ) : (
                      <StudentInformation values={values} userRole={userRole} />
                    )}

                    <Divider />

                    {editMode ? (
                      <EditContactInformationForm
                        touched={touched}
                        errors={errors}
                        values={values}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        editMode={editMode}
                        setFieldValue={setFieldValue}
                      />
                    ) : (
                      <ContactInformation values={values} />
                    )}
                    <Divider />
                    {editMode ? (
                      <EditPickUpLocationForm
                        touched={touched}
                        errors={errors}
                        values={values}
                        setFieldValue={setFieldValue}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        editMode={editMode}
                      />
                    ) : (
                      <PickUpLocation values={values} />
                    )}

                    <Divider />
                    {editMode ? (
                      <EditPermitInfoForm
                        touched={touched}
                        errors={errors}
                        values={values}
                        handleChange={handleChange}
                        setFieldValue={setFieldValue}
                        handleBlur={handleBlur}
                        editMode={editMode}
                        permitNumberRef={permitNumberRef}
                        newAccount={
                          !detailsById?.user?.permit_information[0]
                            ?.permit_number
                        }
                      />
                    ) : (
                      <PermitInfo values={values} />
                    )}
                    <Divider />
                    {/* ======= New Certificate Table for Student ========== */}

                    {/* {editMode ? (
                      <EditCertificateForm
                        touched={touched}
                        errors={errors}
                        values={values}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        editMode={editMode}
                      />
                    ) : (
                      <Certificate values={values} />
                    )} */}
                  </Box>
                </form>
              </React.Fragment>
            );
          }}
        </Formik>
      )}
    </React.Fragment>
  );
};

export default ProfileInformation;
