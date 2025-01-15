import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import GasStationsTable from "./components/GasStationsTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createGasStation,
  deleteGasStation,
  fetchGasStationById,
  fetchGasStations,
  updateGasStation,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AutocompleteWithDynamicSearch from "./components/AutoCompleteWithDynamicSearch";

const GasStationsView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchGasStations(0, 25));
  }, [dispatch]);

  const { gasStationList, gasStationById, gasStationListLoading } =
    useAppSelector((state: IRootState) => state?.masterlist?.gasStation);

  const [deleteId, setDeleteId] = useState<any>();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState(false);

  function handleDelete(id: any) {
    setDeleteId(id);
    setDeleteDialog(true);
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    dispatch(fetchGasStations(0, 25));
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    dispatch(fetchGasStations(0, 25));
  }

  function editGasStation(id: any) {
    dispatch(fetchGasStationById(id));
  }

  useEffect(() => {
    if (gasStationById?.id) {
      setOpenDialog(true);
    }
  }, [gasStationById]);

  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={gasStationListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteGasStation(deleteId, () => {
                dispatch(fetchGasStations(0, 25));
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
        dialogTitle="Delete Gas Stations"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this Gas Station?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${gasStationById?.id ? "Edit" : "Add"} Gas Station`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            name: gasStationById?.name || "",
            address: gasStationById?.address || "",
            city: gasStationById?.city || null,
            state: gasStationById?.state || "",
            zip_code: gasStationById?.zip_code || "",
            phone: gasStationById?.phone || "",
            email: gasStationById?.email || "",
            website: gasStationById?.website || "",
            notes: gasStationById?.notes || "",
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            const formFields = {
              name: values?.name,
              address: values?.address,
              state: values?.state,
              zip_code: values?.zip_code.toString(),
              phone: values?.phone.toString(),
              email: values?.email,
              website: values?.website,
              notes: values?.notes,
              city_id: values.city?.id,
            };

            if (gasStationById?.id) {
              if (changesMade) {
                dispatch(
                  updateGasStation(gasStationById.id, formFields, () => {
                    handleCloseDialog();
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createGasStation(formFields, () => {
                  dispatch(fetchGasStations(0, 25));
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
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.city && errors.city)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"city"}>
                          City:
                        </CustomLabel>
                        <AutocompleteWithDynamicSearch
                          setFieldValue={setFieldValue}
                          values={values}
                          fieldName="city" // Specify the field name here
                          endpoint="/city/get"
                          debounceTime={300}
                          getOptionLabel={(option) => `${option.name} `}
                          fetchedOptionsKey="city"
                          placeholder="Search City"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.address && errors.address)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"address"}>
                          Address:
                        </CustomLabel>
                        <CustomInput
                          id={"address"}
                          type={"text"}
                          value={values.address}
                          name={"address"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter address "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.state && errors.state)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"state"}>
                          State:
                        </CustomLabel>
                        <CustomInput
                          id={"state"}
                          type={"text"}
                          value={values.state}
                          name={"state"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter state "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.zip_code && errors.zip_code)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"zip_code"}>
                          Zip Code:
                        </CustomLabel>
                        <CustomInput
                          id={"zip_code"}
                          type={"number"}
                          value={values.zip_code}
                          name={"zip_code"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Zipcode "
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.phone && errors.phone)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"phone"}>
                          Phone:
                        </CustomLabel>
                        <CustomInput
                          id={"phone"}
                          type={"number"}
                          value={values.phone}
                          name={"phone"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Phone "
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.email && errors.email)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"email"}>
                          Email:
                        </CustomLabel>
                        <CustomInput
                          id={"email"}
                          type={"email"}
                          value={values.email}
                          name={"email"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Email "
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.website && errors.website)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"website"}>
                          Website:
                        </CustomLabel>
                        <CustomInput
                          id={"website"}
                          type={"text"}
                          value={values.website}
                          name={"website"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Website "
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.notes && errors.notes)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"notes"}>
                          Notes:
                        </CustomLabel>
                        <CustomInput
                          id={"notes"}
                          type={"text"}
                          value={values.notes}
                          name={"notes"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Notes "
                          multiline
                          rows={4}
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
                    {gasStationById?.id ? "Edit" : "Add"}
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
            Add New Gas Stations
          </Button>
        </Box>
        <GasStationsTable
          gasStationData={gasStationList?.gas_station}
          editGasStation={editGasStation}
          deleteGasStation={handleDelete}
        />
      </Box>
    </Fragment>
  );
};

export default GasStationsView;
