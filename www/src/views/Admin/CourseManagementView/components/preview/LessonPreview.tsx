import { useAppDispatch, useAppSelector } from "@/hooks";
import { getCourseLessonById } from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import TabPanel from "@/views/Client/DriversEd/components/TabPanel";
import { Box, Container, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import _ from "lodash";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";

// dynamic import while making it pure client side
// disable ssr to avoid window is not defined error
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const LessonPreview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id: courseId, lessonId } = router.query as {
    id: string;
    lessonId: string;
  };

  const {
    courseLessonById: { lessonById, lessonByIdLoading },
  } = useAppSelector((state: IRootState) => state.course);

  const [tabValue, setTabValue] = useState<string>("1");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (!courseId || !lessonId || isNaN(+lessonId)) {
      router.push("/404");
    }
    if (courseId && lessonId && !isNaN(+lessonId)) {
      dispatch(getCourseLessonById(+lessonId));
    }
  }, [courseId, lessonId, router, dispatch]);

  return (
    <Container maxWidth={false} sx={{ p: 1 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          background: "#fff",
          flexDirection: "column",
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: "80%",
        }}
      >
        {lessonByIdLoading ? (
          <>
            <Skeleton variant="rectangular" width="40%" height={30} />
            <Skeleton variant="rectangular" width="40%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={10} />
            <Skeleton variant="rectangular" width="20%" height={10} />
          </>
        ) : (
          <Fragment>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                // gap: 2,
                padding: 0,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  fontSize: "24px",
                  color: "rgba(79, 91, 103, 1)",
                }}
              >
                Unit: {lessonById?.unit?.title}
              </Typography>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                Lesson: {lessonById?.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: 400,
                  fontSize: "14px",
                  color: "rgba(126, 132, 163, 1)",
                  fontStyle: "italic",
                }}
              >
                {lessonById?.purpose}
              </Typography>
            </Box>

            <Box
              sx={{
                width: "100%",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="styled tabs"
                >
                  <Tab label="Content" value="1" />
                  <Tab label="Optional Online Video Viewing" value="2" />
                  <Tab label="Charts and Tables" value="3" />
                </Tabs>
              </Box>
              <Box>
                <TabPanel value={tabValue} index="1">
                  <Box
                    sx={{
                      mt: 0,
                      width: "100%",
                      height: "70vh",
                      border: "none",
                      position: "relative",
                      "& .quill": {
                        border: "none",
                      },
                      "& .ql-container": {
                        border: "none",
                        fontFamily: "inherit",
                        padding: 1,
                        height: "64vh !important",
                      },
                      "& .ql-editor": {
                        padding: "0",
                        "& ul, & ol": {
                          paddingLeft: "1.5em",
                        },
                      },
                      "& .ql-tooltip, & .ql-clipboard": {
                        display: "none",
                      },
                    }}
                  >
                    <ReactQuill
                      theme="snow"
                      value={lessonById?.body}
                      readOnly={true}
                      modules={{
                        toolbar: false,
                      }}
                    />
                  </Box>
                </TabPanel>
                <TabPanel value={tabValue} index="2">
                  <Box>
                    {_.isNull(lessonById?.video_url) ? (
                      <Typography variant="body1" sx={{ color: "red" }}>
                        No video available
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      >
                        <video
                          src={`${API_URL?.split("api")[0]}${
                            lessonById?.video_url
                          }`}
                          width={"90%"}
                          height={"50%"}
                          controls
                        />
                      </Box>
                    )}
                  </Box>
                </TabPanel>
                <TabPanel value={tabValue} index="3">
                  <Box>
                    {_.isNull(lessonById?.image_url) ? (
                      <Typography variant="body1" sx={{ color: "red" }}>
                        No charts and tables available
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          height: "0",
                          paddingTop: "56.25%",
                          overflow: "hidden",
                        }}
                      >
                        <Image
                          src={`${API_URL?.split("api")[0]}${
                            lessonById?.image_url
                          }`}
                          alt={"chart"}
                          fill
                          style={{
                            objectFit: "contain",
                          }}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                          priority
                        />
                      </Box>
                    )}
                  </Box>
                </TabPanel>
              </Box>
            </Box>
          </Fragment>
        )}
      </Box>
    </Container>
  );
};

export default LessonPreview;
