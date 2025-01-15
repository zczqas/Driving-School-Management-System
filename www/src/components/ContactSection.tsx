import { openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import { Box, Typography, TextField, Button } from "@mui/material";
import React from "react";
import { Formik, Form, Field, FieldInputProps } from "formik";
import * as Yup from "yup";
import { MuiTelInput } from "mui-tel-input";
import axiosInstance from "@/config/axios.config"; // Add this import at the top of the file
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";

// Define validation schema
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  mobile: Yup.string().required("Mobile number is required"),
  message: Yup.string().required("Message is required"),
});

// Add this type definition at the top of the file
type FormValues = {
  name: string;
  email: string;
  mobile: string;
  message: string;
};

const ContactSection = () => {
  const dispatch = useAppDispatch();
  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      const response = await axiosInstance.post("/contact/form/create", {
        name: values.name,
        email: values.email,
        phone: values.mobile,
        message: values.message,
      });
      dispatch(openAlert("Form submitted successfully", "success"));
      console.log("Form submitted successfully:", response.data);
      // You can add a success message or notification here

      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      // You can add an error message or notification here
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component={"section"}
      sx={{
        paddingX: constants.paddingContainerX,
        py: "130px",
      }}
    >
      <Box
        sx={{
          maxWidth: "1500px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          margin: "0 auto",
          padding: "40px 0",
          backgroundColor: "#FFF5F5",
          borderRadius: "21px",
        }}
      >
        {/* Content Box */}
        <Box
          sx={{
            flex: 1,
            paddingRight: { md: "40px" },
            paddingLeft: { xs: "40px", md: "90px" },
          }}
        >
          <Box
            sx={{
              maxWidth: "527px",
            }}
          >
            <Typography
              variant="subtitle1"
              color="primary"
              gutterBottom
              sx={{
                fontFamily: openSans.style.fontFamily,
                fontSize: "18px",
                fontWeight: 600,
                marginBottom: "16px",
                color: constants.color.primary.main,
              }}
            >
              Begin Your Driving Journey
            </Typography>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                fontFamily: openSans.style.fontFamily,
                fontSize: "42px",
                fontWeight: 700,
                marginBottom: "24px",
                color: "#000",
                lineHeight: "normal",
                letterSpacing: "0.42px",
              }}
            >
              Drop a Message to Our Driving School Team
            </Typography>
            <Typography
              variant="body1"
              sx={{
                marginBottom: "20px",
                fontFamily: openSans.style.fontFamily,
                fontSize: "16px",
                lineHeight: 1.5,
                color: "#333",
              }}
            >
              {` Have questions about our courses or need more information? Our
              team is here to help! Send us a message using the form below, and
              we'll get back to you promptly. Let's get you on the road to
              driving success!`}
            </Typography>
          </Box>
        </Box>
        {/* Contact Box */}
        <Box sx={{ flex: 1, paddingRight: "40px" }}>
          <Formik
            initialValues={{ name: "", email: "", mobile: "", message: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, setFieldValue, values }) => (
              <Form>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                    padding: "40px",
                    borderRadius: "10px",
                  }}
                >
                  <Field name="name">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <TextField
                        {...field}
                        placeholder="Enter Name"
                        fullWidth
                        variant="outlined"
                        error={!!(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                        InputProps={{
                          sx: {
                            backgroundColor: "#FFF",
                            borderRadius: "5px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: constants.color.primary.main,
                            },
                            fontFamily: openSans.style.fontFamily,
                            "&::placeholder": {
                              color: "#666",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    )}
                  </Field>

                  <Box
                    sx={{
                      display: "flex",
                      gap: "20px",
                      flexDirection: { xs: "column", lg: "row" },
                    }}
                  >
                    <Field name="email">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <TextField
                          {...field}
                          placeholder="Email Address"
                          fullWidth
                          variant="outlined"
                          error={!!(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                          InputProps={{
                            sx: {
                              backgroundColor: "#FFF",
                              borderRadius: "5px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: constants.color.primary.main,
                                },
                              fontFamily: openSans.style.fontFamily,
                              "&::placeholder": {
                                color: "#666",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                    <Field name="mobile">
                      {({ field }: { field: FieldInputProps<string> }) => (
                        <MuiTelInput
                          focusOnSelectCountry
                          {...field}
                          onlyCountries={["US"]}
                          defaultCountry={"US"}
                          forceCallingCode
                          value={values.mobile}
                          onChange={(newValue) => {
                            setFieldValue("mobile", newValue);
                          }}
                          inputProps={{
                            maxLength: 14,
                          }}
                          placeholder="Mobile"
                          fullWidth
                          error={!!(touched.mobile && errors.mobile)}
                          helperText={touched.mobile && errors.mobile}
                          InputProps={{
                            sx: {
                              backgroundColor: "#FFF",
                              borderRadius: "5px",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: "transparent",
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: constants.color.primary.main,
                                },
                              fontFamily: openSans.style.fontFamily,
                              "&::placeholder": {
                                color: "#666",
                                opacity: 1,
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </Box>

                  <Field name="message">
                    {({ field }: { field: FieldInputProps<string> }) => (
                      <TextField
                        {...field}
                        placeholder="Message"
                        multiline
                        rows={4}
                        fullWidth
                        variant="outlined"
                        error={!!(touched.message && errors.message)}
                        helperText={touched.message && errors.message}
                        InputProps={{
                          sx: {
                            backgroundColor: "#FFF",
                            borderRadius: "5px",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "transparent",
                            },
                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                              borderColor: constants.color.primary.main,
                            },
                            fontFamily: openSans.style.fontFamily,
                            "&::placeholder": {
                              color: "#666",
                              opacity: 1,
                            },
                          },
                        }}
                      />
                    )}
                  </Field>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    fullWidth
                    disabled={isSubmitting}
                    sx={{
                      fontFamily: openSans.style.fontFamily,
                      fontWeight: 600,
                      borderRadius: "5px",
                      padding: "12px",
                      backgroundColor: "#F37636",
                      boxShadow: "0px 2px 24px 0px rgba(243, 118, 54, 0.36)",
                      "&:hover": {
                        backgroundColor: constants.color.primary.dark,
                      },
                    }}
                  >
                    Submit
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};

export default ContactSection;
