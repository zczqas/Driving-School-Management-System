import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import VehicleTable from "./components/VehicleTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createVehicle,
  deleteVehicle,
  fetchVehicleById,
  fetchVehicles,
  updateVehicle,
  updateVehicleStatus,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const VehicleView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchVehicles(0, 25));
  }, [dispatch]);

  const { vehicleList, vehicleById, vehicleListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.vehicle
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
    dispatch(fetchVehicles(0, 25));
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    dispatch(fetchVehicles(0, 25));
  }

  function editVehicle(id: any) {
    dispatch(fetchVehicleById(id));
  }

  function changeVehicleStatus(id: number, status: boolean) {
    dispatch(
      updateVehicleStatus(id, !status, () => {
        dispatch(fetchVehicles(0, 25));
      })
    );
  }

  useEffect(() => {
    if (vehicleById?.id) {
      setOpenDialog(true);
    }
  }, [vehicleById]);

  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={vehicleListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteVehicle(deleteId, () => {
                dispatch(fetchVehicles(0, 25));
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
        dialogTitle="Delete Vehicle"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this Vehicle?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${vehicleById?.id ? "Edit" : "Add"} Vehicle`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            plate_number: vehicleById?.plate_number ?? "",
            color: vehicleById?.color ?? "",
            brand: vehicleById?.brand ?? "",
            model: vehicleById?.model ?? "",
            year: vehicleById?.year ?? null,
            is_available: true,
            odometer: vehicleById?.odometer ?? null,
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const fieldValue = { ...values, year: values.year.toString() };
            if (vehicleById?.id) {
              if (changesMade) {
                dispatch(
                  updateVehicle(vehicleById.id, fieldValue, () => {
                    handleCloseDialog();
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createVehicle(fieldValue, () => {
                  dispatch(fetchVehicles(0, 25));
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
                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.brand && errors.brand)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"brand"}>
                          Brand:
                        </CustomLabel>
                        <CustomInput
                          id={"brand"}
                          type={"text"}
                          value={values.brand}
                          name={"brand"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Brand"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.model && errors.model)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"model"}>
                          Model:
                        </CustomLabel>
                        <CustomInput
                          id={"model"}
                          type={"text"}
                          value={values.model}
                          name={"model"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter model "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.year && errors.year)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"year"}>
                          Year:
                        </CustomLabel>
                        <CustomInput
                          id={"year"}
                          type={"text"}
                          value={values.year}
                          name={"year"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter year "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.color && errors.color)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"color"}>
                          Color:
                        </CustomLabel>
                        <CustomInput
                          id={"color"}
                          type={"text"}
                          value={values.color}
                          name={"color"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter color "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.plate_number && errors.plate_number
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"plate_number"}>
                          Plate Number:
                        </CustomLabel>
                        <CustomInput
                          id={"plate_number"}
                          type={"text"}
                          value={values.plate_number}
                          name={"plate_number"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter plate_number "
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.odometer && errors.odometer)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"odometer"}>
                          Odometer (Miles):
                        </CustomLabel>
                        <CustomInput
                          id={"odometer"}
                          type={"number"}
                          value={values.odometer}
                          name={"odometer"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter odometer "
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
                    {vehicleById?.id ? "Edit" : "Add"}
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
            Add New Vehicle
          </Button>
        </Box>
        <VehicleTable
          changeVehicleStatus={changeVehicleStatus}
          vehicleData={vehicleList?.vehicle}
          editVehicle={editVehicle}
          deleteVehicle={handleDelete}
        />
      </Box>
    </Fragment>
  );
};

export default VehicleView;
