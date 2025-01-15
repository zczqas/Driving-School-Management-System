import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import React, { Fragment, useCallback } from "react";

import CustomDialog from "@/components/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import SubHeader from "./components/SubHeader";

import { CustomInput, CustomLabel } from "@/components/CustomInput";
import {
  deleteCourse,
  fetchCourseById,
  fetchCourses,
  updateCourse,
} from "@/store/course/course.actions";
import { useFormik } from "formik";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import CourseTable from "./components/CourseTable";

const CourseManagementView = () => {
  const {
    courseList,
    courseListLoading,
    courseListError,
    courseById,
    courseByIdLoading,
    updateCourseLoading,
    deleteCourseLoading,
  } = useAppSelector((state: IRootState) => state.course.course);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const [openDialog, setOpenDialog] = React.useState(false);

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>();

  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  React.useEffect(() => {
    dispatch(fetchCourses(0, 30));
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = React.useState("");
  const [editDialog, setEditDialog] = React.useState(false);
  const [editId, setEditId] = React.useState<number | null>();

  const formik = useFormik({
    validateOnChange: true,
    enableReinitialize: true,
    initialValues: {
      title: courseById?.title || "",
      description: courseById?.description || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (!editId) {
        return;
      }
      dispatch(
        updateCourse(editId, values, () => {
          setEditDialog(false);
          setEditId(null);
          dispatch(fetchCourses(0, 30));
        })
      );
    },
  });

  const filteredCourseData = courseList?.courses
    ? courseList.courses.map((course: any) => {
        return {
          id: course.id,
          courseName: course.title,
          description: course.description,
          duration: course.duration,
          modules: course.modules,
          lessons: course.lessons,
          activeStudents: course.students,
          // price: course.price,
          // status: course.is_active,
        };
      })
    : [];

  function changeCourseStatus(id: number, status: boolean) {
    console.log("changecourseStatus", id, status);
  }

  function handleDeleteCourse(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  function editCourse(id: number) {
    setEditDialog(true);
    setEditId(id);
    dispatch(fetchCourseById(id));
  }

  const handleCloseEditDialog = () => {
    setEditDialog(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        dispatch(fetchCourses(0, 30, searchTerm));
      } catch (error: any) {
        console.log("error", error);
      }
    }, 300),
    [dispatch]
  );

  React.useEffect(() => {
    console.log(searchQuery);
    fetchOptions(searchQuery);
  }, [fetchOptions, searchQuery]);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={courseListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CustomDialog
        loading={deleteCourseLoading}
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteCourse(deleteId.toString(), () => {
                setDeleteDialog(false);
                setDeleteId(null);
                dispatch(fetchCourses(0, 30));
              })
            );
          }
        }}
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
      {/* Course Edit Dialog */}
      <CustomDialog
        loading={courseByIdLoading || updateCourseLoading}
        handleClose={() => {
          setEditDialog(false);
          setEditId(null);
        }}
        handleAccept={handleCloseEditDialog}
        open={editDialog}
        dialogTitle="Edit Unit"
        isFormikForm
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={courseByIdLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                variant="standard"
                error={Boolean(formik.touched.title && formik.errors.title)}
                sx={{ width: "100%" }}
              >
                <CustomLabel shrink htmlFor="unit-title">
                  Title
                </CustomLabel>
                <CustomInput
                  id="unit-title"
                  type="text"
                  placeholder="Unit title"
                  {...formik.getFieldProps("title")}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                variant="standard"
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
                sx={{ width: "100%" }}
              >
                <CustomLabel shrink htmlFor="unit-description">
                  Description
                </CustomLabel>
                <CustomInput
                  id="unit-description"
                  type="text"
                  placeholder="Description"
                  {...formik.getFieldProps("description")}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "40px",
              gap: 2,
            }}
          >
            <Button
              disableElevation
              disabled={formik.isSubmitting}
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                padding: "12px 0",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "120px",
                width: "100%",
              }}
              onClick={() => {
                setEditDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              disabled={formik.isSubmitting}
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                borderRadius: "100px",
                padding: "12px 0",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "120px",
                width: "100%",
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      </CustomDialog>
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setOpenDialog={setOpenDialog}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          {courseListError ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography color={"red"}>{courseListError}</Typography>
            </Box>
          ) : (
            <CourseTable
              editCourse={editCourse}
              deleteCourse={handleDeleteCourse}
              changeCourseStatus={changeCourseStatus}
              courseData={filteredCourseData}
              isSearching={searchQuery.length > 0}
              loading={courseListLoading}
              page={0}
              rowsPerPage={30}
            />
          )}
        </Box>
      </Container>
    </Fragment>
  );
};

export default CourseManagementView;
