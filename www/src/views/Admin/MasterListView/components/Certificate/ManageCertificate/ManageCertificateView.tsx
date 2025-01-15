import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import ManageCertificateTable from "./components/ManageCertificateTable";
import {
  getAllCertificateDmv,
  updateCertificates,
} from "@/store/masterlist/masterlist.actions";
import CustomDialog from "@/components/CustomDialog";
import { Field, Form, Formik } from "formik";
import { CustomLabel, CustomSelect as Select } from "@/components/CustomInput";

/**
 * Manage Certificate View page Component
 * @returns {JSX.Element} The ManageCertificateView component.
 */

const ManageCertificateView = () => {
  const dispatch = useAppDispatch<any>();

  useEffect(() => {
    dispatch(getAllCertificateDmv());
  }, [dispatch]);

  const [openDialog, setOpenDialog] = useState(false);
  const [changesMade, setChangesMade] = React.useState(false);
  const [editRow, setEditRow] = useState<any>();

  function handleCloseDialog() {
    setOpenDialog(false);
    dispatch(getAllCertificateDmv());
  }
  function handleAcceptDialog() {
    setOpenDialog(false);
    // dispatch(fetchCities(0, 25));
  }
  function handleOpenDialog(editRow: any) {
    setOpenDialog(true);
    setEditRow(editRow);
  }

  const {
    dmvCertificatesList,
    dmvCertificatesListError,
    dmvCertificatesListLoading,
  } = useAppSelector((state: IRootState) => state?.masterlist?.certificates);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={dmvCertificatesListLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Edit Certificate Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`Edit Certificate`}
        isFormikForm
        maxWidth="sm"
        fullWidth
      >
        <Formik
          initialValues={{
            status: editRow?.status ?? "",
          }}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            setSubmitting(true);
            dispatch(
              updateCertificates(editRow?.id, values.status, () => {
                handleCloseDialog();
              })
            );
            setSubmitting(false);
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

            // eslint-disable-next-line react-hooks/rules-of-hooks
            // React.useEffect(() => {
            //   if (dirty) {
            //     setChangesMade(true);
            //   }
            // }, [editRow]);

            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid
                    container
                    spacing={2}
                    maxWidth={"false"}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: "20px",
                    }}
                  >
                    <Grid item xs={8}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.status && errors.status)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel
                          htmlFor="status"
                          sx={{ pl: 1, mb: 2, fontSize: "18px" }}
                        >
                          {" "}
                          Select Status :
                        </CustomLabel>
                        <Field
                          fullWidth
                          id="status"
                          name="status"
                          variant="outlined"
                          color="primary"
                          as={Select}
                          placeholder="Select Status"
                        >
                          <MenuItem value=" " disabled>
                            Payment Type :
                          </MenuItem>
                          {["ASSIGNED", "NOT_ASSIGNED", "LOST", "VOID"].map(
                            (item, index) => (
                              <MenuItem value={item} key={item}>
                                {item}
                              </MenuItem>
                            )
                          )}
                        </Field>
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
                    disabled={isSubmitting || !dirty}
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

      <Box>
        <ManageCertificateTable
          batchCertificateData={dmvCertificatesList?.dmv_certificates ?? []}
          handleOpenDialog={handleOpenDialog}
        />
      </Box>
    </Fragment>
  );
};

export default ManageCertificateView;
