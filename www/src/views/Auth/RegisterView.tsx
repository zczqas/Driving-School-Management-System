import React from "react";
import Image from "next/image";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { register, login } from "@/store/auth/auth.actions";
import { CustomInput, CustomLabel } from "./components";
import Link from "next/link";
import { useRouter } from "next/router";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import { useAppSelector } from "@/hooks";

const RegisterView = () => {
  const phoneRegExp = /^\d{3}-\d{3}-\d{4}$/;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { tenantData } = useAppSelector((state) => state.tenant);
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
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          phoneNumber: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
          confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .max(255)
            .required("Confirm Password is required"),
          firstName: Yup.string().max(255).required("First Name is required"),
          lastName: Yup.string().max(255).required("Last Name is required"),
          phoneNumber: Yup.string()
            .matches(phoneRegExp, "Phone number must be exactly 10 digits")
            .required("Phone Number is required"),
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const formData = {
              first_name: values.firstName,
              last_name: values.lastName,
              email: values.email,
              password: values.password,
              role: "STUDENT",
              cell_phone: values.phoneNumber,
              driving_school_id: [tenantData?.id ? tenantData?.id : 1],
            };
            dispatch(
              register(formData, () => {
                dispatch(
                  login(
                    {
                      username: values.email.toLowerCase(),
                      password: values.password,
                    },
                    () => {
                      router.push("/manage");
                    }
                  )
                );
              })
            );
          } catch (err) {
            console.error(err);
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
          const handlePhoneNumberChange = (event: any) => {
            const cleaned = event.target.value.replace(/\D/g, "");

            if (cleaned.length <= 10) {
              const formattedPhoneNumber = formatPhoneNumber(cleaned);
              setFieldValue("phoneNumber", formattedPhoneNumber);
            }
          };

          type ValuesKey =
            | "firstName"
            | "lastName"
            | "email"
            | "password"
            | "confirmPassword"
            | "phoneNumber";

          interface Field {
            id: string;
            type: string;
            label: string;
            name: ValuesKey;
            error: boolean;
          }

          const formFields: Field[] = [
            {
              id: "firstName-signup",
              type: "text",
              name: "firstName",
              label: "First Name *",
              error: Boolean(touched.firstName && errors.firstName),
            },
            {
              id: "lastName-signup",
              type: "text",
              name: "lastName",
              label: "Last Name *",
              error: Boolean(touched.lastName && errors.lastName),
            },
            {
              id: "email-signup",
              type: "email",
              name: "email",
              label: "Email *",
              error: Boolean(touched.email && errors.email),
            },
            {
              id: "phoneNumber-signup",
              type: "text",
              name: "phoneNumber",
              label: "Phone Number *",
              error: Boolean(touched.phoneNumber && errors.phoneNumber),
            },
            {
              id: "password-signup",
              type: "password",
              name: "password",
              label: "Password *",
              error: Boolean(touched.password && errors.password),
            },
            {
              id: "confirmPassword-signup",
              type: "password",
              name: "confirmPassword",
              label: "Confirm Password *",
              error: Boolean(touched.confirmPassword && errors.confirmPassword),
            },
          ];

          return (
            <form onSubmit={handleSubmit}>
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
                  <Container maxWidth={"sm"} sx={{ mt: isMobile ? 30 : 0 }}>
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
                          src={"/assets/logo.png"}
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
                          Create an account{" "}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: 600,
                            letterSpacing: "0.24px",
                          }}
                        >
                          Connect to your Safety First Driving{" "}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Divider
                          sx={{
                            flexGrow: 1,
                            maxWidth: "350px",
                          }}
                          orientation="horizontal"
                        />
                      </Box>
                      <Grid container spacing={2}>
                        {formFields.map((field) => (
                          <Grid item xs={12} sm={6} key={field.id}>
                            <FormControl
                              variant="standard"
                              error={field.error}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={field.id}>
                                {field.label}
                              </CustomLabel>
                              <CustomInput
                                id={field.id}
                                type={field.type}
                                value={values[field.name]}
                                name={field.name}
                                onBlur={handleBlur}
                                onChange={
                                  field.name === "phoneNumber"
                                    ? handlePhoneNumberChange
                                    : handleChange
                                }
                                inputProps={{}}
                              />
                            </FormControl>
                          </Grid>
                        ))}
                      </Grid>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          marginTop: isMobile ? "10px" : "40px",
                        }}
                      >
                        <Button
                          disableElevation
                          disabled={isSubmitting}
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
                            maxWidth: "330px",
                            width: "100%",
                          }}
                        >
                          Register
                        </Button>
                      </Box>

                      <Box>
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
                          Already have an account?{" "}
                          <Link
                            href="/login"
                            style={{ textDecoration: "none" }}
                          >
                            <span>Sign In!</span>
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

export default RegisterView;
