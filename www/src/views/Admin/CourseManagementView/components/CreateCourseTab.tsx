import { useAppDispatch, useAppSelector } from "@/hooks";
import { createCourse } from "@/store/course/course.actions";
import IRootState from "@/store/interface";
import {
  CustomTextField,
  InputFormLabel,
} from "@/views/Client/ProfileView/components/ProfileInformation/ProfileInformation";
import { Box, Button, FormControl, Grid, Typography } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

const CreateCourseTab = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { createCourseLoading } = useAppSelector(
    (state: IRootState) => state.course.course
  );

  const formik = useFormik({
    validateOnChange: true,
    initialValues: {
      title: "",
      description: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Required"),
      description: Yup.string().required("Required"),
    }),
    onSubmit: (values) => {
      dispatch(createCourse(values, () => router.push("/manage/course")));
    },
  });

  const handleCancel = () => {
    router.push("/manage/course");
  };

  return (
    <Box
      sx={{
        width: "100%",
        // maxWidth: 600,
        backgroundColor: "#fff",
        borderRadius: "8px",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          padding: "1rem",
          fontWeight: 600,
        }}
        gutterBottom
      >
        Create A Course
      </Typography>
      <Box
        component={"div"}
        sx={{
          height: "1px",
          backgroundColor: "#f1f1f1",
          padding: "0px !important",
          width: "full",
        }}
      />
      <Box
        px={2}
        sx={{
          margin: "0 auto",
          padding: "2rem",
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(formik.touched.title && formik.errors.title)}
              >
                <InputFormLabel htmlFor="title">Title</InputFormLabel>
                <CustomTextField
                  id="title"
                  type="text"
                  placeholder="Enter course title"
                  {...formik.getFieldProps("title")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                variant="standard"
                error={Boolean(
                  formik.touched.description && formik.errors.description
                )}
              >
                <InputFormLabel htmlFor="description">
                  Description
                </InputFormLabel>
                <CustomTextField
                  id="description"
                  type="text"
                  maxRows={5}
                  multiline
                  placeholder="Enter course description"
                  {...formik.getFieldProps("description")}
                />
              </FormControl>
            </Grid>
          </Grid>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1.5rem",
              gap: "8px",
            }}
          >
            <Button
              onClick={handleCancel}
              variant="outlined"
              sx={{
                borderRadius: "32px",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "32px",
              }}
              disabled={createCourseLoading}
            >
              Create Course
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateCourseTab;
