import {
  Backdrop,
  Box,
  CircularProgress,
  Container,
  Button,
  FormControl,
  Grid,
  FormControlLabel,
  Typography,
  RadioGroup,
  Radio,
  Divider,
} from "@mui/material";
import React, { Fragment, useEffect } from "react";
import SchoolTable from "./components/SchoolConfigurationViewTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { fetchDrivingSchools } from "@/store/masterlist/masterlist.actions";
import IRootState from "@/store/interface";
import { Field, Form, Formik } from "formik";
import { openAlert } from "@/store/alert/alert.actions";
import { lato } from "@/themes/typography";
import * as Yup from "yup";

import CustomDialog from "@/components/CustomDialog";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import axiosInstance from "@/config/axios.config";
import {
  createPaymentConfiguration,
  updatePaymentConfiguration,
} from "@/store/configuration/configuration.action";
import { useRouter } from "next/router";

const SchoolConfigurationView = () => {
  const router = useRouter();
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(fetchDrivingSchools(0, 25));
  }, [dispatch]);

  const { drivingSchoolList, drivingSchoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.drivingSchool
  );

  const [currentSchool, setCurrentSchool] = React.useState<any>(null);

  const [openDialog, setOpenDialog] = React.useState(false);

  const [changesMade, setChangesMade] = React.useState(false);

  const [paymentApiData, setPaymentApiData] = React.useState<any>({
    apiData: [],
    apiDataLoading: false,
  });

  function handleCloseDialog() {
    setOpenDialog(false);
    setPaymentApiData({ apiData: [], apiDataLoading: false });
    setCurrentSchool(null);
  }

  function handleAcceptDialog() {
    setOpenDialog(false);
    setCurrentSchool(null);
  }

  function handleOpenDialog(school: any) {
    setOpenDialog(true);
    fetchPaymentApiFromSchool(school.id);
    setCurrentSchool(school);
  }

  async function fetchPaymentApiFromSchool(schoolId: string) {
    try {
      setPaymentApiData({ ...paymentApiData, apiDataLoading: true });
      const { data } = await axiosInstance.get(
        `/payment_api/get/school/${schoolId}`
      );
      console.log("schoolId", schoolId);
      setPaymentApiData({
        apiData: data,
        apiDataLoading: false,
      });

      console.log("data", data);
    } catch (e) {
      console.error(e);
      setPaymentApiData({ ...paymentApiData, apiDataLoading: false });
    }
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={drivingSchoolListLoading || paymentApiData?.apiDataLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`Driving School Settings`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            id: null,
            name: "",
            sandbox_api_key_id: "",
            sandbox_transaction_key: "",
            sandbox_is_active: false,
            production_api_key_id: "",
            production_transaction_key: "",
            production_is_active: false,
            driving_school_id: null,
            is_active: null,
            created_at: "",
            updated_at: "",
          }}
          validationSchema={Yup.object().shape({
            sandbox_transaction_key: Yup.string().required(
              "Test Transaction Key is required"
            ),
            sandbox_api_key_id: Yup.string().required(
              "Test Api Key is required"
            ),
            production_api_key_id: Yup.string().required(
              "Live Transaction Key is required"
            ),
            production_transaction_key: Yup.string().required(
              "Live Api Key is required"
            ),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            console.log({ values });
            if (values?.id) {
              if (changesMade) {
                setSubmitting(true);
                dispatch(
                  updatePaymentConfiguration(values, () => {
                    handleCloseDialog();
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              setSubmitting(true);
              const formData = {
                ...values,
                driving_school_id: currentSchool?.id,
                name: `${currentSchool?.name} Payment Configuration`,
              };
              dispatch(
                createPaymentConfiguration({ ...values, ...formData }, () => {
                  handleCloseDialog();
                })
              );
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            handleChange,
            isSubmitting,
            handleSubmit,
            setFieldValue,
            setValues,
            dirty,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (dirty) {
                setChangesMade(true);
              }
            }, [dirty]);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              console.log({ paymentApiData });
              if (paymentApiData?.apiData?.length > 0) {
                setValues(paymentApiData?.apiData[0]);
              } else if (paymentApiData?.apiData.length === 0) {
                setValues({
                  id: null,
                  name: "",
                  sandbox_api_key_id: "",
                  sandbox_transaction_key: "",
                  sandbox_is_active: false,
                  production_api_key_id: "",
                  production_transaction_key: "",
                  production_is_active: false,
                  driving_school_id: null,
                  is_active: null,
                  created_at: "",
                  updated_at: "",
                });
              }
            }, [paymentApiData?.apiData]);
            return (
              <Form>
                <Backdrop
                  sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                  }}
                  open={paymentApiData?.apiDataLoading}
                >
                  <CircularProgress color="inherit" />
                </Backdrop>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.sandbox_transaction_key &&
                            errors.sandbox_transaction_key
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"sandbox_transaction_key"}>
                          Test Transaction Key:
                        </CustomLabel>
                        <CustomInput
                          id={"sandbox_transaction_key"}
                          type={"text"}
                          value={values.sandbox_transaction_key}
                          name={"sandbox_transaction_key"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Test Transaction Key"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.sandbox_api_key_id &&
                            errors.sandbox_api_key_id
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"sandbox_api_key_id"}>
                          Test Api Key:
                        </CustomLabel>
                        <Field
                          as={CustomInput}
                          id={"sandbox_api_key_id"}
                          type={"text"}
                          value={values.sandbox_api_key_id}
                          name={"sandbox_api_key_id"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Test Api Id"
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12}>
                      <Divider orientation="horizontal" sx={{ mt: 2 }} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.production_api_key_id &&
                            errors.production_api_key_id
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"production_api_key_id"}>
                          Live Transaction Key:
                        </CustomLabel>
                        <CustomInput
                          id={"production_api_key_id"}
                          type={"text"}
                          value={values.production_api_key_id}
                          name={"production_api_key_id"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Live Transaction Key"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.production_transaction_key &&
                            errors.production_transaction_key
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel
                          shrink
                          htmlFor={"production_transaction_key"}
                        >
                          Live API Key:
                        </CustomLabel>
                        <CustomInput
                          id={"production_transaction_key"}
                          type={"text"}
                          value={values.production_transaction_key}
                          name={"production_transaction_key"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Live Transaction Key"
                        />
                      </FormControl>
                    </Grid>
                    {values?.id ? (
                      <Grid item xs={12} sm={9}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            pt: 4,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: lato.style.fontFamily,
                              fontSize: "16px",
                            }}
                          >
                            Active:
                          </Typography>
                          <FormControl
                            variant="standard"
                            sx={{ width: "100%" }}
                          >
                            <RadioGroup
                              aria-labelledby="status-radio-btn-groups"
                              name="status"
                              value={
                                values?.sandbox_is_active
                                  ? "test"
                                  : values?.production_is_active
                                  ? "live"
                                  : null
                              }
                              onChange={(e) => {
                                // setFieldValue(
                                //   "status",
                                //   (e.target as HTMLInputElement).value
                                // );
                                if (
                                  (e.target as HTMLInputElement).value ===
                                  "test"
                                ) {
                                  setFieldValue("sandbox_is_active", true);
                                  setFieldValue("production_is_active", false);
                                } else {
                                  setFieldValue("sandbox_is_active", false);
                                  setFieldValue("production_is_active", true);
                                }
                              }}
                              id="status"
                              row
                            >
                              <FormControlLabel
                                value="test"
                                control={<Radio />}
                                label="Test"
                              />
                              <FormControlLabel
                                value="live"
                                control={<Radio />}
                                label="Live"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Box>
                      </Grid>
                    ) : null}
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="outlined"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                      mr: 2,
                    }}
                    onClick={() => handleCloseDialog()}
                  >
                    Cancel
                  </Button>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "175px",
                      width: "100%",
                    }}
                    type="submit"
                  >
                    Save
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>

      <Container maxWidth={false} sx={{ pt: 10 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: "20px",
            mb: 2,
          }}
        >
          <Button
            disableElevation
            size="large"
            variant="contained"
            color="primary"
            sx={{
              borderRadius: "100px",
              padding: "12px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
              maxWidth: "200px",
              width: "100%",
            }}
            onClick={() => {
              router.push("/manage/school-configuration/create");
            }}
          >
            Add New Driving School
          </Button>
        </Box>
        <SchoolTable
          schoolData={drivingSchoolList}
          handleOpenDialog={handleOpenDialog}
        />
      </Container>
    </Fragment>
  );
};

export default SchoolConfigurationView;
