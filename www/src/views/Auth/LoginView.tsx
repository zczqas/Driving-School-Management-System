import React, { useEffect, useState } from "react";
import Image from "next/image";

// third party
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputBase,
  InputLabel,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Field, Formik } from "formik";
import * as Yup from "yup";

import { login } from "@/store/auth/auth.actions";
import { CustomInput, CustomLabel } from "./components";
import Link from "next/link";
import { useAppDispatch } from "@/hooks";
import { useRouter } from "next/router";

// ============================|| LOGIN COMPONENT ||============================ //
const LoginView = ({ tenantData }: { tenantData: any }) => {
  const [checked, setChecked] = useState(true);

  const dispatch = useAppDispatch();

  const router = useRouter();
  const { email } = router.query;
  const { fallbackUrl } = router.query;
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

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
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            dispatch(
              login(
                {
                  username: values.email.toLowerCase(),
                  password: values.password,
                },
                () => {
                  if (fallbackUrl) {
                    router.push(fallbackUrl.toString());
                  } else {
                    router.push("/manage");
                  }
                }
              )
            );
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
          touched,
          values,
          setFieldValue,
        }) => {
          // eslint-disable-next-line react-hooks/rules-of-hooks
          useEffect(() => {
            if (!!email) {
              setFieldValue("email", email);
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
          }, [setFieldValue, email]);
          return (
            <form noValidate onSubmit={handleSubmit}>
              <Grid container spacing={2} alignItems={"center"}>
                {!isMobile && (
                  <Grid item md={6} xs={12}>
                    <Box
                      sx={{
                        height: "395px",
                        width: "100%",
                        position: "relative",
                      }}
                    >
                      <Image
                        src={"/assets/loginCover.svg"}
                        alt="Drifing"
                        fill
                        priority
                      />
                    </Box>
                  </Grid>
                )}
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
                        <Image
                          src={tenantData?.logo ?? "/assets/logo.png"}
                          alt="logo"
                          height={52}
                          width={86}
                        />
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
                          Welcome Back!
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            letterSpacing: "0.24px",
                          }}
                        >
                          Login to your account
                        </Typography>
                      </Box>

                      <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />

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
                      </FormControl>

                      <FormControl
                        variant="standard"
                        error={Boolean(touched.password && errors.password)}
                      >
                        <CustomLabel shrink htmlFor="password-login">
                          Enter Your Password
                        </CustomLabel>
                        <CustomInput
                          id="password-login"
                          type={"password"}
                          value={values.password}
                          name="password"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                        />
                        {touched.password && errors.password && (
                          <FormHelperText
                            error
                            id="standard-weight-helper-text-password-login"
                          >
                            {errors.password}
                          </FormHelperText>
                        )}
                      </FormControl>

                      <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={(event) =>
                                setChecked(event.target.checked)
                              }
                              name="checked"
                              color="primary"
                            />
                          }
                          label="Remember me"
                        />
                        <Link
                          href="/recover"
                          style={{ textDecoration: "none" }}
                        >
                          <Typography
                            variant="subtitle1"
                            color="secondary"
                            sx={{
                              textDecoration: "none",
                              cursor: "pointer",
                              fontSize: "12px",
                              color: "#413B89",
                              fontWeight: 600,
                            }}
                          >
                            Recover Password
                          </Typography>
                        </Link>
                      </Stack>

                      <Box>
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
                          Login
                        </Button>
                      </Box>

                      <Box>
                        {" "}
                        <Typography
                          variant="body1"
                          sx={{
                            textAlign: "center",
                            fontSize: "12px",
                            fontWeight: 600,
                            lineHeight: "normal",
                            "& > span": {
                              color: (theme) => theme.palette.primary.main,
                            },
                          }}
                        >
                          Don’t have an account?{" "}
                          <Link
                            href="/signup"
                            style={{ textDecoration: "none" }}
                          >
                            <span>Register Now!</span>{" "}
                          </Link>
                        </Typography>
                      </Box>
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

export default LoginView;
