import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  TextField,
} from "@mui/material";
import {
  Form,
  Formik,
  FormikConfig,
  FormikHandlers,
  FormikHelpers,
  FormikValues,
} from "formik";
import React, { useState } from "react";
import FormNavigation from "./FormNavigation";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { styled } from "@mui/material/styles";
import { StepIconProps } from "@mui/material/StepIcon";
import Check from "@mui/icons-material/Check";

//inheriting props from Formik with generic formik values ForikValues representing hte values of the form fileds
interface Props extends FormikConfig<FormikValues> {
  children: React.ReactNode;
}

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
      borderWidth: 9,
      borderRadius: 2,
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#784af4",
      borderWidth: 9,
      borderRadius: 2,
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
  // Increase the width of inactive horizontal lines
  [`&.${stepConnectorClasses.disabled}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      marginTop: 2,
    },
  },
}));

function QontoStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
  ({ theme, ownerState }) => ({
    color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
    display: "flex",
    height: 22,
    alignItems: "center",
    ...(ownerState.active && {
      color: "#784af4",
    }),
    "& .QontoStepIcon-completedIcon": {
      color: "#784af4",
      zIndex: 1,
      fontSize: 28,
      marginTop: "5px",
      marginRight: "15px",
      marginLeft: "15px",
    },
    "& .QontoStepIcon-circle": {
      width: 15,
      height: 15,
      borderRadius: "50%",
      marginTop: "5px",
      backgroundColor: "currentColor",
      marginRight: "5px",
      marginLeft: "5px",
    },
  })
);

//onsubmit, initialVaues come from FormikConfig
const MultiStepForm = ({ children, initialValues, onSubmit }: Props) => {
  const [stepNumber, setStepNumber] = useState(0);

  const [snapshot, setSnapshot] = useState(initialValues);

  //taking all the form steps and putting them in an array so that we can dispay them one step at a time
  const steps = React.Children.toArray(children) as React.ReactElement[];
  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: FormikValues) => {
    setSnapshot(values);
    setStepNumber(stepNumber + 1);
  };

  const previous = (values: FormikValues) => {
    setSnapshot(values);
    setStepNumber(stepNumber - 1);
  };

  const handleSubmit = async (
    values: FormikValues,
    actions: FormikHelpers<FormikValues>
  ) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values);
    }

    if (isLastStep) {
      return onSubmit(values, actions);
    } else {
      //everytime we go from one page/form to antoerh it resets the touched inputs
      //basically a clean slate
      actions.setTouched({});
      next(values);
    }
  };

  return (
    <Box sx={{}}>
      <Formik
        validationSchema={step.props.validationSchema}
        initialValues={snapshot}
        onSubmit={handleSubmit}
      >
        {(formik) => (
          //   <form onSubmit={formik.handleSubmit}>
          //we can see Form from formik will abstract away functionalies like onSubmit of react
          <Form style={{ width: "100%", }}>
            <Stepper
              style={{ width: "100%", marginBottom: "90px" }}
              alternativeLabel
              activeStep={stepNumber}
              connector={<QontoConnector />}
            >
              {steps.map((currentStep) => {
                const label = currentStep.props.stepName;
                return (
                  <Step key={label}>
                    <StepLabel StepIconComponent={QontoStepIcon}>
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {step}
            <FormNavigation
              isLastStep={isLastStep}
              hasPrevious={stepNumber > 0}
              onBackClick={() => previous(formik.values)}
            />
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MultiStepForm;

export const FormStep = ({ stepName = "", children }: any) => children;
