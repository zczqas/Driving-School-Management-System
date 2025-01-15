import CustomDialog from "@/components/CustomDialog";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import {
  createCourseQuestion,
  deleteCourseQuestion,
  fetchCourseQuiz,
  updateCourseQuestion,
} from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import { QuizQuestionType } from "@/types/unit";
import { Add as AddIcon, Close as CloseIcon } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";
import * as Yup from "yup";

interface QuestionOption {
  id: string;
  text: string;
}

const AddOrEditQuizView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>();

  // quizList
  const { quizListLoading } = useAppSelector(
    (state: IRootState) => state.course.courseQuiz
  );
  const {
    quizQuestions,
    sectionMenu,
    courseQuestion: { deleteQuestionLoading },
  } = useAppSelector((state: IRootState) => state.course);

  const attempts = ["Unlimited", "1 Attempt", "2 Attempts", "3 Attempts"];
  const actionOnAttempts = ["Immediate", "After all attempts"];

  interface FormValues {
    attemptsAllowed: string;
    actionOnAttempt: string;
    questions: QuizQuestionType[];
  }

  const formik = useFormik<FormValues>({
    enableReinitialize: true,
    validateOnChange: true,
    validateOnMount: true,
    initialValues: {
      attemptsAllowed: attempts[0],
      actionOnAttempt: actionOnAttempts[0],
      questions: quizQuestions,
    },
    validationSchema: Yup.object().shape({
      attemptsAllowed: Yup.string().required("Allowed attempts is required"),
      actionOnAttempt: Yup.string().required("Action on attempt is required"),
      questions: Yup.array().of(
        Yup.object().shape({
          question: Yup.string().required("Question is required"),
          // type: Yup.string().required("Question type is required"),
          a: Yup.string().required("Option A is required"),
          b: Yup.string().required("Option B is required"),
          c: Yup.string().notRequired(),
          d: Yup.string().notRequired(),
          e: Yup.string().notRequired(),
          correct_answer: Yup.string().required("Correct answer is required"),
          image: Yup.string().notRequired(),
          unit_id: Yup.number().required("Unit ID is required"),
          is_active: Yup.boolean().notRequired(),
        })
      ),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleAutocompleteChange = (
    event: React.SyntheticEvent,
    fieldname: string,
    value: string | null
  ) => {
    formik.setFieldValue(fieldname, value);
  };

  const handleRemoveOption = (qIndex: number, oIndex: number) => {
    const optionKeys: Array<
      keyof Pick<QuizQuestionType, "a" | "b" | "c" | "d" | "e">
    > = ["a", "b", "c", "d", "e"];

    const updatedQuestion = { ...formik.values.questions[qIndex] };

    // Shift values up from the removed option
    for (let i = oIndex; i < optionKeys.length - 1; i++) {
      updatedQuestion[optionKeys[i]] = updatedQuestion[optionKeys[i + 1]];
    }

    // Set the last option to null
    updatedQuestion[optionKeys[optionKeys.length - 1]] = null;

    // If the correct answer was the removed option or a shifted option, reset it
    if (updatedQuestion.correct_answer) {
      const correctAnswerIndex = optionKeys.indexOf(
        updatedQuestion.correct_answer as any
      );
      if (correctAnswerIndex >= oIndex) {
        updatedQuestion.correct_answer = null;
      }
    }

    formik.setFieldValue("questions", [
      ...formik.values.questions.map((question, index) =>
        index === qIndex ? updatedQuestion : question
      ),
    ]);
  };

  const handleQuestionChange = (type: "add" | "remove", index?: number) => {
    if (type === "add") {
      formik.setFieldValue("questions", [
        ...formik.values.questions,
        {
          question: "",
          a: "",
          b: "",
          c: null,
          d: null,
          e: null,
          correct_answer: null,
          image: "",
          unit_id: sectionMenu?.unitId,
          is_active: true,
        },
      ]);
    } else {
      // dispatch({
      //   type: CourseActionTypes.SET_QUIZ_QUESTION,
      //   payload: quizQuestions.filter((_, i) => i !== index),
      // });
      formik.setFieldValue("questions", [
        ...formik.values.questions.filter((_, i) => i !== index),
      ]);
    }
  };

  const handleOptionChange = (qIndex: number) => {
    const options: Array<
      keyof Pick<QuizQuestionType, "a" | "b" | "c" | "d" | "e">
    > = ["a", "b", "c", "d", "e"];
    const nullOption = options.find(
      (key) => formik.values.questions[qIndex][key] === null
    );

    if (nullOption) {
      // const newQuestions = quizQuestions.map((question, index) =>
      //   index === qIndex ? { ...question, [nullOption]: "" } : question
      // );
      // dispatch({
      //   type: CourseActionTypes.SET_QUIZ_QUESTION,
      //   payload: newQuestions,
      // });
      formik.setFieldValue(`questions[${qIndex}].${nullOption}`, "");
    } else {
      dispatch(openAlert("Maximum of 5 options allowed", "error"));
    }
  };

  const isQuestionError = (qIndex: number, field: keyof QuizQuestionType) => {
    return (
      formik.touched.questions?.[qIndex]?.[field] &&
      typeof formik.errors.questions?.[qIndex] === "object" &&
      field in (formik.errors.questions[qIndex] as object)
    );
  };

  function handleDeleteQuiz(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  console.log("FORMIK ERROR:" + JSON.stringify(formik.errors, null, 2));

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={quizListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CustomDialog
        loading={deleteQuestionLoading}
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteCourseQuestion(deleteId, () => {
                // update the quiz question
                setDeleteDialog(false);
                dispatch(fetchCourseQuiz(sectionMenu?.unitId!));
              })
            );
          } else {
            setDeleteDialog(false);
          }
        }}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Question"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this question?</h4>
        </Box>
      </CustomDialog>
      <Box
        sx={{
          padding: 2,
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ mb: 3 }}>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <CustomLabel shrink htmlFor="unit-purpose">
                      Number of attempts allowed
                    </CustomLabel>
                    <Autocomplete
                      fullWidth
                      id="try-options"
                      options={attempts}
                      getOptionLabel={(attempt) => attempt}
                      isOptionEqualToValue={(option, value) => option === value}
                      filterSelectedOptions={false}
                      sx={{ mt: 3 }}
                      onChange={(event, value) => {
                        handleAutocompleteChange(
                          event,
                          "attemptsAllowed",
                          value
                        );
                      }}
                      value={formik.values.attemptsAllowed}
                      renderInput={(params) => (
                        <Box display="flex" alignItems="center">
                          <TextField
                            {...params}
                            placeholder="Select Attempts Option"
                            sx={{
                              "& .MuiInputBase-input": {
                                fontSize: "16px",
                                fontWeight: 500,
                              },
                              "& fieldset": {
                                borderRadius: 2,
                                border: "1px solid #E0E3E7",
                                transition: "all 0.3s ease-in-out",
                              },
                            }}
                          />
                        </Box>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={6}>
                  <FormControl variant="standard" sx={{ width: "100%" }}>
                    <CustomLabel shrink htmlFor="unit-purpose">
                      Action on attempt result
                    </CustomLabel>
                    <Autocomplete
                      fullWidth
                      id="try-options"
                      options={actionOnAttempts}
                      getOptionLabel={(attemptAction) => attemptAction}
                      isOptionEqualToValue={(option, value) => option === value}
                      filterSelectedOptions
                      sx={{ mt: 3 }}
                      onChange={(event, value) => {
                        handleAutocompleteChange(
                          event,
                          "actionOnAttempt",
                          value
                        );
                      }}
                      value={formik.values.actionOnAttempt}
                      renderInput={(params) => (
                        <Box display="flex" alignItems="center">
                          <TextField
                            {...params}
                            placeholder="Select Attempts Action"
                            sx={{
                              "& .MuiInputBase-input": {
                                fontSize: "16px",
                                fontWeight: 500,
                              },
                              "& fieldset": {
                                borderRadius: 2,
                                border: "1px solid #E0E3E7",
                                transition: "all 0.3s ease-in-out",
                              },
                            }}
                          />
                        </Box>
                      )}
                    />
                  </FormControl>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                      display: "block",
                      textAlign: "right",
                    }}
                  >
                    100% pass required to advance.
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Typography variant="h6" sx={{ mb: 2 }}>
            Questions
          </Typography>
          <Box sx={{ mb: 3, maxHeight: "54vh", overflowY: "auto" }}>
            {formik.values?.questions?.length === 0 ? (
              <Box
                sx={{
                  textAlign: "center",
                  width: "100%",
                  display: "flex",
                  height: "54vh",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="textSecondary">
                  No questions added yet
                </Typography>
              </Box>
            ) : (
              formik.values.questions.map(
                (question: QuizQuestionType, qIndex: number) => (
                  <Paper
                    key={qIndex}
                    elevation={2}
                    // draggable
                    sx={{ p: 2, m: 2, borderRadius: 2 }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <FormControl
                          variant="standard"
                          sx={{ width: "100%" }}
                          error={isQuestionError(qIndex, "question")}
                        >
                          <CustomLabel
                            shrink
                            htmlFor={`unit-question-${qIndex}`}
                          >
                            Question
                          </CustomLabel>
                          <CustomInput
                            id={`unit-question-${qIndex}`}
                            sx={{
                              "& .MuiInputBase-input": {
                                borderRadius: 2,
                                border: "1px solid #E0E3E7",
                                transition: "all 0.3s ease-in-out",
                              },
                            }}
                            type="text"
                            placeholder="Enter question"
                            {...formik.getFieldProps(
                              `questions[${qIndex}].question`
                            )}
                          />
                        </FormControl>
                      </Grid>
                      {/* <Grid item xs={12} md={4}>
                    <FormControl variant="standard" sx={{ width: "100%" }}>
                      <CustomLabel shrink htmlFor="unit-purpose">
                        Question Type
                      </CustomLabel>
                      <Autocomplete
                        fullWidth
                        id="question-type"
                        options={["Multiple Choice", "True/False"]}
                        getOptionLabel={(qtype) => qtype}
                        isOptionEqualToValue={(qtype, value) => qtype === value}
                        filterSelectedOptions
                        sx={{ mt: 3 }}
                        onChange={(event, value) => {
                          handleQuestionTypeChange(qIndex, value);
                        }}
                        value={formik.values.questions[qIndex].type}
                        renderInput={(params) => (
                          <Box display="flex" alignItems="center">
                            <TextField
                              {...params}
                              placeholder="Select Question Type"
                              sx={{
                                "& .MuiInputBase-input": {
                                  fontSize: "16px",
                                  fontWeight: 500,
                                },
                                "& fieldset": {
                                  borderRadius: 2,
                                  border: "1px solid #E0E3E7",
                                  transition: "all 0.3s ease-in-out",
                                },
                              }}
                            />
                          </Box>
                        )}
                      />
                    </FormControl>
                  </Grid> */}
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                      {/* <Grid container spacing={2}> */}
                      <RadioGroup>
                        {question.a !== null && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <FormControlLabel
                              value={question.a}
                              control={<Radio />}
                              label=""
                              checked={
                                formik.values.questions[qIndex]
                                  ?.correct_answer === "a"
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `questions[${qIndex}].correct_answer`,
                                  "a"
                                )
                              }
                            />
                            <TextField
                              error={isQuestionError(qIndex, "a")}
                              {...formik.getFieldProps(
                                `questions[${qIndex}].a`
                              )}
                              placeholder="Option A"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                            <IconButton
                              onClick={() => handleRemoveOption(qIndex, 0)}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
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
                              label=""
                              checked={
                                formik.values.questions[qIndex]
                                  ?.correct_answer === "b"
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `questions[${qIndex}].correct_answer`,
                                  "b"
                                )
                              }
                            />
                            <TextField
                              error={isQuestionError(qIndex, "b")}
                              {...formik.getFieldProps(
                                `questions[${qIndex}].b`
                              )}
                              placeholder="Option B"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                            <IconButton
                              onClick={() => handleRemoveOption(qIndex, 1)}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
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
                              label=""
                              checked={
                                formik.values.questions[qIndex]
                                  ?.correct_answer === "c"
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `questions[${qIndex}].correct_answer`,
                                  "c"
                                )
                              }
                            />
                            <TextField
                              {...formik.getFieldProps(
                                `questions[${qIndex}].c`
                              )}
                              placeholder="Option C"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                            <IconButton
                              onClick={() => handleRemoveOption(qIndex, 2)}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
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
                              label=""
                              checked={
                                formik.values.questions[qIndex]
                                  ?.correct_answer === "d"
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `questions[${qIndex}].correct_answer`,
                                  "d"
                                )
                              }
                            />
                            <TextField
                              {...formik.getFieldProps(
                                `questions[${qIndex}].d`
                              )}
                              placeholder="Option D"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                            <IconButton
                              onClick={() => handleRemoveOption(qIndex, 3)}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
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
                              value={formik.values.questions[qIndex]?.e}
                              control={<Radio />}
                              label=""
                              checked={
                                formik.values.questions[qIndex]
                                  ?.correct_answer === "e"
                              }
                              onChange={() =>
                                formik.setFieldValue(
                                  `questions[${qIndex}].correct_answer`,
                                  "e"
                                )
                              }
                            />
                            <TextField
                              {...formik.getFieldProps(
                                `questions[${qIndex}].e`
                              )}
                              placeholder="Option E"
                              variant="outlined"
                              fullWidth
                              size="small"
                            />
                            <IconButton
                              onClick={() => handleRemoveOption(qIndex, 4)}
                              size="small"
                            >
                              <CloseIcon />
                            </IconButton>
                          </Box>
                        )}
                      </RadioGroup>
                      {/* </Grid> */}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                        mt: 2,
                      }}
                    >
                      <Button
                        variant="text"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={() => handleOptionChange(qIndex)}
                      >
                        Add Option
                      </Button>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mt: 2,
                        }}
                      >
                        <IconButton
                          aria-label="delete"
                          size="medium"
                          onClick={() => {
                            if (
                              formik.values.questions[qIndex].id !== undefined
                            ) {
                              setDeleteId(formik.values.questions[qIndex]?.id!);
                              setDeleteDialog(true);
                              // dispatch(
                              //   deleteCourseQuestion(
                              //     formik.values.questions[qIndex]?.id!,
                              //     () => {
                              //       // update the quiz question
                              //       dispatch(
                              //         fetchCourseQuiz(sectionMenu?.unitId!)
                              //       );
                              //     }
                              //   )
                              // );
                            } else {
                              handleQuestionChange("remove", qIndex);
                            }
                          }}
                        >
                          <DeleteIcon
                            fontSize="medium"
                            sx={{
                              color: "#f44336",
                            }}
                          />
                        </IconButton>
                        <IconButton
                          aria-label="save"
                          size="medium"
                          onClick={() => {
                            if (
                              isQuestionError(qIndex, "question") ||
                              isQuestionError(qIndex, "a") ||
                              isQuestionError(qIndex, "b") ||
                              isQuestionError(qIndex, "correct_answer")
                            ) {
                              dispatch(
                                openAlert(
                                  "Please fill all required fields",
                                  "error"
                                )
                              );
                            } else {
                              if (
                                formik.values.questions[qIndex]
                                  .correct_answer === null
                              ) {
                                dispatch(
                                  openAlert(
                                    "Please select the correct answer",
                                    "error"
                                  )
                                );
                                return;
                              }
                              if (
                                formik.values.questions[qIndex].id !== undefined
                              ) {
                                // update the quiz question
                                console.log("updateCourseQuestion");
                                dispatch(
                                  updateCourseQuestion(
                                    formik.values.questions[qIndex].id!,
                                    formik.values.questions[qIndex],
                                    () => {
                                      // update the quiz question
                                      if (sectionMenu?.unitId !== undefined) {
                                        dispatch(
                                          fetchCourseQuiz(sectionMenu.unitId)
                                        );
                                      }
                                    }
                                  )
                                );
                              } else {
                                // create the quiz question
                                dispatch(
                                  createCourseQuestion(
                                    [formik.values.questions[qIndex]],
                                    () => {
                                      // update the quiz question
                                      if (sectionMenu?.unitId !== undefined) {
                                        dispatch(
                                          fetchCourseQuiz(sectionMenu.unitId)
                                        );
                                      }
                                    }
                                  )
                                );
                              }
                            }
                          }}
                        >
                          <SaveIcon
                            fontSize="medium"
                            sx={{
                              color: "#4caf50",
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                )
              )
            )}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              gap: 2,
            }}
          >
            <Button
              variant="text"
              color="primary"
              sx={{
                mt: 3,
              }}
              onClick={() => handleQuestionChange("add")}
            >
              <AddIcon />
              Add Another Question
            </Button>
          </Box>
          {/* <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            type="submit"
            sx={{
              textTransform: "none",
              backgroundColor: "#673ab7",
              color: "#fff",
              "&:hover": { backgroundColor: "#5e35b1" },
            }}
          >
            Add New Unit
          </Button> */}
        </form>
      </Box>
    </Fragment>
  );
};

export default AddOrEditQuizView;
