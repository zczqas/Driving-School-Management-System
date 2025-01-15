import CustomDialog from "@/components/CustomDialog";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import IRootState from "@/store/interface";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import { AddRounded as AddRoundedIcon } from "@mui/icons-material";
import React, { Fragment, useEffect, useState } from "react";
import BatchCertificateTable from "./components/BatchCertificateTable";
import {
  addCertificatesToSystem,
  getAllCertificateBatch,
} from "@/store/masterlist/masterlist.actions";
import {
  CustomInput,
  CustomLabel,
  CustomSelect,
} from "@/components/CustomInput";
import * as Yup from "yup";
import { gothicA1 } from "@/themes/typography";

/**
 * Batch Certificate View Page Component
 * @returns {JSX.Element} The BatchCertificateView component.
 */

const BatchCertificateView = () => {
  const dispatch = useAppDispatch<any>();
  const [certificateTypeFilter, setCertificateTypeFilter] = useState("ALL");

  useEffect(() => {
    dispatch(
      getAllCertificateBatch(
        certificateTypeFilter !== "ALL" ? certificateTypeFilter : undefined
      )
    );
  }, [dispatch, certificateTypeFilter]);

  const {
    certificatesLogList,
    certificatesLogListLoading,
    certificatesLogListError,
  } = useAppSelector((state: IRootState) => state?.masterlist?.certificates);

  const [deleteId, setDeleteId] = useState<any>();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);

  const [openDialog, setOpenDialog] = useState(false);

  function handleCloseDialog() {
    setOpenDialog(false);
    dispatch(getAllCertificateBatch());
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    // dispatch(fetchCities(0, 25));
  }

  function editCity(id: any) {
    // dispatch(fetchCityById(id));
  }

  const [changesMade, setChangesMade] = React.useState(false);

  const validationSchema = Yup.object().shape({
    prefix_text: Yup.string().required("Prefix is required"),
    start_number: Yup.number().required("Start number is required"),
    end_number: Yup.number().required("End number is required"),
    certificate_type: Yup.string()
      .oneOf(["GOLD", "PINK"], "Please select a certificate type")
      .required("Certificate type is required"),
  });

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={certificatesLogListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      {/*========= Add Certificate Batch Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`Add Batch Certificate`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            prefix_text: "",
            start_number: "",
            end_number: "",
            certificate_type: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            dispatch(
              addCertificatesToSystem(values, () => {
                handleCloseDialog();
              })
            );
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
            dirty,
          }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (dirty) {
                setChangesMade(true);
              }
            }, [dirty]);
            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.prefix_text && errors.prefix_text
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"prefix_text"}>
                          Prefix Text:
                        </CustomLabel>
                        <CustomInput
                          id={"prefix_text"}
                          type={"text"}
                          value={values.prefix_text}
                          name={"prefix_text"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Prefix "
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.start_number && errors.start_number
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"start_number"}>
                          Start Number:
                        </CustomLabel>
                        <CustomInput
                          id={"start_number"}
                          type={"number"}
                          value={values.start_number}
                          name={"start_number"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Start Number"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.end_number && errors.end_number)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"end_number"}>
                          End Number:
                        </CustomLabel>
                        <CustomInput
                          id={"end_number"}
                          type={"number"}
                          value={values.end_number}
                          name={"end_number"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter End Number"
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.certificate_type && errors.certificate_type
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"certificate_type"}>
                          Certificate Type:
                        </CustomLabel>
                        <CustomSelect
                          id={"certificate_type"}
                          value={values.certificate_type}
                          name={"certificate_type"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          variant="outlined"
                        >
                          <MenuItem value="">Select a type</MenuItem>
                          <MenuItem value="GOLD">GOLD</MenuItem>
                          <MenuItem value="PINK">PINK</MenuItem>
                        </CustomSelect>
                      </FormControl>
                    </Grid>
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
                    Add
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", maxWidth: 300, mb: 2 }}
          >
            <Typography
              id="certificate-type-label"
              sx={{
                marginRight: 2,
                whiteSpace: "nowrap",
                fontFamily: gothicA1.style.fontFamily,
                fontWeight: 700,
                fontSize: "16px",
              }}
            >
              Certificate Type:
            </Typography>
            <FormControl variant="outlined" fullWidth>
              <CustomSelect
                labelId="certificate-type-label"
                value={certificateTypeFilter}
                onChange={(e) =>
                  setCertificateTypeFilter(e.target.value as string)
                }
                displayEmpty
              >
                <MenuItem value="ALL">All</MenuItem>
                <MenuItem value="GOLD">Gold</MenuItem>
                <MenuItem value="PINK">Pink</MenuItem>
              </CustomSelect>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddRoundedIcon />}
            onClick={() => setOpenDialog(true)}
            sx={{
              borderRadius: "100px",
              padding: "12px 24px",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            Add New Certificate Batch
          </Button>
        </Box>
        <BatchCertificateTable batchCertificateData={certificatesLogList} />
      </Box>
    </Fragment>
  );
};

export default BatchCertificateView;
