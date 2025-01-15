import React, { Fragment, useCallback } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import LessonTable from "./components/LessonTable";
import { fetchUsers } from "@/store/user/user.actions";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createLesson,
  deleteLesson,
  fetchLessonById,
  fetchLessons,
  resetLesson,
  updateLesson,
  updateLessonStatus,
} from "@/store/lesson/lesson.action";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { lato } from "@/themes/typography";

import * as Yup from "yup";
import { openAlert } from "@/store/alert/alert.actions";
import { debounce } from "lodash";

// ==============================|| LESSON VIEW ||============================== //
const LessonView = () => {
  const {
    lessonList,
    lessonListError,
    lessonListLoading,
    updateLessonLoading,
    lessonById,
    lessonByIdLoading,
  } = useAppSelector((state: IRootState) => state.lesson);

  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = React.useState(false);

  const [changesMade, setChangesMade] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);

    // reset stale data
    dispatch(resetLesson());
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>();

  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  React.useEffect(() => {
    dispatch(fetchLessons(0, 30));
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredLessonData = lessonList?.lessons
    ? lessonList.lessons.map((lesson: any) => {
        return {
          id: lesson.id,
          lessonNo: lesson.lesson_no ? lesson.lesson_no : "TBD",
          lessonName: lesson.name,
          description: lesson.description,
          duration: lesson.duration,
          // price: lesson.price,
          status: lesson.is_active,
        };
      })
    : [];

  function changeLessonStatus(id: number, status: boolean) {
    console.log("changeLessonStatus", id, status);
    dispatch(updateLessonStatus(id, !status, () => {}));
  }

  function handleDeleteLesson(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  function editLesson(id: number) {
    dispatch(fetchLessonById(id));
  }

  React.useEffect(() => {
    if (lessonById?.id) {
      setOpenDialog(true);
    }
  }, [lessonById]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        dispatch(fetchLessons(0, 30, searchTerm));
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
        open={lessonListLoading || updateLessonLoading || lessonByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteLesson(deleteId, () => {
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
        dialogTitle="Delete Lesson"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this lesson?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${lessonById?.id ? "Edit" : "Add"} Lesson`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            lessonName: lessonById?.name ? lessonById.name : "",
            lessonNo: lessonById?.lesson_no ? lessonById.lesson_no : "",
            description: lessonById?.description ? lessonById.description : "",
            duration: lessonById?.duration ? lessonById.duration : "",
            // price: lessonById?.price ? lessonById.price : "",
            status: lessonById?.is_active ? "active" : "inactive",
          }}
          validationSchema={Yup.object().shape({
            lessonName: Yup.string().required("Lesson name is required"),
            description: Yup.string().required("Description is required"),
            // price: Yup.string().required("Price is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            if (lessonById?.id) {
              if (changesMade) {
                dispatch(
                  updateLesson(
                    lessonById.id,
                    {
                      name: values.lessonName,
                      description: values.description,
                      duration: values.duration,
                      lesson_no: values.lessonNo,
                      // price: values.price,
                      is_active: values.status === "active" ? true : false,
                    },
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
                createLesson(
                  {
                    name: values.lessonName,
                    description: values.description,
                    duration: values.duration,
                    lesson_no: values.lessonNo,
                    // price: values.price,
                    is_active: values.status === "active" ? true : false,
                  },
                  () => {
                    dispatch(fetchLessons(0, 30));
                    handleCloseDialog();
                  }
                )
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
                        error={Boolean(touched.lessonNo && errors.lessonNo)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"lessonNo"}>
                          Lesson No.
                        </CustomLabel>
                        <CustomInput
                          id={"lessonNo"}
                          type={"text"}
                          value={values.lessonNo}
                          name={"lessonNo"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson no."
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.lessonName && errors.lessonName)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"lessonName"}>
                          Lesson Name:
                        </CustomLabel>
                        <CustomInput
                          id={"lessonName"}
                          type={"text"}
                          value={values.lessonName}
                          name={"lessonName"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter lesson name"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.description && errors.description
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"description"}>
                          Description :
                        </CustomLabel>
                        <CustomInput
                          id={"description"}
                          type={"text"}
                          value={values.description}
                          name={"description"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          multiline
                          rows={4}
                          placeholder="Enter description"
                        />
                      </FormControl>
                    </Grid>
                    {/* <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.price && errors.price)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"price"}>
                          Price :
                        </CustomLabel>
                        <CustomInput
                          id={"price"}
                          type={"number"}
                          value={values.price}
                          name={"price"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Price"
                        />
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.duration && errors.duration)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"duration"}>
                          Duration :
                        </CustomLabel>
                        <CustomInput
                          id={"duration"}
                          type={"number"}
                          value={values.duration}
                          name={"duration"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Duration"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={9}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: lato.style.fontFamily,
                            fontSize: "16px",
                          }}
                        >
                          Status:
                        </Typography>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.status && errors.status)}
                          sx={{ width: "100%" }}
                        >
                          <RadioGroup
                            aria-labelledby="status-radio-btn-groups"
                            name="status"
                            value={values?.status}
                            onChange={(e) => {
                              setFieldValue(
                                "status",
                                (e.target as HTMLInputElement).value
                              );
                            }}
                            id="status"
                            row
                          >
                            <FormControlLabel
                              value="active"
                              control={<Radio />}
                              label="Active"
                            />
                            <FormControlLabel
                              value="inactive"
                              control={<Radio />}
                              label="Inactive"
                            />
                          </RadioGroup>
                        </FormControl>
                      </Box>
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
                    {lessonById?.id ? "Edit" : "Add"}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
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
          <LessonTable
            lessonData={filteredLessonData}
            changeLessonStatus={changeLessonStatus}
            deleteLesson={handleDeleteLesson}
            editLesson={editLesson}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default LessonView;
