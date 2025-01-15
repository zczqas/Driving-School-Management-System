import React from "react";

import CustomDialog from "@/components/CustomDialog";
import { useAppDispatch } from "@/hooks";
import {
  createUnit,
  fetchUnitsByCourseId
} from "@/store/course/course.actions";
import { CustomInput, CustomLabel } from "@/views/Auth/components";
import AddIcon from "@mui/icons-material/Add";
import { Box, Button, FormControl, Grid } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import * as Yup from "yup";

interface Props {
  courseId: string;
}

const AddSectionDialog = ({ courseId }: Props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      title: "",
      purpose: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      purpose: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      if (!router.query.id) {
        return;
      }
      dispatch(
        createUnit({ ...values, course_id: router.query.id }, () => {
          handleCloseDialog();
          formik.resetForm();
          dispatch(fetchUnitsByCourseId(courseId));
        })
      );
    },
  });

  return (
    <>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleCloseDialog}
        open={openDialog}
        dialogTitle="Add New Unit"
        isFormikForm
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                variant="standard"
                error={Boolean(formik.touched.title && formik.errors.title)}
                sx={{ width: "100%" }}
              >
                <CustomLabel shrink htmlFor="unit-title">
                  Title
                </CustomLabel>
                <CustomInput
                  id="unit-title"
                  type="text"
                  placeholder="Unit title"
                  {...formik.getFieldProps("title")}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl
                variant="standard"
                error={Boolean(formik.touched.purpose && formik.errors.purpose)}
                sx={{ width: "100%" }}
              >
                <CustomLabel shrink htmlFor="unit-purpose">
                  Purpose
                </CustomLabel>
                <CustomInput
                  id="unit-purpose"
                  type="text"
                  placeholder="What is the purpose of this unit?"
                  {...formik.getFieldProps("purpose")}
                />
              </FormControl>
            </Grid>
          </Grid>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "40px",
              gap: 2,
            }}
          >
            <Button
              disableElevation
              disabled={formik.isSubmitting}
              size="large"
              variant="outlined"
              color="primary"
              sx={{
                borderRadius: "100px",
                padding: "12px 0",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "120px",
                width: "100%",
              }}
              onClick={() => {
                setOpenDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disableElevation
              disabled={formik.isSubmitting}
              size="large"
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                borderRadius: "100px",
                padding: "12px 0",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: 700,
                maxWidth: "120px",
                width: "100%",
              }}
            >
              Create
            </Button>
          </Box>
        </form>
      </CustomDialog>
      <Box>
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            textTransform: "none",
            backgroundColor: "#673ab7",
            color: "#fff",
            "&:hover": { backgroundColor: "#5e35b1" },
          }}
        >
          Add New Unit
        </Button>
      </Box>
    </>
  );
};

export default AddSectionDialog;
