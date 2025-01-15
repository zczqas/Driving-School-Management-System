import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchFinalExam,
  submitFinalExam,
} from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";
import CloseIcon from "@mui/icons-material/Close";

const FinalExam: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Extract necessary state from the Redux store
  const {
    finalExam,
    finalExamLoading,
    finalExamSubmitLoading,
    finalExamSubmitSuccess,
  } = useAppSelector((state: IRootState) => state.driver);

  // Local state to manage form data and submission status
  const [formData, setFormData] = useState<
    { question_id: number; selected_option: string }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch quiz data on component mount
  useEffect(() => {
    dispatch(fetchFinalExam());
    setFormData([]); // Reset form data
    setSubmitted(false); // Reset submission status
  }, [dispatch]);

  // Handle successful quiz submission
  useEffect(() => {
    if (finalExamSubmitSuccess) {
      setSubmitted(true);
    }
  }, [finalExamSubmitSuccess]);

  // Navigate back to the previous page
  const handlePreviousClick = () => {
    router.back();
  };

  // Update form data when an option is selected
  const handleOptionChange = (questionId: number, selectedOption: string) => {
    setFormData((prev) => {
      const existing = prev.find((item) => item.question_id === questionId);
      if (existing) {
        return prev.map((item) =>
          item.question_id === questionId
            ? { ...item, selected_option: selectedOption }
            : item
        );
      } else {
        return [
          ...prev,
          { question_id: questionId, selected_option: selectedOption },
        ];
      }
    });
  };

  // Submit the final exam
  const handleSubmit = () => {
    dispatch(submitFinalExam(formData));
  };

  // Navigate to the next unit's first lesson
  const handleNextUnit = () => {
    router.push("/manage/drivers-ed/lessons/1");
  };

  // Navigate to the drivers-ed management page
  const handleFinish = () => {
    router.push("/manage/drivers-ed");
  };

  // Allow the user to try the exam again
  const handleTryAgain = () => {
    setFormData([]);
    setSubmitted(false);
    dispatch(fetchFinalExam());
  };

  // Display loading spinner if the quiz data or submission is loading
  if (finalExamLoading || finalExamSubmitLoading) {
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
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "24px",
            color: "rgba(79, 91, 103, 1)",
          }}
          align="center"
          gutterBottom
        >
          Final Exam
        </Typography>

        {/* Display quiz questions */}
        <FormControl component="fieldset" sx={{ width: "100%" }}>
          {submitted
            ? finalExamSubmitSuccess && (
                <>
                  <Typography variant="h6" align="center" gutterBottom>
                    Your Score: {finalExamSubmitSuccess.marks}/
                    {finalExamSubmitSuccess.total_questions} (
                    {finalExamSubmitSuccess.percentage}%)
                  </Typography>
                  <Typography
                    variant="body1"
                    align="center"
                    color="error"
                    gutterBottom
                  >
                    {finalExamSubmitSuccess.percentage >= 80
                      ? "Congratulations, you passed the quiz!"
                      : "Sorry, you need to go back and try again."}
                  </Typography>
                  {finalExam.map((question: any, index: number) => {
                    const selectedOption = formData.find(
                      (item) => item.question_id === question.id
                    )?.selected_option;

                    const isIncorrect =
                      finalExamSubmitSuccess.incorrect_questions.includes(
                        question.id
                      ) && selectedOption;
                    const isEmpty = !selectedOption;

                    return (
                      <Box key={index} sx={{ mt: 3 }}>
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
                            {index + 1}) {question.question}
                            {(isIncorrect || isEmpty) && (
                              <CloseIcon sx={{ color: "red", ml: 1 }} />
                            )}
                          </Typography>
                        </FormLabel>
                        <RadioGroup value={selectedOption || ""}>
                          {["a", "b", "c", "d", "e"].map((option) => {
                            if (question[`option_${option}`]) {
                              return (
                                <FormControlLabel
                                  key={option}
                                  value={option}
                                  control={<Radio disabled />}
                                  label={`${option}) ${
                                    question[`option_${option}`]
                                  }`}
                                  sx={{
                                    color: isIncorrect ? "red" : "inherit",
                                  }}
                                />
                              );
                            }
                            return null;
                          })}
                        </RadioGroup>
                        {index < finalExam.length - 1 && (
                          <Divider sx={{ my: 3 }} />
                        )}
                      </Box>
                    );
                  })}
                  <Box mt={4} display="flex" justifyContent="space-between">
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: "20px",
                        width: "120px",
                        padding: "10px",
                      }}
                      onClick={handlePreviousClick}
                    >
                      Previous
                    </Button>
                    {finalExamSubmitSuccess.percentage >= 80 ? (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: "20px",
                          width: "120px",
                          padding: "10px",
                        }}
                        onClick={handleFinish}
                      >
                        Finish
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: "20px",
                          width: "120px",
                          padding: "10px",
                        }}
                        onClick={handleTryAgain}
                      >
                        Try Again
                      </Button>
                    )}
                  </Box>
                </>
              )
            : finalExam.map((question: any, index: number) => (
                <Box sx={{ mt: 3 }} key={index}>
                  <FormLabel component="legend">
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ paddingBottom: "10px" }}
                    >
                      {index + 1}) {question.question}
                    </Typography>
                  </FormLabel>
                  <RadioGroup
                    value={
                      formData.find((item) => item.question_id === question.id)
                        ?.selected_option || ""
                    }
                    onChange={(e) =>
                      handleOptionChange(question.id, e.target.value)
                    }
                  >
                    {["a", "b", "c", "d", "e"].map((option) => {
                      if (question[`option_${option}`]) {
                        return (
                          <FormControlLabel
                            key={option}
                            value={option}
                            control={<Radio />}
                            label={`${option}) ${question[`option_${option}`]}`}
                          />
                        );
                      }
                      return null;
                    })}
                  </RadioGroup>
                  {index < finalExam.length - 1 && <Divider sx={{ my: 3 }} />}
                </Box>
              ))}
        </FormControl>

        {!submitted && (
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
              onClick={handlePreviousClick}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
              onClick={handleSubmit}
            >
              Submit Test!
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default FinalExam;
