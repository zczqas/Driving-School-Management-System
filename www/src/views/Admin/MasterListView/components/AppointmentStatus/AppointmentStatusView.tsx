import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import AppointmentStatusTable from "./components/AppointmentStatusTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createAppointmentStatus,
  deleteAppointmentStatus,
  fetchAppointmentStatusById,
  fetchAppointmentStatus,
  updateAppointmentStatus,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const AppointmentStatusView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchAppointmentStatus(0, 25));
    console.log("FETCHING APPOINTMNETS");
  }, [dispatch]);

  const {
    appointmentStatusList,
    appointmentStatusById,
    appointmentStatusListLoading,
  } = useAppSelector(
    (state: IRootState) => state?.masterlist?.appointmentStatus
  );

  const [deleteId, setDeleteId] = useState<any>();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState(false);

  function handleDelete(id: any) {
    setDeleteId(id);
    setDeleteDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    dispatch(fetchAppointmentStatus(0, 25));
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    dispatch(fetchAppointmentStatus(0, 25));
  }

  function editAppointmentStatus(id: any) {
    dispatch(fetchAppointmentStatusById(id));
  }

  useEffect(() => {
    if (appointmentStatusById?.id) {
      setOpenDialog(true);
    }
  }, [appointmentStatusById]);

  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={appointmentStatusListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteAppointmentStatus(deleteId, () => {
                dispatch(fetchAppointmentStatus(0, 25));
                dispatch(
                  openAlert("AppointmentStatus deleted successfully", "success")
                );
                setDeleteDialog(false);
                setDeleteId(null);
              })
            );
          }
        }}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Appointment Status"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this Appointment Status?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${
          appointmentStatusById?.id ? "Edit" : "Add"
        } Appointment Status`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            name: appointmentStatusById?.name || "",
            description: appointmentStatusById?.description || "",
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            if (appointmentStatusById?.id) {
              if (changesMade) {
                dispatch(
                  updateAppointmentStatus(
                    appointmentStatusById.id,
                    values,
                    () => {
                      handleCloseDialog();
                    }
                  )
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createAppointmentStatus(values, () => {
                  dispatch(fetchAppointmentStatus(0, 25));
                  handleCloseDialog();
                })
              );
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
            setFieldValue,
            dirty,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (dirty) {
                setChangesMade(true);
              }
            }, [dirty]);
            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.name && errors.name)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"name"}>
                          Name:
                        </CustomLabel>
                        <CustomInput
                          id={"name"}
                          type={"text"}
                          value={values.name}
                          name={"name"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Name "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"description"}>
                          Description:
                        </CustomLabel>
                        <CustomInput
                          id={"description"}
                          type={"text"}
                          value={values.description}
                          name={"description"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Description "
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                      mr: 2,
                    }}
                    onClick={() => handleCloseDialog()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                    }}
                    type="submit"
                  >
                    {appointmentStatusById?.id ? "Edit" : "Add"}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>
      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          {" "}
          <Button
            variant="contained"
            sx={{
              borderRadius: "32px",
            }}
            endIcon={<AddRoundedIcon />}
            onClick={() => {
              setOpenDialog(true);
            }}
          >
            Add New Appointment Status
          </Button>
        </Box>
        <AppointmentStatusTable
          appointmentStatusData={appointmentStatusList?.appointment_schedule_status}
          editAppointmentStatus={editAppointmentStatus}
          deleteAppointmentStatus={handleDelete}
        />
      </Box>
    </Fragment>
  );
};

export default AppointmentStatusView;
