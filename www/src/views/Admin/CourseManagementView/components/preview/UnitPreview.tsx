import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchCourseLessonByUnitId,
  fetchCourseQuiz,
  fetchUnitsByCourseId,
} from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import { CourseUnit } from "@/types/unit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Skeleton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useState } from "react";

const UnitPreview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (router.query.id) {
      dispatch(fetchUnitsByCourseId(router.query.id as string));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.id]);
  const [expanded, setExpanded] = useState<string | false>(false);

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

  const { unitList, unitListLoading } = useAppSelector(
    (state: IRootState) => state.course.unitsById
  );

  const { lessonList, lessonListLoading } = useAppSelector(
    (state: IRootState) => state.course.courseLessonById
  );

  const {
    course: { courseById },
  } = useAppSelector((state: IRootState) => state.course);

  const { quizQuestions } = useAppSelector((state: IRootState) => state.course);

  const handleQuizClick = (unitId: number) => {
    router.push(
      `/manage/course/${router.query.id}/preview/quiz?unitId=${unitId}`
    );
  };

  const handleLessonClick = (
    lessonIndex: number,
    unitId: number,
    lessonId: number
  ) => {
    router.push(
      `/manage/course/${router.query.id}/preview/lesson?lessonId=${lessonId}`
    );
  };

  console.log("unitList", unitList);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {unitListLoading ? (
        <>
          {[...Array(10)].map((_, i) => (
            <Box key={i} sx={{ marginBottom: 2 }}>
              <Skeleton
                variant="rectangular"
                height={65}
                sx={{
                  borderRadius: "4px",
                }}
              />
            </Box>
          ))}
        </>
      ) : (
        <Fragment>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h4">{courseById?.title}</Typography>
            <Typography variant="body1">{courseById?.description}</Typography>
          </Box>
          {unitList.length > 0 ? (
            unitList?.map((unit: CourseUnit, index: any) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`, unit.id)}
                sx={{
                  marginBottom: 2,
                  borderRadius: "4px",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`unit${index + 1}-content`}
                  id={`unit${index + 1}-header`}
                  sx={{
                    borderRadius: "4px 4px 0px 0px",
                    backgroundColor:
                      expanded === `panel${index}` ? "#E9E4F6" : "transparent",
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                    {unit.title}
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
                        lessonList.map((lesson: any, subIndex: any) => (
                          <React.Fragment key={subIndex}>
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
                                {`${index + 1} - ${subIndex + 1}: ${
                                  lesson.title
                                }`}
                              </Typography>
                              {/* <Typography
                            variant="body2"
                            sx={{
                              color: lesson.is_passed ? "green" : "inherit",
                            }}
                          >
                            {lesson.is_passed ? "Passed" : ""}
                          </Typography> */}
                            </Box>
                          </React.Fragment>
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
                            sx={{
                              textDecoration: "underline",
                              color: "#2521f3",
                            }}
                          >
                            {`${index + 1} - ${
                              lessonList?.filter(
                                (lesson: any) => lesson.unit_id === unit.id
                              ).length + 1
                            }: End of unit quiz`}
                          </Typography>
                        </Box>
                      )}
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
        </Fragment>
      )}
    </Box>
  );
};

export default UnitPreview;
