import React, { Fragment, useState } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import { fetchUserDetailsById, fetchUsers } from "@/store/user/user.actions";
import { useDispatch, useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import AppointmentManagement from "./components/AppointmentManagement";
import { useParams } from "next/navigation";
import {
  deleteAppointment,
  fetchAppointmentById,
  fetchAppointmentsByUserId,
} from "@/store/appointment/appointment.actions";
import CustomDialog from "@/components/CustomDialog";

// ==============================|| Instructor Appointment VIEW ||============================== //
const InstructorAppointmentView = () => {
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const [deleteAppointmentId, setDeleteAppointmentId] = React.useState<
    number | null
  >(null);

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  const dispatch = useAppDispatch<any>();

  const { id: currentUserId } = useParams();

  const { user } = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser
  );

  const { query } = useRouter();
  const { name } = query;

  React.useEffect(() => {
    if (currentUserId) {
      dispatch(
        fetchAppointmentsByUserId("INSTRUCTOR", currentUserId as string)
      );
    } else if (user?.role === "INSTRUCTOR") {
      console.log("Its instructor");
      // If current user is instructor then fetch appointments by current user id
      dispatch(fetchAppointmentsByUserId("INSTRUCTOR", user?.id as string));
    }
  }, [user, currentUserId]);

  const { appointmentByUserId, appointmentByUserIdLoading } = useAppSelector(
    (state: IRootState) => state.appointment
  );

  function handleAppointmentDelete(appointmentId: number) {
    setDeleteAppointmentId(appointmentId);
    setDeleteDialog(true);
  }

  interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: number;
    value: number;
  }

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const [tabs, setTabs] = useState([
    {
      id: 1,
      title: "Appointment Management",
      subTitle: "",
    },
  ]);

  React.useEffect(() => {
    if (user?.role === "INSTRUCTOR") {
      setTabs([
        {
          id: 1,
          title: "Your Schedule ",
          subTitle: "",
        },
      ]);
    }
  }, [user]);

  const [tabValue, setTabValue] = React.useState(0);
  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={appointmentByUserIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog for delete Appointment====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteAppointmentId) {
            dispatch(
              deleteAppointment(deleteAppointmentId, () => {
                dispatch(
                  fetchAppointmentsByUserId(
                    "INSTRUCTOR",
                    user?.role === "INSTRUCTOR"
                      ? (user?.id as string)
                      : (currentUserId as string)
                  )
                );
                setDeleteDialog(false);
                setDeleteAppointmentId(null);
              })
            );
          }
        }}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteAppointmentId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Appointment"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this Appointment?</h4>
        </Box>
      </CustomDialog>
      <SubHeader
        title={tabs[tabValue].title}
        subTitle={tabs[tabValue].subTitle}
        tabValue={tabValue}
        handleChange={(event, newValue) => setTabValue(Number(newValue))}
        tabs={tabs}
      />
      <Container maxWidth={false}>
        <Box
          sx={{
            py: 3,
          }}
        >
          <TabPanel value={tabValue} index={0}>
            <AppointmentManagement
              appointmentByUserId={appointmentByUserId}
              currentUserName={
                user?.role === "INSTRUCTOR"
                  ? user?.first_name
                  : (name as string)
              }
              handleAppointmentDelete={handleAppointmentDelete}
            />
          </TabPanel>
        </Box>
      </Container>
    </Fragment>
  );
};

export default InstructorAppointmentView;
