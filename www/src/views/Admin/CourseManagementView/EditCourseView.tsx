import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchUnitsByCourseId } from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import { Backdrop, Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CourseEditSidebar from "./components/CourseEditSidebar";
import AddOrEditSection from "./components/sections/AddOrEditSection";

export const EditCourseView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.query.id) {
      dispatch(fetchUnitsByCourseId(router.query.id as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);

  const { unitListLoading, unitList } = useAppSelector(
    (state: IRootState) => state.course.unitsById
  );

  const { sectionMenu } = useAppSelector((state: IRootState) => state.course);

  return (
    <Box sx={{ display: "flex", height: "93vh" }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={unitListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CourseEditSidebar />
      {sectionMenu ? (
        <AddOrEditSection />
      ) : (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ color: "#888" }}>
              Build Your Unit
            </Typography>
            <Typography variant="body1" sx={{ color: "#bbb", marginTop: 1 }}>
              Choose A Section Type For Your Unit.
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};
