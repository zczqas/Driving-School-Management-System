import { Fragment, useState } from "react";

import Image from "next/image";

// third party
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { ErrorMessage, Field, Formik } from "formik";
import * as Yup from "yup";
import OtpInput from "react-otp-input";

import { useAppDispatch } from "@/hooks";
import {
  forgetPasswordReset,
  login,
  resetPassword,
  verifyOTP,
} from "@/store/auth/auth.actions";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { CustomInput, CustomLabel } from "../components/CustomInput";
import { useRouter } from "next/router";
import _ from "lodash";

// ============================|| RESET PASSWORD COMPONENT ||============================ //
const ResetPasswordView = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <Formik
        initialValues={{
          email: "",
          password: "",
          confirmPassword: "",
          otp: "",
          activeStep: 1,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string()
            .required("Password is required")
            .min(5, "Your password is too short.")
            .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
          confirmPassword: Yup.string().oneOf(
            [Yup.ref("password")],
            "Passwords must match"
          ),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, setFieldValue }
        ) => {
          try {
            const formData = {
              otp: values?.otp,
              new_password: values?.password,
              confirm_password: values?.password,
            };

            if (values?.activeStep == 3) {
              dispatch(
                resetPassword(formData, () => {
                  router.push("/login");
                })
              );
            }
          } catch (err) {
            setStatus({ success: false });
            setSubmitting(false);
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          touched,
          values,
        }) => {
          const renderStepInput = (activeStep: any) => {
            switch (activeStep) {
              case 1:
                return (
                  <Fragment>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.email && errors.email)}
                    >
                      <CustomLabel shrink htmlFor="email-login">
                        Enter Your Email
                      </CustomLabel>
                      <CustomInput
                        id="email-login"
                        type="email"
                        value={values.email}
                        name="email"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        inputProps={{}}
                      />
                      {touched.email && errors.email && (
                        <FormHelperText
                          error
                          id="standard-weight-helper-text-email-login"
                        >
                          {errors.email}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <Button
                      disableElevation
                      disabled={
                        _.isEmpty(values?.email) || _.isString(errors?.email)
                      }
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        dispatch(
                          forgetPasswordReset(values?.email, () => {
                            setFieldValue("activeStep", 2);
                          })
                        );
                      }}
                      sx={{
                        borderRadius: "100px",
                        padding: "12px 0",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Continue
                    </Button>
                  </Fragment>
                );

              case 2:
                return (
                  <Fragment>
                    <Box
                      sx={{
                        width: "100%",
                        "& > div": {
                          gap: "16px",
                          justifyContent: "center",
                        },
                      }}
                    >
                      <OtpInput
                        value={values.otp}
                        onChange={(otp) => {
                          handleChange("otp")(otp);
                        }}
                        numInputs={4}
                        renderInput={(props) => <input {...props} />}
                        inputStyle={{
                          height: "52px",
                          width: "58px",
                          borderRadius: "20px",
                          border: "1px solid #00000026",
                          color: "#242D35",
                          fontSize: "24px",
                          fontWeight: 700,
                          lineHeight: "32.68px",
                          textAlign: "center",
                        }}
                      />

                      <ErrorMessage
                        name="otp"
                        component="div"
                        className="error"
                      />
                    </Box>

                    <Button
                      disableElevation
                      disabled={values?.otp?.length !== 4}
                      fullWidth
                      size="large"
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        dispatch(
                          verifyOTP(values?.otp, () => {
                            setFieldValue("activeStep", 3);
                          })
                        );
                      }}
                      sx={{
                        borderRadius: "100px",
                        padding: "12px 0",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Verify
                    </Button>
                  </Fragment>
                );

              case 3:
                return (
                  <Fragment>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.password && errors.password)}
                    >
                      <CustomLabel shrink htmlFor="new-password">
                        Enter New Password
                      </CustomLabel>
                      <CustomInput
                        id="new-password"
                        type="password"
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="password">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <FormControl
                      variant="standard"
                      error={Boolean(
                        touched.confirmPassword && errors.confirmPassword
                      )}
                    >
                      <CustomLabel shrink htmlFor="confirm-password">
                        Confirm Password
                      </CustomLabel>
                      <CustomInput
                        id="confirm-password"
                        type="password"
                        value={values.confirmPassword}
                        name="confirmPassword"
                        onBlur={handleBlur}
                        onChange={handleChange}
                      />
                      {touched.confirmPassword && errors.confirmPassword && (
                        <FormHelperText error id="confirmPassword">
                          {errors.confirmPassword}
                        </FormHelperText>
                      )}
                    </FormControl>

                    <Button
                      disableElevation
                      disabled={isSubmitting}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{
                        borderRadius: "100px",
                        padding: "12px 0",
                        textTransform: "none",
                        fontSize: "16px",
                        fontWeight: 700,
                      }}
                    >
                      Update Password
                    </Button>
                  </Fragment>
                );

              default:
                return null;
            }
          };
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems={"center"}>
                <Grid item md={6} xs={12}>
                  <Box
                    sx={{
                      height: "395px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <Image
                      src={"/assets/recoverBg.svg"}
                      alt="Drifing"
                      fill
                      priority
                    />
                  </Box>
                </Grid>
                <Grid item md={6} xs={12}>
                  <Container maxWidth={"xs"}>
                    <Box
                      sx={{
                        padding: (theme) => theme.spacing(4),
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                      }}
                    >
                      <Box sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h4"
                          sx={{
                            fontSize: "24px",
                            fontWeight: 700,
                            lineHeight: "normal",
                            pt: "13px",
                          }}
                          color="secondary"
                        >
                          {values?.activeStep == 1
                            ? "Forgot Password?"
                            : values?.activeStep == 2
                            ? "Verification"
                            : "New Password!"}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            letterSpacing: "0.24px",
                            fontSize: "12px",
                          }}
                        >
                          {values?.activeStep == 1
                            ? "No Worries! we will send you reset instruction"
                            : values?.activeStep == 2
                            ? "Enter your 4 digit code you received on your email"
                            : "Your new password must be different from previously used password"}
                        </Typography>
                      </Box>

                      <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

                      {renderStepInput(values?.activeStep)}

                      <Button
                        color="secondary"
                        variant="text"
                        startIcon={<ArrowBackRoundedIcon color="secondary" />}
                        sx={{
                          fontSize: "13px",
                          fontWeight: 600,
                          lineHeight: "16.34px",
                          "&:hover": {
                            background: "transparent",
                          },
                        }}
                        onClick={() => router.replace("/login")}
                      >
                        Back to Login
                      </Button>
                    </Box>
                  </Container>
                </Grid>
              </Grid>
            </form>
          );
        }}
      </Formik>
    </Box>
  );
};

export default ResetPasswordView;
