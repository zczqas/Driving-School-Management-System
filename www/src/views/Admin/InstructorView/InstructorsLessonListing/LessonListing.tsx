import AutocompleteWithDynamicSearch from "../components/AutoCompleteWithDynamicSearch";
import { CustomLabel, DatePicker } from "@/components/CustomInput";
import { InputFormLabel } from "@/views/Client/ProfileView/components/ProfileInformation/ProfileInformation";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import React from "react";
import { Router, useRouter } from "next/router";
import SubHeader from "../components/SubHeader";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import moment from "moment";

const InstructorLessonListing = () => {
  const router = useRouter();
  const styles = {
    root: {
      border: "1px solid #EAECEE",
      borderRadius: "8px",
      minHeight: "423px",
      width: "100%",
    },
    headerBox: {
      height: "60px",
      background: "#E5E4E4",
      borderRadius: "8px 8px 0px 0px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formContainer: {
      padding: "30px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "50px",
    },
  };

  const [currentDate, setCurrentDate] = React.useState<string>(
    moment().format("MM-DD-YYYY")
  );

  const { user: currentUser } = useAppSelector(
    (state: IRootState) => state.auth.currentUser
  );

  // To handle the case when user is instructor and he is redirected to his own page
  React.useEffect(() => {
    console.log({ currentUser });
    if (currentUser?.role === "INSTRUCTOR") {
      router.replace(
        `/manage/instructor-daily-lesson-listing?date=${currentDate}&instructor_id=${currentUser?.id}&instructor_name=${currentUser?.first_name} ${currentUser?.last_name}`,
        undefined,
        { shallow: true }
      );
    }
  }, [currentUser]);

  return (
    <Box>
      {/* <SubHeader
        title="Instructors Lesson Listing"
        subTitle="Instructor Daily Lesson Listing"
      /> */}
      <Container maxWidth={false} sx={{ py: 3 }}>
        <Box sx={styles.root}>
          <Box sx={styles.headerBox}>
            <Typography
              sx={{ fontWeight: "700", fontSize: "18px", color: "#4F5B67" }}
            >
              CSR Daily Instructor Lesson List Selector
            </Typography>
          </Box>
          <Box sx={styles.formContainer}>
            <Formik
              initialValues={{
                lessonDate: "",
                instructor: null,
              }}
              validationSchema={Yup.object().shape({
                lessonDate: Yup.string().required("Required"),
                instructor: Yup.object().required("Required"),
              })}
              onSubmit={(values) => {
                console.log(values);
                router.push(
                  `/manage/instructor-daily-lesson-listing/?date=${
                    values.lessonDate
                  }&instructor_id=${
                    values?.instructor
                      ? (values?.instructor as { id: string })?.id
                      : null
                  }&instructor_name=${
                    values?.instructor
                      ? `${
                          (values?.instructor as { first_name: string })
                            ?.first_name
                        } ${
                          (values?.instructor as { last_name: string })
                            ?.last_name
                        }`
                      : null
                  }`
                );
              }}
            >
              {({ values, handleSubmit, touched, errors, setFieldValue }) => {
                return (
                  <Form>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        width: { xs: "400px", md: "800px" },
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.lessonDate && errors.lessonDate
                            )}
                            sx={{ width: "100%" }}
                          >
                            <InputFormLabel id="lessonDate">
                              Select date for lesson listing:
                            </InputFormLabel>
                            <DatePicker
                              name="lessonDate"
                              sx={{
                                "& .MuiInputBase-root": {
                                  height: "52px",
                                  borderRadius: "32px",
                                } as React.CSSProperties,
                              }}
                              // value={values.lessonDate}
                              format="MM-DD-YYYY"
                              onChange={(value: any) => {
                                if (value?._isValid) {
                                  setFieldValue(
                                    "lessonDate",
                                    value.format("MM-DD-YYYY")
                                  );
                                }
                              }}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          {" "}
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.instructor && errors.instructor
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"instructor"}>
                              Instructor:
                            </CustomLabel>
                            <AutocompleteWithDynamicSearch
                              fieldName="instructor"
                              endpoint="/user/get"
                              setFieldValue={setFieldValue}
                              values={values}
                              placeholder="Search Instructor"
                              fetchedOptionsKey="users"
                              getOptionLabel={(option: any) =>
                                `${option.first_name} ${option.last_name}`
                              }
                              userRole="INSTRUCTOR"
                            />
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          width: "120px",
                          height: "52px",
                          borderRadius: "32px",
                          background: "#1E4DB7",
                          color: "#FFFFFF",
                          fontWeight: "700",
                          fontSize: "16px",
                          marginTop: "20px",
                        }}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InstructorLessonListing;
