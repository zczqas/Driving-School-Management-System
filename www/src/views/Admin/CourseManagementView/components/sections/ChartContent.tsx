import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { useAppDispatch } from "@/hooks";
import { openAlert } from "@/store/alert/alert.actions";
import { SectionMenu } from "@/store/interface";
import { Box, Button, FormControl, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";

const ChartContent = ({
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
      // Check file size is less than 10 MB
      if (file.size > 10 * 1024 * 1024) {
        dispatch(openAlert("File size should be less than 10 MB", "error"));
        return;
      }

      if (
        ![
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/webp",
          "image/svg+xml",
        ].includes(file.type)
      ) {
        dispatch(
          openAlert(
            "Only jpeg/jpg, png, webp and svg formats are allowed",
            "error"
          )
        );
        return;
      }
      formik.setFieldValue("image_file", file);
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
          gap: 2,
        }}
      >
        <FormControl
          variant="standard"
          error={Boolean(formik.touched.image_name && formik.errors.image_name)}
          sx={{ width: "100%" }}
        >
          <CustomLabel shrink htmlFor="image_name">
            Image name
          </CustomLabel>
          <CustomInput
            sx={{
              borderRadius: 0,
            }}
            id="image_name"
            type="text"
            placeholder="Enter image name"
            {...formik.getFieldProps("image_name")}
          />
        </FormControl>
        {sectionMenu.type === "edit" && (
          <FormControl
            variant="standard"
            error={Boolean(formik.touched.image_url && formik.errors.image_url)}
            sx={{ width: "100%" }}
          >
            <CustomLabel shrink htmlFor="image_url">
              Image url
            </CustomLabel>
            <CustomInput
              sx={{
                borderRadius: 0,
              }}
              id="image_url"
              type="text"
              placeholder="Enter image url"
              {...formik.getFieldProps("image_url")}
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
              {formik.values.image_file?.name
                ? `Selected File: ${formik.values.image_file.name}`
                : "Drag and drop image here"}
            </Typography>
            {!formik.values.image_file && (
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
                    accept=".png, .jpg, .jpeg, .webp, .svg"
                    hidden
                    onChange={(event) => {
                      event.stopPropagation();
                      const file = event.target.files?.[0];
                      if (file) {
                        formik.setFieldValue("image_file", file);
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

export default ChartContent;
