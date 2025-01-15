import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Skeleton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  fetchUnitsList,
  fetchUnitLessonById,
} from "@/store/driverEd/driver.actions";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { openAlert } from "@/store/alert/alert.actions";

const Units: React.FC = () => {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchUnitsList());
  }, [dispatch]);

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string, unitId?: string, unitIndex?: number) =>
    (event: React.SyntheticEvent, isExpanded: boolean) => {
      if (
        isExpanded &&
        unitIndex !== undefined &&
        unitIndex > 0 &&
        !unitList.units[unitIndex - 1].is_passed
      ) {
        dispatch(
          openAlert(
            "Please complete the previous unit before proceeding.",
            "error"
          )
        );
        return;
      }
      setExpanded(isExpanded ? panel : false);
      if (isExpanded && unitId) {
        dispatch(fetchUnitLessonById(unitId));
      }
    };

  const { unitList, unitListLoading, unitLessonsById, unitLessonsByIdLoading } =
    useAppSelector((state: IRootState) => state.driver);

  const handleQuizClick = (unitId: number) => {
    const lessonsInUnit = unitLessonsById?.lesson?.filter(
      (lesson: any) => lesson.unit_id === unitId
    );
    const allLessonsPassed = lessonsInUnit?.every(
      (lesson: any) => lesson.is_passed
    );

    if (allLessonsPassed) {
      window.location.href = `/manage/drivers-ed/unit-quiz/${unitId}`;
    } else {
      dispatch(
        openAlert(
          "Please complete all lessons before taking the quiz.",
          "error"
        )
      );
    }
  };

  const isLessonAccessible = (unitId: number, lessonIndex: number) => {
    const lessonsInUnit = unitLessonsById?.lesson?.filter(
      (lesson: any) => lesson.unit_id === unitId
    );

    for (let i = 0; i < lessonIndex; i++) {
      if (!lessonsInUnit[i]?.is_passed) {
        return false;
      }
    }
    return true;
  };

  const handleLessonClick = (
    lessonIndex: number,
    unitId: number,
    lessonId: number
  ) => {
    if (isLessonAccessible(unitId, lessonIndex)) {
      window.location.href = `/manage/drivers-ed/lessons/${lessonId}?unitId=${unitId}`;
    } else {
      dispatch(
        openAlert(
          "Please complete previous lessons before proceeding.",
          "error"
        )
      );
    }
  };

  const allUnitsPassed = unitList?.units?.every((unit: any) => unit.is_passed);

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
        unitList &&
        unitList?.units?.map((unit: any, index: any) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`, unit.id, index)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`unit${index + 1}-content`}
              id={`unit${index + 1}-header`}
              sx={{
                backgroundColor:
                  expanded === `panel${index}` ? "#e0f7fa" : "transparent",
                padding: expanded === `panel${index}` ? "5px 12px" : "10px",
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
                {unit.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {unitLessonsByIdLoading ? (
                <Box sx={{ padding: 2 }}>
                  {[...Array(4)].map((_, i) => (
                    <Box key={i} sx={{ marginBottom: 2 }}>
                      <Skeleton variant="text" width="40%" />
                    </Box>
                  ))}
                </Box>
              ) : (
                <>
                  {unitLessonsById?.lesson &&
                    unitLessonsById.lesson
                      .filter((lesson: any) => lesson.unit_id === unit.id)
                      .map((lesson: any, subIndex: any) => (
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
                            <Typography
                              variant="body2"
                              sx={{
                                color: lesson.is_passed ? "green" : "inherit",
                              }}
                            >
                              {lesson.is_passed ? "Passed" : ""}
                            </Typography>
                          </Box>
                        </React.Fragment>
                      ))}
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
                      {`${index + 1} - ${
                        unitLessonsById?.lesson?.filter(
                          (lesson: any) => lesson.unit_id === unit.id
                        ).length + 1
                      }: End of unit quiz`}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: unit.is_passed ? "green" : "inherit",
                      }}
                    >
                      {unit.is_passed ? "Passed" : ""}
                    </Typography>
                  </Box>
                </>
              )}
            </AccordionDetails>
          </Accordion>
        ))
      )}

      <Accordion
        expanded={expanded === `panelFinalExam`}
        onChange={(event, isExpanded) => {
          if (!allUnitsPassed) {
            dispatch(
              openAlert(
                "Please complete all units before proceeding to the final exam.",
                "error"
              )
            );
            return;
          }
          setExpanded(isExpanded ? `panelFinalExam` : false);
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`finalExam-content`}
          id={`finalExam-header`}
          sx={{
            padding: "10px",
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "16px" }}>
            {unitList ? `${unitList?.units?.length + 1}: ` : ""}Final Exam
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={{ padding: 0 }}>
          {unitLessonsByIdLoading ? (
            <Box sx={{ padding: 2 }}>
              {[...Array(4)].map((_, i) => (
                <Box key={i} sx={{ marginBottom: 2 }}>
                  <Skeleton variant="text" width="40%" />
                </Box>
              ))}
            </Box>
          ) : (
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
              onClick={() =>
                (window.location.href = "/manage/drivers-ed/final-exam")
              }
            >
              <Typography
                variant="body1"
                sx={{ textDecoration: "underline", color: "#2521f3" }}
              >
                11 - 1: Final Exam
              </Typography>
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Units;
