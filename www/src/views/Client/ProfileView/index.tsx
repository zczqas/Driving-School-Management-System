import React, { Fragment } from "react";

// third party libraries
import {
  Avatar,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  Tooltip,
  Badge,
  IconButton,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2";

// style + assets
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";

// project imports
import SubHeader from "./components/SubHeader";
import ProfileInformation from "./components/ProfileInformation";
import TransactionsSection from "./components/Transactions";
// import ActivitiesSection from "./components/Activities";
import TrainingAndEducationSection from "./components/TrainingAndEducation";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchUserDetailsById,
  getInstructorNotesByUserId,
  updateUserLockStatus,
} from "@/store/user/user.actions";
import {
  fetchEmailLogs,
  fetchEmailLogsByUserId,
  fetchTransactionsByUserIdStart,
} from "@/store/account/account.actions";
import IRootState from "@/store/interface";
import { fetchAppointmentsByUserId } from "@/store/appointment/appointment.actions";
import Documents from "./components/Documents";
import Image from "next/image";
import InstructorNotes from "./components/InstructorNotes/InstructorNotesView";
import Certificate from "./components/Certificates";
import { getUserCertificateByUserId } from "@/store/certificate/certificate.actions";
import EmailLogs from "./components/EmailLogs";
import { resetAppointmentById } from "@/store/schedule/schedule.actions";
import GlowingBadge from "@/components/GlowingBadge";

const CustomTabLabel = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    orientation="vertical"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  marginTop: "40px",
  gap: "30px",
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-flexContainerVertical": {
    gap: "13px",
  },
});

interface StyledTabProps {
  label: any;
  icon?: any;
  iconPosition?: any;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab
    disableRipple
    {...props}
    icon={props?.icon}
    iconPosition={props?.iconPosition}
  />
))(({ theme }) => ({
  boxShadow: "rgba(17, 12, 46, 0.02) 0px 8px 16px 0px",
  mr: 2,
  background: "#fff",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#E0E2E3",
  borderRadius: "6px",
  minWidth: "100%",
  minHeight: "66px",
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    boxShadow: "rgba(17, 12, 46, 0.05) 0px 10px 20px 0px",
    // transform: "translateY(-1px)",
  },
  "&.Mui-selected": {
    borderColor: "#5E38B5",
    boxShadow: "rgba(94, 56, 181, 0.05) 0px 8px 20px 0px",
    "& > div > div": {
      border: "6px solid #5E38B5",
    },
  },
  "&.Mui-focusVisible": {},
}));

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

// ==============================|| CLIENT PROFILE VIEW ||============================== //
const ClientProfileView = () => {
  const router = useRouter();
  const currentUser = useAppSelector(
    (state: any) => state.auth?.currentUser?.user
  );
  const { id, tabValue } = router.query;

  const [value, setValue] = React.useState(
    tabValue ? parseInt(tabValue as string) : 0
  );

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    router.replace(
      `/manage/profile/${id ? id : currentUser?.id}?tabValue=${newValue}`,
      undefined,
      {
        shallow: true,
      }
    );
  };

  const {
    transactionListByUserId,
    transactionListByUserIdLoading,
    pendingTransactionListByUserId,
    pendingTransactionListByUserIdLoading,
  } = useAppSelector((state: IRootState) => state.account);
  const { appointmentByUserId, appointmentByUserIdLoading } = useAppSelector(
    (state: IRootState) => state.appointment
  );
  const {
    userDetailsById: { details: detailsById, loading: loadingById },
    userDetails: { details: detailsUser, loading: loadingUser },
  } = useAppSelector((store: IRootState) => store?.user);

  const {
    userCertificateByUserId,
    userCertificateByUserIdError,
    userCertificateByUserIdLoading,
  } = useAppSelector((store: IRootState) => store?.certificate);

  const { emailLogs, emailLogsLoading } = useAppSelector(
    (state: IRootState) => state.account
  );

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (id && !loadingById) {
      dispatch(fetchUserDetailsById(id as string));
      dispatch(fetchTransactionsByUserIdStart(id as string));
      dispatch(fetchTransactionsByUserIdStart(id as string, "PENDING"));

      // dispatch(
      //   fetchAppointmentsByUserId(detailsById?.user?.role, id as string)
      // );
      dispatch(getInstructorNotesByUserId(id as string));
      // dispatch(getUserCertificateByUserId(id as string));
    } else if (currentUser?.id) {
      dispatch(fetchUserDetailsById(currentUser?.id));
      dispatch(fetchTransactionsByUserIdStart(currentUser?.id));
      dispatch(fetchTransactionsByUserIdStart(currentUser?.id, "PENDING"));
      // dispatch(fetchAppointmentsByUserId(currentUser?.role, currentUser?.id));
      // dispatch(getUserCertificateByUserId(currentUser?.id));
      dispatch(fetchEmailLogs());
    }
  }, []);

  React.useEffect(() => {
    if (detailsById?.profile?.id) {
      dispatch(getUserCertificateByUserId(detailsById?.profile.id));
      dispatch(fetchEmailLogsByUserId(detailsById?.profile.id));
    }
  }, [detailsById]);

  React.useEffect(() => {
    console.log("userCertificateByUserId", userCertificateByUserId);
  }, [userCertificateByUserId]);

  let mainTabs = [
    {
      id: 1,
      name: "Profile Information",
      icon: "/icons/userIcon.svg",
    },
    {
      id: 2,
      name: "Transactions",
      icon: "/icons/statement.svg",
    },
    // {
    //   id: 3,
    //   name: "Activities",
    //   icon: "/icons/activity.svg",
    // },
    {
      id: 4,
      name: "DT & Ed.",
      icon: "/icons/carIcon.svg",
    },
    { id: 5, name: "Certificates", icon: "/icons/certificateIcon.svg" },
    {
      id: 6,
      name: "Instructor Notes",
      icon: "/icons/logIcon.svg",
    },
    {
      id: 7,
      name: "Documents",
      icon: "/icons/documentIcon.svg",
    },
    {
      id: 8,
      name: "Email Logs",
      icon: "/assets/icons/mailbox.svg",
    },
  ];

  const theme = useTheme();

  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  const { instructorNotesByUserId, instructorNotesByUserIdLoading } =
    useAppSelector((store) => store?.user);

  const [studentData, setStudentData] = React.useState<any>(null);

  const handleToggleLock = async () => {
    if (typeof id === "string") {
      dispatch(
        updateUserLockStatus(parseInt(id), !detailsById?.user?.is_active)
      );
    }
  };

  return (
    <Fragment>
      {/* Header Buttons for all tabs */}
      {/* {id &&
      (currentUser?.role === "CSR" ||
        currentUser?.role === "ADMIN") ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <Button
            variant="contained"
            endIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: "32px",
              color: "#fff",
            }}
            color="primary"
            onClick={() => {
              if (
                id &&
                (detailsById?.user?.role === "CSR" ||
                  detailsById?.user?.role === "ADMIN")
              ) {
                router.push("/manage/accounting/create");
              }
            }}
          >
            Add New Transaction
          </Button>
        </Box>
      ) : null} */}

      <Container maxWidth={false}>
        {/**
         * Renders different components based on the value provided.
         * If value is 0, it renders a SubHeader component with Student Details and two buttons.
         * If value is 1, it renders a SubHeader component with Transactions and two buttons.
         * If value is 2, it renders a SubHeader component with Activities and Logs and two buttons.
         * If value is not 0, 1, or 2, it renders a SubHeader component with Driver Training & Education and two buttons.
         * @param {number} value - The value to determine which components to render.
         * @returns The JSX elements based on the value provided.
         */}
        {value == 0 ? (
          <SubHeader title={""} subTitle={""}>
            {/* <Button
              variant="contained"
              endIcon={<AddRoundedIcon />}
              sx={{
                backgroundColor: "#C4C4C4",
                borderRadius: "32px",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#C4C4C4",
                },
                marginRight: 2,
              }}
            >
              Resend New Password
            </Button>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#1E293B",
                color: "#fff",
                borderRadius: "32px",
                "&:hover": {
                  backgroundColor: "#1E293B",
                },
              }}
            >
              Print Record
            </Button> */}
            {""}
          </SubHeader>
        ) : value == 1 ? (
          <SubHeader title={""} subTitle={""}>
            {/* <Button
              variant="contained"
              startIcon={<img src="/assets/icons/downloadAltIcon.svg" />}
              disabled
              sx={{
                backgroundColor: theme.palette.common.black,
                borderRadius: "32px",
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: theme.palette.common.black,
                },
                marginRight: 2,
              }}
            >
              Download
            </Button> */}
            {id &&
            (currentUser?.role === "CSR" || currentUser?.role === "ADMIN") ? (
              <Button
                variant="contained"
                endIcon={<AddRoundedIcon />}
                sx={{
                  borderRadius: "32px",
                  color: "#fff",
                }}
                color="primary"
                onClick={() => {
                  if (
                    id &&
                    (currentUser?.role === "CSR" ||
                      currentUser?.role === "ADMIN")
                  ) {
                    router.push(
                      `/manage/accounting/create/?student_id=${id}&first_name=${detailsById?.user?.first_name}&last_name=${detailsById?.user?.last_name}&fallbackUrl=${router.asPath}`
                    );
                  }
                }}
              >
                Add New Student Transaction
              </Button>
            ) : null}
            {""}
          </SubHeader>
        ) : value == 2 ? (
          <SubHeader title={""} subTitle={""}>
            {/* <Button
              variant="contained"
              startIcon={<img src="/assets/icons/downloadAltIcon.svg" />}
              disabled
              sx={{
                backgroundColor: theme.palette.common.black,
                borderRadius: "32px",
                color: theme.palette.common.white,
                "&:hover": {
                  backgroundColor: theme.palette.common.black,
                },
                marginRight: 2,
              }}
            >
              Download
            </Button> */}
            {id && (
              <Tooltip
                title={
                  !detailsById?.user?.is_active
                    ? "User is locked. Please clear payment dues to proceed"
                    : ""
                }
                arrow
              >
                <span>
                  <Button
                    variant="contained"
                    endIcon={<AddRoundedIcon />}
                    sx={{
                      borderRadius: "32px",
                      color: "#fff",
                    }}
                    color="primary"
                    disabled={!detailsById?.user?.is_active}
                    onClick={() => {
                      // if (
                      //   id &&
                      //   (currentUser?.role === "CSR" ||
                      //     currentUser?.role === "ADMIN")
                      // ) {
                      // router.push(
                      //   `/manage/driver-training-and-education/create/?student_id=${id}&first_name=${detailsById?.user?.first_name}&last_name=${detailsById?.user?.last_name}&phone=${detailsById?.user?.phone}&email=${detailsById?.user?.email}&fallbackUrl=${router.asPath}`
                      // );
                      dispatch(
                        resetAppointmentById(() => {
                          router.push(
                            `/manage/schedule-lessons?student_id=${id}&first_name=${detailsById?.user?.first_name}&last_name=${detailsById?.user?.last_name}`
                          );
                        })
                      );
                      // }
                    }}
                  >
                    Add New Appointment
                  </Button>
                </span>
              </Tooltip>
            )}
          </SubHeader>
        ) : (
          <SubHeader title={""} subTitle={""}>
            <Fragment>
              {/* <Button
                variant="contained"
                endIcon={<AddRoundedIcon />}
                sx={{
                  backgroundColor: "#C4C4C4",
                  borderRadius: "32px",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#C4C4C4",
                  },
                  marginRight: 2,
                }}
              >
                Resend New Password
              </Button>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#1E293B",
                  color: "#fff",
                  borderRadius: "32px",
                  "&:hover": {
                    backgroundColor: "#1E293B",
                  },
                }}
              >
                Print Record
              </Button> */}
              {""}
            </Fragment>
          </SubHeader>
        )}

        <Grid container columnSpacing={4}>
          <Grid sm={3} xl={2.5}>
            {/* User Profile Card */}
            <Box
              sx={{
                padding: "22px 18px",
                backgroundColor: "primary.light",
                borderRadius: "10px",
                boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"flex-start"}
              >
                {!loadingById && !loadingUser ? (
                  <Tooltip
                    title={
                      (
                        id
                          ? detailsById?.user?.is_verified
                          : currentUser?.is_verified
                      )
                        ? "Verified"
                        : "Unverified"
                    }
                  >
                    <Avatar
                      sx={{
                        height: "72px",
                        width: "72px",
                        textTransform: "uppercase",
                        backgroundColor: "hsla(21, 89%, 58%, 1)",
                      }}
                    >
                      {id
                        ? ` ${detailsById?.user?.first_name?.slice(
                            0,
                            1
                          )} ${detailsById?.user?.last_name?.slice(0, 1)} `
                        : currentUser?.first_name?.slice(0, 1) +
                          " " +
                          currentUser?.last_name?.slice(0, 1)}
                    </Avatar>
                  </Tooltip>
                ) : (
                  <Box>
                    <Skeleton variant="circular" width={72} height={72} />
                  </Box>
                )}

                {!loadingById && !loadingUser ? (
                  <Box>
                    <Typography
                      variant="h3"
                      sx={{
                        fontSize: "20px",
                        color: "#1E293B",
                        letterSpacing: "-0.5px",
                        lineHeight: "32px",
                        paddingTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {id
                        ? `${detailsById?.user?.first_name} ${detailsById?.user?.last_name}`
                        : `${currentUser?.first_name} ${currentUser?.last_name}`}
                      <Tooltip
                        title={
                          (
                            id
                              ? detailsById?.user?.is_verified
                              : currentUser?.is_verified
                          )
                            ? "Verified"
                            : "Unverified"
                        }
                      >
                        <Badge
                          sx={{ ml: 2 }}
                          badgeContent={
                            (
                              id
                                ? detailsById?.user?.is_verified
                                : currentUser?.is_verified
                            ) ? (
                              <CheckCircleRoundedIcon color="success" />
                            ) : (
                              <CancelRoundedIcon color="error" />
                            )
                          }
                        />
                      </Tooltip>
                      {(currentUser?.role === "CSR" ||
                        currentUser?.role === "ADMIN") &&
                        id && (
                          <Tooltip
                            title={
                              !detailsById?.user?.is_active
                                ? "Unlock User"
                                : "Lock User"
                            }
                          >
                            <IconButton
                              onClick={handleToggleLock}
                              size="small"
                              sx={{ ml: 1 }}
                            >
                              {!detailsById?.user?.is_active ? (
                                <LockIcon color="error" />
                              ) : (
                                <LockOpenIcon color="success" />
                              )}
                            </IconButton>
                          </Tooltip>
                        )}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: "#7E84A3",
                        fontSize: "10px",
                        lineHeight: "22px",
                        fontWeight: 500,
                      }}
                    >
                      {detailsById?.user?.driving_school
                        ? detailsById?.user?.driving_school[0]?.name
                        : null}
                    </Typography>
                  </Box>
                ) : (
                  <Box sx={{ width: "100%" }}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "18px", paddingTop: "10px" }}
                    />

                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "10px", paddingTop: "10px" }}
                    />
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Profile Tabs */}
            <StyledTabs
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderColor: "divider" }}
            >
              {mainTabs.map((tab, index) => {
                if (
                  tab.id === 2 &&
                  (currentUser?.role === "INSTRUCTOR" ||
                    detailsById?.user?.role === "INSTRUCTOR")
                )
                  return null;
                return (
                  <StyledTab
                    key={tab.id}
                    icon={
                      <Image
                        src={tab?.icon}
                        alt={tab.name}
                        width={30}
                        height={30}
                      />
                    }
                    iconPosition="start"
                    label={
                      <CustomTabLabel>
                        <GlowingBadge
                          badgeContent={
                            pendingTransactionListByUserId?.transactions
                              ?.length || 0
                          }
                          invisible={
                            !pendingTransactionListByUserId?.transactions
                              ?.length || tab.id !== 2
                          }
                        >
                          {" "}
                          <span style={{ marginRight: "14px" }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontSize: "14px",
                                color: "#45464E",
                                textAlign: "left",
                              }}
                            >
                              {tab.name}
                            </Typography>
                          </span>
                        </GlowingBadge>

                        <Box
                          sx={{
                            height: "20px",
                            width: "20px",
                            borderRadius: "50%",
                            border: "2px solid #E0E2E3",
                          }}
                        />
                      </CustomTabLabel>
                    }
                    {...a11yProps(index)}
                  />
                );
              })}
            </StyledTabs>
          </Grid>
          <Grid
            sm={9}
            xl={9.5}
            sx={{
              paddingY: theme.spacing(2),
              backgroundColor: value == 0 ? "primary.light" : "transparent",
            }}
          >
            <TabPanel value={value} index={0}>
              <ProfileInformation
                userRole={capitalizeFirstLetter(
                  detailsById?.user?.role ?? currentUser?.role
                )}
              />
            </TabPanel>

            {currentUser?.role === "INSTRUCTOR" ? null : (
              <TabPanel value={value} index={1}>
                <TransactionsSection
                  drivingSchoolName={
                    detailsById?.user?.driving_school
                      ? detailsById?.user?.driving_school[0]?.name
                      : null
                  }
                  transactionListByUserId={transactionListByUserId}
                  transactionListByUserIdLoading={
                    transactionListByUserIdLoading
                  }
                  pendingTransactionListByUserId={
                    pendingTransactionListByUserId
                  }
                  pendingTransactionListByUserIdLoading={
                    pendingTransactionListByUserIdLoading
                  }
                />
              </TabPanel>
            )}
            {/* <TabPanel value={value} index={2}>
              <ActivitiesSection />
            </TabPanel> */}
            <TabPanel
              value={value}
              index={currentUser?.role === "INSTRUCTOR" ? 1 : 2}
            >
              <TrainingAndEducationSection
                filteredDriverTrainingData={
                  appointmentByUserId?.appointments ?? []
                }
                driverTrainingDataLoading={false}
                userId={id}
                drivingSchoolName={
                  detailsById?.user?.driving_school
                    ? detailsById?.user?.driving_school[0]?.name
                    : null
                }
              />
            </TabPanel>
            <TabPanel
              value={value}
              index={currentUser?.role === "INSTRUCTOR" ? 2 : 3}
            >
              <Certificate
                userCertificateByUserId={userCertificateByUserId}
                userCertificateByUserIdLoading={userCertificateByUserIdLoading}
                drivingSchoolName={
                  detailsById?.user?.driving_school
                    ? detailsById?.user?.driving_school[0]?.name
                    : null
                }
              />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <InstructorNotes
                instructorNotesByUserId={instructorNotesByUserId}
                instructorNotesByUserIdLoading={instructorNotesByUserIdLoading}
              />
            </TabPanel>
            {/* index = array index of tab..so if there are 4 items in array, so for doucment it is length of array -1 which is 3 */}
            {/*not to be confused withthe id of tab in the array...here we need the index of tab item not the id inside each tab*/}
            <TabPanel value={value} index={5}>
              {/* //based on whether it is a profile of a particualr user /profiel/:id or the logged in person  */}
              {/* //is viewing their own profile /profile/ we have to show differnt daata */}
              <Documents
                documentsData={
                  id
                    ? detailsById?.profile?.document_url
                    : detailsUser?.profile?.document_url
                }
              />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <EmailLogs
                emailLogs={emailLogs?.email_logs || []}
                emailLogsLoading={emailLogsLoading}
              />
            </TabPanel>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default ClientProfileView;
