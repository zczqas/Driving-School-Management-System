import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import CityTable from "./components/CityTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createCity,
  deleteCity,
  fetchCities,
  fetchCityById,
  updateCity,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const CityView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchCities(0, 25));
  }, [dispatch]);

  const { cityList, cityById, cityListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.city
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
    dispatch(fetchCities(0, 25));
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    dispatch(fetchCities(0, 25));
  }

  function editCity(id: any) {
    dispatch(fetchCityById(id));
  }

  useEffect(() => {
    if (cityById?.id) {
      setOpenDialog(true);
    }
  }, [cityById]);

  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={cityListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteCity(deleteId, () => {
                dispatch(fetchCities(0, 25));
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
        dialogTitle="Delete City"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this City?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${cityById?.id ? "Edit" : "Add"} City`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            name: cityById?.name || "",
            state: cityById?.state || "",
            country: cityById?.country || "",
            city_abbreviation: cityById?.city_abbreviation || "",
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            if (cityById?.id) {
              if (changesMade) {
                dispatch(
                  updateCity(cityById.id, values, () => {
                    handleCloseDialog();
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createCity(values, () => {
                  dispatch(fetchCities(0, 25));
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

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.country && errors.country)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"country"}>
                          Country:
                        </CustomLabel>
                        <CustomInput
                          id={"country"}
                          type={"text"}
                          value={values.country}
                          name={"country"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter country "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.city_abbreviation && errors.city_abbreviation
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"city_abbreviation"}>
                          City Abbreviation:
                        </CustomLabel>
                        <CustomInput
                          id={"city_abbreviation"}
                          type={"texttes"}
                          value={values.city_abbreviation}
                          name={"city_abbreviation"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter city abbreviation "
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
                    {cityById?.id ? "Edit" : "Add"}
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
            Add New City
          </Button>
        </Box>
        <CityTable
          cityData={cityList?.city}
          editCity={editCity}
          deleteCity={handleDelete}
        />
      </Box>
    </Fragment>
  );
};

export default CityView;
