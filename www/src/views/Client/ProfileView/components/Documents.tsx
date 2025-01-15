import React, { useRef, Fragment, useState } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  Typography,
  useTheme,
} from "@mui/material";
import DocumentsTable from "./DocumentsTable";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import * as Yup from "yup";
import CustomDialog from "@/components/CustomDialog";
import { Formik } from "formik";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import Image from "next/image";

import AddFileIcon from "../../../../../public/icons/addFileIcon.svg";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchUserDetailsById,
  uploadUserFilePDF,
} from "@/store/user/user.actions";
import { useRouter } from "next/router";

const Documents = ({ documentsData, documentsLoading }: any) => {
  const router = useRouter();
  const { id } = router.query;
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const dispatch = useAppDispatch();

  const userId = useAppSelector((store) => store?.auth);

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Checking if the selected file is a PDF
      if (
        selectedFile.type === "application/pdf" &&
        selectedFile.size <= 5242880
      ) {
        const blobUrl = URL.createObjectURL(selectedFile);
        setFile(selectedFile);
      } else {
        alert("Only PDFs less than 5MB are allowed");
      }
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const [file, setFile] = useState<any>(null);
  const [fileEnter, setFileEnter] = useState(false);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={documentsLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        fullWidth={true}
        dialogTitle="Add New Document"
        isFormikForm
      >
        <Formik
          initialValues={{
            name: "",
            description: "",
            file: {},
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().max(255).required("Document Name is required"),
            description: Yup.string().max(255).notRequired(),
            file: Yup.object().required(),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              await dispatch(
                uploadUserFilePDF(
                  file,
                  () => {
                    handleCloseDialog();
                    dispatch(
                      fetchUserDetailsById(
                        id ? id : userId?.currentUser?.user?.id
                      )
                    );
                    setSubmitting(false);
                  },
                  id ? id : userId?.currentUser?.user?.id,
                  values.name,
                  values.description
                )
              );
            } catch (err) {
              console.error(err, "error caught");
              setSubmitting(false);
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
          }) => {
          
            return (
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.name && errors.name)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor={"name"}>
                        Name:
                      </CustomLabel>
                      <CustomInput
                        value={values.name}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        rows={1}
                        name="name"
                        type="text"
                        placeholder="Enter Name"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "52px",
                            borderRadius: "32px",
                            width: "100%",
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.description && errors.description)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor={"description"}>
                        Description:
                      </CustomLabel>
                      <CustomInput
                        value={values.description}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        rows={2}
                        name="description"
                        type="text"
                        placeholder="Enter Description"
                        sx={{
                          "& .MuiInputBase-root": {
                            height: "52px",
                            borderRadius: "32px",
                          },
                        }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl
                      variant="standard"
                      error={Boolean(touched.file && errors.file)}
                      sx={{ width: "100%" }}
                    >
                      <CustomLabel shrink htmlFor={"file"}>
                        File:
                      </CustomLabel>
                      <Box
                        sx={{
                          borderRadius: "40px",
                          mt: "30px",
                          height: "152px",
                          border: 2,
                          borderColor: `${fileEnter ? "#5E38B5" : "#E0E3E7"}`,
                          borderStyle: "dashed",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setFileEnter(true);
                        }}
                        onDragLeave={(e) => {
                          setFileEnter(false);
                        }}
                        onDragEnd={(e) => {
                          e.preventDefault();
                          setFileEnter(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          setFileEnter(false);
                          // Getting the first (and only) file
                          const file = e.dataTransfer.files[0];
                          if (file) {
                            // Checking if the dropped file is a PDF
                            //to limit size we can use file.size (gives size in bytes)
                            if (
                              file.type === "application/pdf" &&
                              file.size <= 5242880
                            ) {
                              const blobUrl = URL.createObjectURL(file);
                              //   setFile(blobUrl);
                              setFile(file);
                              console.log(`File name: ${file.name}`);
                            } else {
                              alert("Only pdfs less than 5MB are allowed");
                            }
                          }
                        }}
                      >
                        <Image src={AddFileIcon} alt={"add file icon"} />
                        <input
                          type="file"
                          accept=".pdf"
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                          id="file-input"
                        />
                        <label htmlFor="file-input">
                          <span>
                            Drag and drop or{" "}
                            <Button component="span">Select File</Button> to
                            upload.
                          </span>
                        </label>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {file !== null && (
                          <Box sx={{ display: "flex" }}>
                            <Typography sx={{ paddingY: "8px" }}>
                              Selected File:{" "}
                              <span style={{ color: "#5E38B5" }}>
                                {file?.name}
                              </span>
                            </Typography>
                            <Button
                              sx={{ color: "red" }}
                              onClick={handleRemoveFile}
                            >
                              X
                            </Button>
                          </Box>
                        )}

                        <Typography
                          sx={{
                            paddingY: "8px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          Maximum Allowed Size: 5 MB
                        </Typography>
                      </Box>
                    </FormControl>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "40px",
                  }}
                >
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    size="large"
                    variant="contained"
                    color="primary"
                    sx={{
                      borderRadius: "100px",
                      padding: "8px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "120px",
                      width: "100%",
                      position: "relative",
                    }}
                    onClick={() => handleSubmit()}
                  >
                    {isSubmitting ? (
                      <>
                        <CircularProgress
                          size={24}
                          sx={{
                            color: "white",
                            position: "absolute",
                            left: "50%",
                            marginLeft: "-12px",
                          }}
                        />
                        <span style={{ visibility: "hidden" }}>Upload</span>
                      </>
                    ) : (
                      "Upload"
                    )}
                  </Button>
                </Box>
              </form>
            );
          }}
        </Formik>
      </CustomDialog>
      <Box py={3}>
        <Box pb={3} sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            variant="contained"
            sx={{
              borderRadius: "32px",
              backgroundColor: "success.dark",
              "&:hover": {
                backgroundColor: "success.dark",
              },
            }}
            endIcon={<AddRoundedIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add a Document
          </Button>
        </Box>
        <DocumentsTable documentsTableData={documentsData} />
      </Box>
    </Fragment>
  );
};

export default Documents;
