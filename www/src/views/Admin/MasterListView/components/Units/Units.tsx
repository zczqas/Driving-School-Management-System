import React, { Fragment, useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Formik, Form } from "formik";
import UnitsTable from "./components/UnitsTable";
import CustomDialog from "@/components/CustomDialog";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchUnits,
  createUnit,
  updateUnit,
  deleteUnit,
  fetchCourses,
} from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";

const Units = () => {
  const dispatch = useAppDispatch();
  const {
    unitList = [],
    unitListLoading = false,
    createUnitLoading = false,
    updateUnitLoading = false,
  } = useAppSelector((state: IRootState) => state?.masterlist?.unit || {});
  const { courseList = [] } = useAppSelector(
    (state: IRootState) => state?.masterlist?.course || {}
  );

  const [unitById, setUnitById] = useState<any>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [changesMade, setChangesMade] = useState(false);

  // Fetch units when component mounts
  useEffect(() => {
    dispatch(fetchUnits());
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (unitById?.id) {
      setOpenDialog(true);
    }
  }, [unitById]);

  const handleDelete = (id: number) => {
    dispatch(
      deleteUnit(id.toString(), () => {
        setDeleteDialog(false);
        dispatch(fetchUnits());
      })
    );
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setChangesMade(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
    setChangesMade(false);
  };

  const editUnit = (id: string) => {
    const unit = unitList?.course_unit?.find((unit: any) => unit.id === id);
    setUnitById(unit || {});
    setOpenDialog(true);
  };

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={unitListLoading || createUnitLoading || updateUnitLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CustomDialog
        handleAccept={() => handleDelete(deleteId as number)}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Unit"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this unit?</h4>
        </Box>
      </CustomDialog>

      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${unitById?.id ? "Edit" : "Add"} Unit`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            title: unitById?.title || "",
            purpose: unitById?.purpose || "", // Updated field
            course_id: unitById?.course_id || 0, // Updated field for course_id
          }}
          onSubmit={async (values) => {
            if (unitById?.id) {
              if (changesMade) {
                dispatch(
                  updateUnit(unitById.id, values, () => {
                    handleCloseDialog();
                    dispatch(fetchUnits());
                  })
                );
              } else {
                alert("No changes made to save");
              }
            } else {
              dispatch(
                createUnit(values, () => {
                  handleCloseDialog();
                  dispatch(fetchUnits());
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
            dirty,
            handleSubmit,
            setFieldValue,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (dirty) {
                setChangesMade(true);
              }
            }, [dirty]);

            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"md"}>
                    <Grid item xs={6}>
                      <CustomLabel shrink htmlFor={"title"}>
                        Course:
                      </CustomLabel>
                      <FormControl
                        fullWidth
                        size="small"
                        variant="outlined"
                        sx={{ minWidth: "131px" }}
                      >
                        <Select
                          labelId="course-select-label"
                          id="course-select"
                          value={values.course_id}
                          onChange={(e) =>
                            setFieldValue("course_id", e.target.value)
                          }
                          displayEmpty
                          sx={{
                            height: "60px",
                            fontSize: "14px",
                            fontWeight: 500,
                            color: "dark.main",
                            fontFamily: (theme) =>
                              theme.typography.button.fontFamily,
                            borderRadius: "32px",
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select a Course
                          </MenuItem>
                          {courseList?.courses?.map((course: any) => (
                            <MenuItem key={course?.id} value={course?.id}>
                              {course?.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.title && errors.title)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"title"}>
                          Unit Name:
                        </CustomLabel>
                        <CustomInput
                          id={"title"}
                          type={"text"}
                          value={values.title}
                          name={"title"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Unit Title"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.purpose && errors.purpose)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"purpose"}>
                          Purpose:
                        </CustomLabel>
                        <CustomInput
                          id={"purpose"}
                          type={"text"}
                          value={values.purpose}
                          name={"purpose"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Unit Purpose"
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
                    onClick={handleCloseDialog}
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
                    {unitById?.id ? "Edit" : "Add"}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>

      <Box>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "32px",
            }}
            endIcon={<AddRoundedIcon />}
            onClick={() => {
              setUnitById({});
              setOpenDialog(true);
            }}
          >
            Add New Unit
          </Button>
        </Box>

        {unitListLoading ? (
          <CircularProgress />
        ) : (
          <UnitsTable
            unitsData={unitList}
            editUnit={editUnit}
            deleteUnit={(id: any) => {
              setDeleteId(id);
              setDeleteDialog(true);
            }}
          />
        )}
      </Box>
    </Fragment>
  );
};

export default Units;
