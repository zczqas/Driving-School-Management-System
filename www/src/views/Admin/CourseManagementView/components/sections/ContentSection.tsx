import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createCourseLessonContent,
  fetchCourseLessonByUnitId,
  getCourseLessonById,
  updateCourseLesson,
} from "@/store/course/course.actions";
import { CourseActionTypes } from "@/store/course/course.type";
import IRootState from "@/store/interface";
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  styled,
  Tab,
  Tabs,
} from "@mui/material";
import { useFormik } from "formik";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import * as Yup from "yup";
import { CustomTabPanel } from "../../AddCourseView";
import ChartContent from "./ChartContent";
import VideoContent from "./VideoContent";

// dynamic import while making it pure client side
// disable ssr to avoid window is not defined error
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface StyledTabProps {
  label: string;
}

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: "none",
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.pxToRem(15),
  marginRight: theme.spacing(1),
  // color: "rgba(255, 255, 255, 0.7)",
  "&.Mui-selected": {
    color: "black",
    fontWeight: theme.typography.fontWeightBold,
  },
  "&.Mui-focusVisible": {
    backgroundColor: "rgba(100, 95, 228, 0.32)",
  },
}));

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    maxWidth: 40,
    width: "100%",
    backgroundColor: "#635ee7",
  },
});

// const getComponentByLabel = (sectionMenu: SectionMenu | null): JSX.Element => {
//   if (!sectionMenu) return <Box>Select some content</Box>;
//   switch (sectionMenu.label.toLowerCase()) {
//     case "text":
//       return <Box>Text</Box>;
//     case "video":
//       return <VideoContent />;
//     case "chart":
//       return <ChartContent />;
//     case "slide":
//       return <SlideContent />;
//     default:
//       return <Box>Select some content</Box>;
//   }
// };

const ContentSection = () => {
  const {
    sectionMenu,
    courseLessonPreview,
    courseLessonById: {
      lessonById,
      lessonByIdLoading,
      updateLessonLoading,
      createLessonContentLoading,
    },
  } = useAppSelector((state: IRootState) => state.course);
  const dispatch = useAppDispatch();

  // console.log(sectionMenu, "sectionMenu");
  useEffect(() => {
    if (sectionMenu?.type === "edit") {
      dispatch(getCourseLessonById(sectionMenu?.sectionId));
    }
    formik.resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionMenu]);

  // console.log(lessonById, "lessonById");

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      title: sectionMenu?.type === "edit" ? lessonById?.title : "",
      body: sectionMenu?.type === "edit" ? lessonById?.body : "",
      video_name:
        sectionMenu?.type === "edit" ? lessonById?.video_name || null : "",
      image_name:
        sectionMenu?.type === "edit" ? lessonById?.image_name || null : "",
      video_file: null,
      image_file: null,
      video_url:
        sectionMenu?.type === "edit" ? lessonById?.video_url || null : null,
      image_url:
        sectionMenu?.type === "edit" ? lessonById?.image_url || null : null,
    },
    validationSchema: Yup.object({
      title: Yup.string().max(255).required("Required"),
      body: Yup.string().required("Required"),
      video_name: Yup.string().max(255).optional().nullable(),
      image_name: Yup.string().max(255).optional().nullable(),
      video_file: Yup.mixed().optional().nullable(),
      image_file: Yup.mixed().optional().nullable(),
      video_url: Yup.string().max(255).optional().nullable(),
      image_url: Yup.string().max(255).optional().nullable(),
    }),
    onSubmit: (values) => {
      if (
        values.body === "<p><br></p>" ||
        values.body === null ||
        !sectionMenu?.unitId
      ) {
        // dispatch(openAlert("Content is required", "error"));
        formik.setSubmitting(false);
        return;
      }
      if (sectionMenu?.type === "edit") {
        dispatch(
          updateCourseLesson(
            sectionMenu?.sectionId,
            {
              title: values.title,
              body: values.body,
              unit_id: sectionMenu?.unitId,
              video_name: values.video_name,
              image_name: values.image_name,
              video_url: values.video_url,
              image_url: values.image_url,
            },
            () => {
              dispatch({
                type: CourseActionTypes.CLEAR_SECTION_MENU,
              });
              dispatch(fetchCourseLessonByUnitId(sectionMenu?.unitId!));
              formik.resetForm();
            }
          )
        );
      } else {
        dispatch(
          createCourseLessonContent(
            {
              title: values.title,
              body: values.body,
              unit_id: sectionMenu?.unitId,
              video_name: values.video_name,
              image_name: values.image_name,
              video: values.video_file,
              image: values.image_file,
            },
            () => {
              dispatch({
                type: CourseActionTypes.CLEAR_SECTION_MENU,
              });
              dispatch(fetchCourseLessonByUnitId(sectionMenu?.unitId!));
              formik.resetForm();
            }
          )
        );
      }
      console.log("Submitted", values);
    },
  });

  console.log("FORMIK ERRORS", formik.errors);
  console.log("FORMIK VALUES", formik.values);

  const [checked, setChecked] = React.useState({
    immediate: false,
    later: false,
  });

  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCheckboxChange = (event: any) => {
    const { name } = event.target;
    setChecked((prev) => ({
      immediate: name === "immediate" ? !prev.immediate : false,
      later: name === "later" ? !prev.later : false,
    }));
  };

  return (
    <Box>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={lessonByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Grid
        container
        spacing={2}
        sx={{
          alignItems: "center",
        }}
      >
        <Grid item xs={6}>
          <FormControl
            variant="standard"
            error={Boolean(formik.touched.title && formik.errors.title)}
            sx={{ width: "100%" }}
          >
            <CustomLabel shrink htmlFor="section-name">
              Section Name
            </CustomLabel>
            <CustomInput
              sx={{
                borderRadius: 0,
              }}
              id="section-name"
              type="text"
              placeholder="Enter section name"
              {...formik.getFieldProps("title")}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <CustomLabel shrink htmlFor="availability">
            Availability
          </CustomLabel>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked.immediate}
                    onChange={handleCheckboxChange}
                    name="immediate"
                    color="primary"
                  />
                }
                label="Schedule Immediately"
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checked.later}
                    onChange={handleCheckboxChange}
                    name="later"
                    color="primary"
                  />
                }
                label="Schedule for Later"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Box sx={{ marginTop: "1rem" }}>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            <Box>
              <StyledTabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="styled tabs example"
              >
                <StyledTab label="Content" />
                <StyledTab label="Video" />
                <StyledTab label="Image" />
              </StyledTabs>
              <CustomTabPanel value={tabValue} index={0}>
                <Box sx={{ position: "relative", height: "53vh" }}>
                  <CustomLabel shrink htmlFor="body">
                    Content
                  </CustomLabel>
                  {courseLessonPreview === null && (
                    <ReactQuill
                      theme="snow"
                      value={formik.values.body}
                      onChange={(value) => formik.setFieldValue("body", value)}
                      modules={{
                        toolbar: [
                          [{ header: "1" }, { header: "2" }],
                          [{ size: ["small", "medium", "large", "huge"] }],
                          ["bold", "italic", "underline", "strike"],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link"],
                        ],
                      }}
                      formats={[
                        "header",
                        "font",
                        "size",
                        "bold",
                        "italic",
                        "underline",
                        "strike",
                        "list",
                        "bullet",
                        "link",
                      ]}
                    />
                  )}
                  {courseLessonPreview !== null && (
                    <ReactQuill
                      theme="snow"
                      value={formik.values.body}
                      readOnly={true}
                      modules={{
                        toolbar: false,
                      }}
                    />
                  )}
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={1}>
                <Box sx={{ position: "relative", height: "53vh" }}>
                  <VideoContent formik={formik} sectionMenu={sectionMenu!} />
                </Box>
              </CustomTabPanel>
              <CustomTabPanel value={tabValue} index={2}>
                <Box sx={{ position: "relative", height: "53vh" }}>
                  <ChartContent formik={formik} sectionMenu={sectionMenu!} />
                </Box>
              </CustomTabPanel>
              <Box sx={{ p: 3 }} />
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "-10px",
                gap: "8px",
              }}
            >
              <Button
                onClick={() => {
                  if (courseLessonPreview === null) {
                    dispatch({
                      type: CourseActionTypes.LESSON_PREVIEW_DATA,
                      payload: {
                        previewContent: formik.values.body,
                      },
                    });
                  } else {
                    dispatch({
                      type: CourseActionTypes.CLEAR_LESSON_PREVIEW_DATA,
                    });
                  }
                }}
                variant="outlined"
                sx={{
                  borderRadius: "32px",
                }}
              >
                {courseLessonPreview === null ? "Preview" : "Back"}
              </Button>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: "32px",
                }}
                disabled={
                  lessonByIdLoading ||
                  updateLessonLoading ||
                  createLessonContentLoading
                }
              >
                Save
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

export default ContentSection;
