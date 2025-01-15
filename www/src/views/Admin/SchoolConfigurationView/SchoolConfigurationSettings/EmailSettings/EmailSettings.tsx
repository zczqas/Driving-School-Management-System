import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchEmailTemplateById,
  fetchEmailTemplatesList,
  updateEmailTemplate,
} from "@/store/emails/emails.action";
import IRootState from "@/store/interface";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import React from "react";
import * as Yup from "yup";
import EmailTemplatesTable from "./component/EmailTemplatesTable";
import CustomDialog from "@/components/CustomDialog";

interface Props {
  isEdit?: boolean;
}

const EmailSettings = ({ isEdit = false }: Props) => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [changesMade, setChangesMade] = React.useState(false);
  const [currentEmailTemplate, setCurrentEmailTemplate] =
    React.useState<any>(null);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = (template: any) => {
    setCurrentEmailTemplate(template);
    setOpenDialog(true);
  };

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(fetchEmailTemplatesList());
  }, []);

  React.useEffect(() => {
    if (currentEmailTemplate) {
      dispatch(fetchEmailTemplateById(currentEmailTemplate));
    }
  }, [currentEmailTemplate]);

  const {
    emailTemplateList,
    emailTemplateListLoading,
    emailTemplateByIdLoading,
    emailTemplateById,
  } = useAppSelector((state: IRootState) => state.emails);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={emailTemplateListLoading || emailTemplateByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog && currentEmailTemplate && !emailTemplateByIdLoading}
        dialogTitle={`Email Template Settings`}
        isFormikForm
        fullWidth
        fullscreen
      >
        <Formik
          initialValues={{
            content: emailTemplateById ? emailTemplateById : "",
          }}
          validationSchema={Yup.object().shape({
            content: Yup.string().required("Content is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            console.log({ values });
            dispatch(
              updateEmailTemplate(currentEmailTemplate, values.content, () => {
                dispatch(fetchEmailTemplateById(currentEmailTemplate));
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
            setValues,
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
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.content && errors.content)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"content"}>
                          Content
                        </CustomLabel>
                        <CustomInput
                          id={"content"}
                          type={"text"}
                          value={values.content}
                          name={"content"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter HTML content"
                          multiline
                          rows={32}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "40px",
                    alignItems: "flex-end",
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
      <Box
        sx={{
          padding: (theme) => theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "left" }}>
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
            Driving School Email Templates
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Divider
            sx={{
              flexGrow: 1,
            }}
            orientation="horizontal"
          />
        </Box>

        <EmailTemplatesTable
          emailTemplateList={emailTemplateList}
          handleOpenDialog={handleOpenDialog}
        />
      </Box>
    </>
  );
};

export default EmailSettings;
