import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import SchoolTable from "./components/SchoolTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createSchool,
  deleteSchool,
  fetchSchoolById,
  fetchSchools,
  updateSchool,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const SchoolView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchSchools(0, 25));
  }, [dispatch]);
  

  const { schoolList, schoolById, schoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.school
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
    dispatch(fetchSchools(0, 25));
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    dispatch(fetchSchools(0, 25));
  }

  function editSchool(id: any) {
    dispatch(fetchSchoolById(id));
  }

  useEffect(() => {
    if (schoolById?.id) {
      setOpenDialog(true);
    }
  }, [schoolById]);

  const [changesMade, setChangesMade] = React.useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={schoolListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteSchool(deleteId, () => {
                dispatch(fetchSchools(0, 25));
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
        dialogTitle="Delete School"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this School?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${schoolById?.id ? "Edit" : "Add"} School`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            name: schoolById?.name || "",
            description: schoolById?.description || "",
            address: schoolById?.address || "",
            latitude: schoolById?.latitude || null,
            longitude: schoolById?.longitude || null,
            zipcode: schoolById?.zipcode || "",
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            if (schoolById?.id) {
              if (changesMade) {
                dispatch(
                  updateSchool(schoolById.id, values, () => {
                    handleCloseDialog();
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createSchool(values, () => {
                  dispatch(fetchSchools(0, 25));
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

                    <Grid item xs={6}>
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
                          placeholder="Enter description "
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
                        error={Boolean(touched.latitude && errors.latitude)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"latitude"}>
                          Latitude:
                        </CustomLabel>
                        <CustomInput
                          id={"latitude"}
                          type={"number"}
                          value={values.latitude}
                          name={"latitude"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter latitude "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.longitude && errors.longitude)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"longitude"}>
                          Longitude:
                        </CustomLabel>
                        <CustomInput
                          id={"longitude"}
                          type={"number"}
                          value={values.longitude}
                          name={"longitude"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter longitude "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.zipcode && errors.zipcode)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"zipcode"}>
                          Zipcode:
                        </CustomLabel>
                        <CustomInput
                          id={"zipcode"}
                          type={"text"}
                          value={values.zipcode}
                          name={"zipcode"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter zipcode "
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
                    {schoolById?.id ? "Edit" : "Add"}
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
            Add New School
          </Button>
        </Box>
        <SchoolTable
          schoolData={schoolList?.school}
          editSchool={editSchool}
          deleteSchool={handleDelete}
        />
      </Box>
    </Fragment>
  );
};

export default SchoolView;
