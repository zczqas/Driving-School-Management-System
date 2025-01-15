import React, { Fragment, useState, useEffect } from "react";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "@/store/masterlist/masterlist.actions";
import CoursesTable from "./components/CoursesTable";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import IRootState from "@/store/interface";

const Courses = () => {
  const dispatch = useAppDispatch();

  const {
    courseList = [],
    courseListLoading = false,
    createCourseLoading = false,
    createCourseSuccess = false,
  } = useAppSelector((state: IRootState) => state?.masterlist?.course || {});

  const [deleteId, setDeleteId] = useState<any>();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [courseById, setCourseById] = useState<any>({});
  const [changesMade, setChangesMade] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (createCourseSuccess) {
      handleCloseDialog();
      dispatch(fetchCourses());
    }
  }, [createCourseSuccess]);

  useEffect(() => {
    if (courseById?.id) {
      setOpenDialog(true);
    }
  }, [courseById]);

  function handleDelete(id: any) {
    dispatch(
      deleteCourse(id, () => {
        setDeleteDialog(false);
        dispatch(fetchCourses());
      })
    );
  }

  function handleCloseDialog() {
    setOpenDialog(false);
    setChangesMade(false);
  }

  function handleAcceptDialog() {
    setOpenDialog(false);
    setChangesMade(false);
  }

  function editCourse(id: any) {
    const course = courseList?.courses?.find((course: any) => course.id === id);
    setCourseById(course || {});
    setOpenDialog(true);
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={courseListLoading || createCourseLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <CustomDialog
        handleAccept={() => handleDelete(deleteId)}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Course"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this course?</h4>
        </Box>
      </CustomDialog>

      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${courseById?.id ? "Edit" : "Add"} Course`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            title: courseById?.title || "",
            description: courseById?.description || "",
          }}
          onSubmit={async (values) => {
            if (courseById?.id) {
              if (changesMade) {
                dispatch(
                  updateCourse(courseById.id, values, () => {
                    handleCloseDialog();
                    dispatch(fetchCourses());
                  })
                );
              } else {
                alert("No changes made to save");
              }
            } else {
              dispatch(createCourse(values, () => handleCloseDialog()));
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
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.title && errors.title)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"title"}>
                          Title:
                        </CustomLabel>
                        <CustomInput
                          id={"title"}
                          type={"text"}
                          value={values.title}
                          name={"title"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Course Title"
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
                          placeholder="Enter Course Description"
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
                    {courseById?.id ? "Edit" : "Add"}
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
              setCourseById({});
              setOpenDialog(true);
            }}
          >
            Add New Course
          </Button>
        </Box>

        {courseListLoading ? (
          <CircularProgress />
        ) : (
          <CoursesTable
            coursesData={courseList}
            editCourse={editCourse}
            deleteCourse={(id) => {
              setDeleteId(id);
              setDeleteDialog(true);
            }}
          />
        )}
      </Box>
    </Fragment>
  );
};

export default Courses;
