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
  fetchUnitQuizById,
  submitUnitQuiz,
} from "@/store/driverEd/driver.actions";
import IRootState from "@/store/interface";
import CloseIcon from "@mui/icons-material/Close";

const UnitQuiz: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const unitId = router.query.slug as string; // Ensure unitId is treated as string

  // Extract necessary state from the Redux store
  const {
    unitQuizById,
    unitQuizByIdLoading,
    unitQuizSubmitLoading,
    unitQuizSubmitSuccess,
  } = useAppSelector((state: IRootState) => state.driver);

  // Local state to manage form data and submission status
  const [formData, setFormData] = useState<
    { question_id: number; selected_option: string }[]
  >([]);
  const [submitted, setSubmitted] = useState(false);

  // Fetch quiz data when the unitId changes
  useEffect(() => {
    if (unitId) {
      dispatch(fetchUnitQuizById(unitId));
      setFormData([]); // Reset form data
      setSubmitted(false); // Reset submission status
    }
  }, [unitId, dispatch]);

  // Handle successful quiz submission
  useEffect(() => {
    if (unitQuizSubmitSuccess) {
      setSubmitted(true);
    }
  }, [unitQuizSubmitSuccess]);

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

  // Submit the quiz
  const handleSubmit = () => {
    dispatch(submitUnitQuiz(unitId, formData));
  };

  // Navigate to the final exam if the current URL is /manage/drivers-ed/unit-quiz/10
  const handleNextUnit = () => {
    if (unitId === "10") {
      router.push("/manage/drivers-ed/final-exam");
    } else {
      const nextUnitId = (parseInt(unitId, 10) + 1).toString();
      router.push(`/manage/drivers-ed/lessons/1?unitId=${nextUnitId}`);
    }
  };

  // Allow the user to try the quiz again
  const handleTryAgain = () => {
    setFormData([]);
    setSubmitted(false);
    dispatch(fetchUnitQuizById(unitId));
  };

  // Display loading spinner if the quiz data or submission is loading
  if (unitQuizByIdLoading || unitQuizSubmitLoading) {
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
          {unitQuizById?.unit?.title}
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

        {/* Check if the quiz is already passed */}
        {unitQuizById?.unit?.is_passed ? (
          <Box textAlign="center" sx={{ py: 3 }}>
            <Typography sx={{ fontSize: "20px", color: "orange" }}>
              You have already passed this exam.
            </Typography>
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
                onClick={handleNextUnit}
              >
                Next
              </Button>
            </Box>
          </Box>
        ) : submitted ? (
          // Show quiz result if submitted
          <Box>
            <Typography variant="h6" align="center" gutterBottom>
              Your Score: {unitQuizSubmitSuccess.marks}/
              {unitQuizSubmitSuccess.total_questions} (
              {unitQuizSubmitSuccess.percentage}%)
            </Typography>
            <Typography
              variant="body1"
              align="center"
              color="error"
              gutterBottom
            >
              {unitQuizSubmitSuccess.percentage >= 80
                ? "Congratulations, you passed the quiz!"
                : "Sorry, you need to go back and try again."}
            </Typography>
            {unitQuizById.data.map((question: any, index: number) => {
              const selectedOption = formData.find(
                (item) => item.question_id === question.id
              )?.selected_option;

              const isIncorrect =
                unitQuizSubmitSuccess.incorrect_questions.includes(
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
                            label={`${option}) ${question[`option_${option}`]}`}
                            sx={{
                              color: isIncorrect ? "red" : "inherit",
                            }}
                          />
                        );
                      }
                      return null;
                    })}
                  </RadioGroup>
                  {index < unitQuizById.data.length - 1 && (
                    <Divider sx={{ my: 3 }} />
                  )}
                </Box>
              );
            })}
            <Box mt={4} display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
                onClick={handlePreviousClick}
              >
                Previous
              </Button>
              {unitQuizSubmitSuccess.remarks === "PASS" ? (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
                  onClick={handleNextUnit}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ borderRadius: "20px", width: "120px", padding: "10px" }}
                  onClick={handleTryAgain}
                >
                  Try Again
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          // Display quiz questions if not submitted
          <FormControl component="fieldset" sx={{ width: "100%" }}>
            {unitQuizById?.data?.map((question: any, index: number) => (
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
                {index < unitQuizById.data.length - 1 && (
                  <Divider sx={{ my: 3 }} />
                )}
              </Box>
            ))}

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
          </FormControl>
        )}
      </Box>
    </Container>
  );
};

export default UnitQuiz;
