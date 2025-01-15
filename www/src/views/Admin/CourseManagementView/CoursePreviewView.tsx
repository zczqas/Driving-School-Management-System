import TabPanel from "@/views/Client/DriversEd/components/TabPanel";
import { Box, Container, Tab, Tabs } from "@mui/material";
import { useEffect, useState } from "react";
import UnitPreview from "./components/preview/UnitPreview";
import { useAppDispatch } from "@/hooks";
import { useRouter } from "next/router";
import { fetchCourseById } from "@/store/course/course.actions";

const CoursePreviewView = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id: courseId } = router.query as { id: string };

  useEffect(() => {
    if (courseId && !isNaN(+courseId)) {
      dispatch(fetchCourseById(+courseId));
    }
  }, [courseId, dispatch]);

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          background: "#fff",
          flexDirection: "column",
          height: "100%",
          minHeight: "90vh",
        }}
      >
        <Box sx={{ padding: "14px 18px" }}>
          <UnitPreview />
        </Box>
      </Box>
    </Container>
  );
};

export default CoursePreviewView;
