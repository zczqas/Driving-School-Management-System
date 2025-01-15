import CustomDialog from "@/components/CustomDialog";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  deleteUnit,
  fetchCourseLessonByUnitId,
  fetchCourseQuiz,
  fetchUnitsByCourseId,
  fetchUnitsById,
  updateUnit,
} from "@/store/course/course.actions";
import { CourseActionTypes } from "@/store/course/course.type";
import IRootState from "@/store/interface";
import { CourseUnit } from "@/types/unit";
import { QuizRounded } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import DescriptionIcon from "@mui/icons-material/Description";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Menu,
  Skeleton,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import * as Yup from "yup";
import AddSectionDialog from "./AddSectionDialog";

const CourseEditSidebar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  // store anchor element for all the section accordion
  const [sectionAnchors, setSectionAnchors] = useState<(null | HTMLElement)[]>(
    []
  );
  const [expanded, setExpanded] = useState<string | false>(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>();
  const [editDialog, setEditDialog] = useState(false);
  const [editId, setEditId] = useState<number | null>();

  useEffect(() => {
    if (router.query.id) {
      dispatch(fetchUnitsByCourseId(router.query.id as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  const { unitList, deleteUnitLoading, unitByUnitId, unitByUnitIdLoading } =
    useAppSelector((state: IRootState) => state.course.unitsById);
  const { lessonList, lessonListLoading } = useAppSelector(
    (state: IRootState) => state.course.courseLessonById
  );
  const { quizQuestions } = useAppSelector((state: IRootState) => state.course);
  const { quizListLoading } = useAppSelector(
    (state: IRootState) => state.course.courseQuiz
  );

  console.log("unitList", unitList);

  const formik = useFormik({
    validateOnChange: true,
    enableReinitialize: true,
    initialValues: {
      title: unitByUnitId?.title || "",
      purpose: unitByUnitId?.purpose || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      purpose: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (!editId && !router.query.id) {
        return;
      }
      dispatch(
        updateUnit(editId!, values, () => {
          handleCloseEditDialog();
          formik.resetForm();
          dispatch(fetchUnitsByCourseId(router.query.id as string));
        })
      );
    },
  });

  const handleSectionMenuOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    accordionIndex: number
  ) => {
    const newSectionAnchors = [...sectionAnchors];
    newSectionAnchors[accordionIndex] = event.currentTarget;
    setSectionAnchors(newSectionAnchors);
  };

  const handleChange =
    (panel: string, unitId: number) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      if (isExpanded && unitId) {
        dispatch(fetchCourseLessonByUnitId(unitId));
        dispatch(fetchCourseQuiz(unitId));
        // dispatch({
        //   type: CourseActionTypes.CLEAR_SECTION_MENU,
        // });
      }
    };

  const handleLessonClick = (
    lessonIndex: number,
    unitId: number,
    lessonId: number
  ) => {
    dispatch({
      type: CourseActionTypes.SET_SECTION_MENU,
      payload: {
        label: "Text",
        unitId: unitId,
        sectionId: lessonId,
        type: "edit",
      },
    });
  };

  const handleQuizClick = (unitId: number) => {
    dispatch({
      type: CourseActionTypes.SET_SECTION_MENU,
      payload: {
        label: "Quiz",
        unitId: unitId,
        sectionId: 0,
        type: "edit",
      },
    });
    dispatch(fetchCourseQuiz(unitId));
    // router.push(`/manage/course/quiz/${unitId}`);
  };

  const handleSectionMenuClose = (accordionIndex: number) => {
    const newSectionAnchors = [...sectionAnchors];
    newSectionAnchors[accordionIndex] = null;
    setSectionAnchors(newSectionAnchors);
  };

  function handleDeleteUnit(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  const handleCloseEditDialog = () => {
    setEditDialog(false);
  };

  const menuItems = [
    { icon: <DescriptionIcon />, label: "Text" },
    { icon: <QuizRounded />, label: "Quiz" },
    // { icon: <SlideshowIcon />, label: "Slide" },
    // { icon: <BarChartIcon />, label: "Chart" },
    // { icon: <CloudDownloadIcon />, label: "Download" },
    // { icon: <VideoLibraryIcon />, label: "Video" },
    // { icon: <AudiotrackIcon />, label: "Audio" },
    // { icon: <QuizIcon />, label: "Quiz" },
    // { icon: <FileUploadIcon />, label: "Import" },
  ];
  return (
    <Box
      sx={{
        width: "25%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        borderRight: "1px solid #e0e0e0",
        height: "93vh",
      }}
    >
      {/* Delete unit dialog */}
      <CustomDialog
        loading={deleteUnitLoading}
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteUnit(deleteId.toString(), () => {
                setDeleteDialog(false);
                setDeleteId(null);
                dispatch(fetchUnitsByCourseId(router.query.id as string));
              })
            );
          }
        }}
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
      {/* Edit Unit Dialog */}
      <CustomDialog
        loading={unitByUnitIdLoading}
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
          open={unitByUnitIdLoading || quizListLoading}
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
                error={Boolean(formik.touched.purpose && formik.errors.purpose)}
                sx={{ width: "100%" }}
              >
                <CustomLabel shrink htmlFor="unit-purpose">
                  Purpose
                </CustomLabel>
                <CustomInput
                  id="unit-purpose"
                  type="text"
                  placeholder="What is the purpose of this unit?"
                  {...formik.getFieldProps("purpose")}
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
      {/* Accordion Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {unitList.length > 0 ? (
          unitList?.map((unit: CourseUnit, accordionIndex: number) => (
            <Accordion
              key={accordionIndex}
              sx={{
                marginBottom: 2,
                borderRadius: "4px",
              }}
              aria-controls={`unit${accordionIndex + 1}-content`}
              id={`unit${accordionIndex + 1}-header`}
              expanded={expanded === `panel${accordionIndex}`}
              onChange={handleChange(`panel${accordionIndex}`, unit.id)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  borderRadius: "4px 4px 0px 0px",
                  backgroundColor:
                    expanded === `panel${accordionIndex}`
                      ? "#E9E4F6"
                      : "transparent",
                }}
              >
                <Typography>
                  Unit {accordionIndex + 1}: {unit.title}
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ padding: 0 }}>
                {lessonListLoading ? (
                  <Box sx={{ padding: 2 }}>
                    {[...Array(4)].map((_, i) => (
                      <Box key={i} sx={{ marginBottom: 2 }}>
                        <Skeleton variant="text" width="40%" />
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <>
                    {lessonList &&
                      lessonList?.map((lesson: any, subIndex: any) => (
                        <Fragment key={subIndex}>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "12px 15px",
                              margin: 0.5,
                              borderRadius: 1,
                              borderBottom: "1px solid #EAECEE",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              handleLessonClick(subIndex, unit.id, lesson.id)
                            }
                          >
                            <Typography
                              variant="body1"
                              sx={{
                                textDecoration: "underline",
                                color: "#2521f3",
                              }}
                            >
                              {`${accordionIndex + 1} - ${subIndex + 1}: ${
                                lesson.title
                              }`}
                            </Typography>
                          </Box>
                        </Fragment>
                      ))}
                    {quizQuestions.length > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 15px",
                          margin: 0.5,
                          borderRadius: 1,
                          cursor: "pointer",
                        }}
                        onClick={() => handleQuizClick(unit.id)}
                      >
                        <Typography
                          variant="body1"
                          sx={{ textDecoration: "underline", color: "#2521f3" }}
                        >
                          {`${accordionIndex + 1} - ${
                            lessonList?.filter(
                              (lesson: any) => lesson.unit_id === unit.id
                            ).length + 1
                          }: End of unit quiz`}
                        </Typography>
                      </Box>
                    )}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 15px",
                        margin: 0.5,
                        borderRadius: 1,
                        cursor: "pointer",
                      }}
                    >
                      <Button
                        variant="text"
                        startIcon={<AddIcon />}
                        onClick={(event) => {
                          if (quizQuestions.length > 0) {
                            dispatch({
                              type: CourseActionTypes.SET_SECTION_MENU,
                              payload: {
                                label: "text",
                                unitId: unit.id,
                                sectionId: null,
                                type: "add",
                              },
                            });
                          } else {
                            handleSectionMenuOpen(event, accordionIndex);
                          }
                        }}
                        sx={{
                          textTransform: "none",
                          color: "#5E38B5",
                          justifyContent: "flex-start",
                        }}
                      >
                        Add Section
                      </Button>
                      <Box>
                        <IconButton
                          sx={{
                            height: "40px",
                            width: "40px",
                            padding: "0px",
                            backgroundColor: "#F37736",
                            "&:hover": {
                              backgroundColor: "#F37736",
                            },
                            mr: 1,
                          }}
                          onClick={() => {
                            dispatch(fetchUnitsById(unit.id));
                            setEditId(unit.id);
                            setEditDialog(true);
                          }}
                        >
                          <Image
                            src="/icons/edit.svg"
                            alt="edit"
                            height={16}
                            width={16}
                          />
                        </IconButton>
                        <IconButton
                          sx={{
                            height: "40px",
                            width: "40px",
                            padding: "0px",
                            backgroundColor: "#EB2D2F",
                            "&:hover": {
                              backgroundColor: "red",
                            },
                          }}
                          onClick={() => handleDeleteUnit(unit.id)}
                        >
                          <Image
                            src="/icons/delete.svg"
                            alt="delete"
                            height={16}
                            width={16}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                    <Menu
                      anchorEl={sectionAnchors[accordionIndex]}
                      open={Boolean(sectionAnchors[accordionIndex])}
                      onClose={() => handleSectionMenuClose(accordionIndex)}
                      marginThreshold={0}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      sx={{
                        "& .MuiMenu-paper": {
                          transform: "translateY(25px) !important",
                          padding: 2,
                          minWidth: 200,
                        },
                      }}
                    >
                      <Grid container spacing={2} sx={{ padding: 1 }}>
                        {menuItems.map((item, i) => (
                          <Grid
                            item
                            xs={4}
                            key={i}
                            onClick={() => {
                              dispatch({
                                type: CourseActionTypes.SET_SECTION_MENU,
                                payload: {
                                  label: item.label,
                                  unitId: unit.id,
                                  sectionId: i,
                                  type: "add",
                                },
                              });
                              handleSectionMenuClose(accordionIndex);
                            }}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              cursor: "pointer",
                              width: 40,
                              "&:hover": { color: "#673ab7" },
                            }}
                          >
                            {item.icon}
                            <Typography variant="body2" sx={{ marginTop: 0.5 }}>
                              {item.label}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Menu>
                  </>
                )}
              </AccordionDetails>
            </Accordion>
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="h6" sx={{ color: "#888" }}>
              No units found.
            </Typography>
          </Box>
        )}
      </Box>

      {/* Add New Unit Button */}
      <Box
        sx={{
          padding: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <AddSectionDialog courseId={router.query.id as string} />
      </Box>
    </Box>
  );
};

export default CourseEditSidebar;
