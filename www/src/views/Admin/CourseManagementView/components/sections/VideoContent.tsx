import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import { SectionMenu } from "@/store/interface";
import { Box, Button, FormControl, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";

const VideoContent = ({
  formik,
  sectionMenu,
}: {
  formik: any;
  sectionMenu: SectionMenu;
}) => {
  const dispatch = useAppDispatch();

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      // Check if file size is less than 100 MB
      if (file.size > 100 * 1024 * 1024) {
        dispatch(openAlert("File size should be less than 100 MB", "error"));
        return;
      }
      if (!["video/mp4", "video/quicktime"].includes(file.type)) {
        dispatch(openAlert("Only mp4 and apple formats are allowed", "error"));
        return;
      }
      formik.setFieldValue("video_file", file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  return (
    <React.Fragment>
      <Box
        sx={{
          paddingBottom: 3,
          width: "80%",
        }}
      >
        <FormControl
          variant="standard"
          error={Boolean(formik.touched.video_name && formik.errors.video_name)}
          sx={{ width: "100%" }}
        >
          <CustomLabel shrink htmlFor="video_name">
            Video name
          </CustomLabel>
          <CustomInput
            sx={{
              borderRadius: 0,
            }}
            id="video_name"
            type="text"
            placeholder="Enter video name"
            {...formik.getFieldProps("video_name")}
          />
        </FormControl>
        {sectionMenu.type === "edit" && (
          <FormControl
            variant="standard"
            error={Boolean(formik.touched.video_url && formik.errors.video_url)}
            sx={{ width: "100%" }}
          >
            <CustomLabel shrink htmlFor="video_url">
              Video url
            </CustomLabel>
            <CustomInput
              sx={{
                borderRadius: 0,
              }}
              id="video_url"
              type="text"
              placeholder="Enter video url"
              {...formik.getFieldProps("video_url")}
            />
          </FormControl>
        )}
      </Box>
      {sectionMenu.type === "add" && (
        <Box
          {...getRootProps()}
          sx={{
            border: `2px dashed ${isDragActive ? "#6200ea" : "#ccc"}`,
            borderRadius: "8px",
            padding: "16px",
            width: "80%",
            height: "80%",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            backgroundColor: isDragActive ? "#f3e5f5" : "#fff",
            transition: "all 0.2s ease-in-out",
          }}
        >
          <Box>
            <Box sx={{ margin: 2 }}>
              <Image
                src={"/icons/dnd.svg"}
                alt="dnd-upload"
                width={100}
                height={100}
              />
            </Box>
            <input {...getInputProps()} />
            <Typography variant="h6" color="textSecondary">
              {formik.values.video_file?.name
                ? `Selected File: ${formik.values.video_file.name}`
                : "Drag and drop video here"}
            </Typography>
            {!formik.values.video_file && (
              <Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginY: 1 }}
                >
                  or
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  component="label"
                  sx={{
                    backgroundColor: "#6200ea",
                  }}
                  onClick={(event) => event.stopPropagation()}
                >
                  Select a File
                  <input
                    type="file"
                    accept=".mp4, .mov"
                    hidden
                    onChange={(event) => {
                      event.stopPropagation();
                      const file = event.target.files?.[0];
                      if (file) {
                        if (file.size > 100 * 1024 * 1024) {
                          dispatch(
                            openAlert(
                              "File size should be less than 100 MB",
                              "error"
                            )
                          );
                          return;
                        }
                        if (
                          !["video/mp4", "video/quicktime"].includes(file.type)
                        ) {
                          dispatch(
                            openAlert(
                              "Only mp4 and apple formats are allowed",
                              "error"
                            )
                          );
                          return;
                        }
                        formik.setFieldValue("video_file", file);
                      }
                    }}
                  />
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </React.Fragment>
  );
};

export default VideoContent;
