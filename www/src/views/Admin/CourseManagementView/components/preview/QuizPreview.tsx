import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchCourseQuiz } from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import { QuizQuestionType } from "@/types/unit";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { useEffect } from "react";
import * as Yup from "yup";

type QuizAnswerType = {
  question_id: number;
  selected_option: string;
};

const QuizPreview = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { unitId, id: courseId } = router.query as {
    unitId: string;
    id: string;
  };
  console.log("router.query.unitId", router);

  const { quizListLoading, quizList } = useAppSelector(
    (state: IRootState) => state.course.courseQuiz
  );
  const { quizQuestions, sectionMenu } = useAppSelector(
    (state: IRootState) => state.course
  );

  useEffect(() => {
    if (!courseId || !unitId || isNaN(+unitId)) {
      router.push("/404");
    }
    if (unitId && !isNaN(+unitId)) {
      dispatch(fetchCourseQuiz(+unitId));
    }
  }, [courseId, unitId, router, dispatch]);

  const formik = useFormik({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      answers: [] as QuizAnswerType[],
    },
    validationSchema: Yup.object().shape({
      answers: Yup.array().of(
        Yup.object().shape({
          question_id: Yup.string().required("Question id is required"),
          selected_option: Yup.string().required("Correct answer is required"),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log("quizList", values);
    },
  });

  if (quizListLoading) {
    return (
      <Container maxWidth={false} sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  console.log("quizList", formik.values.answers.length, quizList.length);

  return (
    <Container maxWidth={false} sx={{ p: 2 }}>
      <Box
        sx={{
          p: 3,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3,
          width: "70%",
        }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          // sx={{
          //   alignItems: "self-start",
          // }}
        >
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: "24px",
              color: "rgba(79, 91, 103, 1)",
            }}
            align="center"
            gutterBottom
          >
            Unit: {quizList[0]?.unit?.title}
          </Typography>
          <Typography
            sx={{
              fontWeight: 400,
              fontSize: "16px",
              color: "rgba(0, 0, 0, 1)",
            }}
            align="center"
            gutterBottom
          >
            End of unit quiz
          </Typography>
        </Box>
        <Box>
          <form onSubmit={formik.handleSubmit}>
            {quizList.map((question: QuizQuestionType, qIndex: number) => (
              <Box key={qIndex} sx={{ mt: 3 }}>
                <FormLabel component="legend">
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{
                      paddingBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {qIndex + 1}) {question.question}
                    {/* {isEmpty && <CloseIcon sx={{ color: "red", ml: 1 }} />} */}
                  </Typography>
                </FormLabel>
                <Box sx={{ mt: 1 }}>
                  {/* <Grid container spacing={2}> */}
                  <RadioGroup>
                    {question.a !== null && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          alignContent: "center",
                          mb: 1,
                        }}
                      >
                        <FormControlLabel
                          value={question.a}
                          control={<Radio />}
                          label={question.a}
                          checked={
                            formik.values.answers[qIndex]?.selected_option ===
                            "a"
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              `answers[${qIndex}].selected_option`,
                              "a"
                            );
                            formik.setFieldValue(
                              `answers[${qIndex}].question_id`,
                              question.id
                            );
                          }}
                        />
                      </Box>
                    )}
                    {question.b !== null && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <FormControlLabel
                          value={question.b}
                          control={<Radio />}
                          label={question.b}
                          checked={
                            formik.values.answers[qIndex]?.selected_option ===
                            "b"
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              `answers[${qIndex}].selected_option`,
                              "b"
                            );
                            formik.setFieldValue(
                              `answers[${qIndex}].question_id`,
                              question.id
                            );
                          }}
                        />
                      </Box>
                    )}
                    {question.c !== null && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <FormControlLabel
                          value={question.c}
                          control={<Radio />}
                          label={question.c}
                          checked={
                            formik.values.answers[qIndex]?.selected_option ===
                            "c"
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              `answers[${qIndex}].selected_option`,
                              "c"
                            );
                            formik.setFieldValue(
                              `answers[${qIndex}].question_id`,
                              question.id
                            );
                          }}
                        />
                      </Box>
                    )}
                    {question.d !== null && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <FormControlLabel
                          value={question.d}
                          control={<Radio />}
                          label={question.d}
                          checked={
                            formik.values.answers[qIndex]?.selected_option ===
                            "d"
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              `answers[${qIndex}].selected_option`,
                              "d"
                            );
                            formik.setFieldValue(
                              `answers[${qIndex}].question_id`,
                              question.id
                            );
                          }}
                        />
                      </Box>
                    )}
                    {question.e !== null && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                        }}
                      >
                        <FormControlLabel
                          value={question.e}
                          control={<Radio />}
                          label={question.e}
                          checked={
                            formik.values.answers[qIndex]?.selected_option ===
                            "e"
                          }
                          onChange={() => {
                            formik.setFieldValue(
                              `answers[${qIndex}].selected_option`,
                              "e"
                            );
                            formik.setFieldValue(
                              `answers[${qIndex}].question_id`,
                              question.id
                            );
                          }}
                        />
                      </Box>
                    )}
                  </RadioGroup>
                  {/* </Grid> */}
                </Box>
                {qIndex < quizList.length - 1 && <Divider sx={{ my: 3 }} />}
              </Box>
            ))}
            <Box
              sx={{
                mt: 3,
                display: "flex",
                justifyContent: "end",
              }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  formik.values.answers.length !== (quizList.length as number)
                }
              >
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default QuizPreview;
