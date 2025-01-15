import React, { useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchLessonDetails } from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";

const Lessons: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const lessonId = router.query.slug;
  const unitId = router.query.unitId;

  useEffect(() => {
    if (lessonId && unitId) {
      dispatch(fetchLessonDetails(lessonId as string, unitId as string));
    }
  }, [lessonId, unitId, dispatch]);

  const { lessonDetail, lessonDetailLoading, unitList } = useAppSelector(
    (state: IRootState) => state.driver
  );

  const nextLessonId = (currentId: string) => {
    const lessonIndex = lessonDetail?.unit?.lessons.findIndex(
      (lesson: any) => lesson.id.toString() === currentId
    );
    if (
      lessonIndex >= 0 &&
      lessonIndex < lessonDetail.unit.lessons.length - 1
    ) {
      return lessonDetail.unit.lessons[lessonIndex + 1].id.toString();
    }
    return null;
  };

  const previousLessonId = (currentId: string) => {
    const lessonIndex = lessonDetail?.unit?.lessons.findIndex(
      (lesson: any) => lesson.id.toString() === currentId
    );
    if (lessonIndex > 0) {
      return lessonDetail.unit.lessons[lessonIndex - 1].id.toString();
    }
    return null;
  };

  const currentLessonIndex = lessonDetail?.unit?.lessons?.findIndex(
    (lesson: any) => lesson.id.toString() === lessonId
  );

  const currentLesson = lessonDetail?.unit?.lessons[currentLessonIndex];

  const handleNextClick = () => {
    const nextId = nextLessonId(lessonId as string);
    if (nextId) {
      router.push(`/manage/drivers-ed/lessons/${nextId}?unitId=${unitId}`);
    } else {
      window.location.href = `/manage/drivers-ed/unit-quiz/${unitId}`;
    }
  };

  const handlePreviousClick = () => {
    const prevId = previousLessonId(lessonId as string);
    if (prevId) {
      router.push(`/manage/drivers-ed/lessons/${prevId}?unitId=${unitId}`);
    } else {
      const prevUnitId = (parseInt(unitId as string, 10) - 1).toString();
      router.push(`/manage/drivers-ed/unit-quiz/${prevUnitId}`);
    }
  };

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "start",
          background: "#fff",
          flexDirection: "column",
          p: 3,
          gap: 3,
          borderRadius: 2,
          boxShadow: 3,
          width: "70%",
        }}
      >
        {lessonDetailLoading ? (
          <>
            <Skeleton variant="rectangular" width="40%" height={30} />
            <Skeleton variant="rectangular" width="40%" height={20} />
            <Skeleton variant="rectangular" width="100%" height={10} />
            <Skeleton variant="rectangular" width="20%" height={10} />
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
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
              {lessonDetail?.unit?.title}
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
              {`Section ${currentLessonIndex + 1}: ${currentLesson?.title}`}
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
              {lessonDetail?.unit?.purpose}
            </Typography>

            <TableContainer
              component={Paper}
              sx={{ borderRadius: 2, overflow: "hidden" }}
            >
              <Table aria-label="lesson details table">
                <TableHead
                  sx={{
                    backgroundColor: "#e0f7fa",
                    textTransform: "uppercase",
                    fontWeight: 400,
                    fontSize: "14px",
                    color: "rgba(79, 91, 103, 1)",
                  }}
                >
                  <TableRow>
                    <TableCell>Issue</TableCell>
                    <TableCell>Learning Objective</TableCell>
                    <TableCell>References</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody sx={{ fontWeight: 400, fontSize: "14px" }}>
                  {lessonDetail?.data?.map((issue: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Typography variant="body2">
                          {issue.section_id_1}
                        </Typography>
                        <Typography variant="body2">{issue.title}</Typography>
                        <Typography variant="body2">
                          {issue.section_id_2}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{issue.text}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {issue.reference}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              mt={3}
              display="flex"
              justifyContent={
                lessonId === "1" && unitId === "1"
                  ? "flex-end"
                  : "space-between"
              }
              width="100%"
            >
              {lessonId !== "1" || unitId !== "1" ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
                  onClick={handlePreviousClick}
                >
                  Previous
                </Button>
              ) : null}
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
                onClick={handleNextClick}
              >
                Next
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Lessons;
