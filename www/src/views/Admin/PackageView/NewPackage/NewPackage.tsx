import React from "react";

// third party libraries
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Theme,
  Typography,
} from "@mui/material";

// style + assets
import { lato } from "@/themes/typography";
import { Field, Form, Formik } from "formik";
import AutocompleteWithDynamicSearch from "@/components/AutoCompleteDynamicSearch";
import { openAlert } from "@/store/alert/alert.actions";

// import yup
import * as Yup from "yup";
import {
  CustomInput,
  CustomLabel,
  CustomSelect as Select,
} from "@/components/CustomInput";
import { useAppDispatch, useAppSelector } from "@/hooks";
import usePackageCategoryTypes from "@/hooks/package/usePackageCategoryType";

import { useRouter } from "next/router";
import IRootState from "@/store/interface";
import {
  createPackage,
  fetchPackages,
  updatePackage,
} from "@/store/package/package.action";

const NewPackage = () => {
  const router = useRouter();
  const [addNewTransactionDialog, setAddNewTransactionDialog] =
    React.useState(false);
  const {
    packageList,
    packageListLoading,
    updatePackageLoading,
    packageById,
    packageByIdLoading,
  } = useAppSelector((state: IRootState) => state.package);
  function handleOpenAddNewTransactionDialog() {
    setAddNewTransactionDialog(true);
  }
  const [filteredPackagesData, setFilteredPackagesData] = React.useState<any>(
    []
  );

  const styles = {
    root: {
      display: "flex",
      background: "#fff",
      flexDirection: "column",
      height: "100%",
      minHeight: "90vh",
    },
  };

  const { packageCategoryTypes, loading: packageCategoryTypeLoading } =
    usePackageCategoryTypes();
  React.useEffect(() => {
    if (packageList?.packages) {
      setFilteredPackagesData(
        packageList?.packages.map((item: any) => {
          return {
            id: item.id,
            packageName: item.name,
            packageCategoryType: item.category.name,
            lessonsWithPackage: item.lessons,
            expandLessons: false,
            price: item.price,
            status: item.is_active,
          };
        })
      );
    }
  }, [packageList]);
  const [changesMade, setChangesMade] = React.useState(false);
  const dispatch = useAppDispatch();
  const [selectedStudent, setSelectedStudent] = React.useState<any>({});
  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Box sx={styles.root}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "14px 18px",
          }}
        >
          <Typography
            id="alert-dialog-title"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              fontFamily: lato.style.fontFamily,
            }}
          >
            {packageById?.id ? "Update Package" : "Add Package"}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "14px 18px", display: "flex " }}>
          <Box>
            <Formik
              initialValues={{
                driving_school: null,
                packageName: packageById?.name ?? "",
                packageCategoryType: packageById?.category?.id ?? "",
                lessons: packageById?.lessons ?? [],
                price: packageById?.price ?? "",
                packageType: packageById?.package_type ?? "ONLINE",
                status:
                  (packageById?.is_active ? "active" : "inactive") ?? "active",
              }}
              validationSchema={Yup.object().shape({
                packageName: Yup.string().required("Package Name is required"),
                packageCategoryType: Yup.string().required(
                  "Package Type is required"
                ),
                price: Yup.string().required("Price is required"),
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting, resetForm }
              ) => {
                console.log(values);
                const packageFields = {
                  name: values.packageName,
                  category_id: values?.packageCategoryType,
                  price: values.price,
                  is_active: values.status === "active",
                  package_type : values.packageType,
                  lesson_id: values.lessons.map((lesson: any) => lesson.id),
                  driving_school_id: values?.driving_school
                    ? (values?.driving_school as { id: string }).id
                    : null,
                };
                if (packageById?.id) {
                  if (changesMade) {
                    dispatch(
                      updatePackage(packageById.id, packageFields, () => {
                        dispatch(fetchPackages(0, 30));

                        resetForm();
                        setChangesMade(false);
                        router.push("/manage/packages");
                      })
                    );
                  } else {
                    dispatch(openAlert("No changes made to save", "error"));
                  }
                } else {
                  dispatch(
                    createPackage(packageFields, () => {
                      dispatch(fetchPackages(0, 30));
                      router.push("/manage/packages");
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
                      sx={{ display: "flex", justifyContent: "center", p: 5 }}
                    >
                      <Grid container spacing={2} maxWidth={"md"}>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.driving_school && errors.driving_school
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"driving_school"}>
                              Driving School:
                            </CustomLabel>
                            <AutocompleteWithDynamicSearch
                              fieldName="driving_school"
                              endpoint="/driving-school/get"
                              setFieldValue={setFieldValue}
                              values={values}
                              placeholder="Search School"
                              fetchedOptionsKey=""
                              getOptionLabel={(option: any) => `${option.name}`}
                            />
                            {touched.driving_school &&
                              errors.driving_school && (
                                <Typography variant="caption" color="error">
                                  {errors.driving_school as string}
                                </Typography>
                              )}
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.packageName && errors.packageName
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"packageName"}>
                              Package Name:
                            </CustomLabel>
                            <CustomInput
                              id={"packageName"}
                              type={"text"}
                              value={values.packageName}
                              name={"packageName"}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              inputProps={{}}
                              placeholder="Enter package name"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.packageCategoryType &&
                                errors.packageCategoryType
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"packageCategoryType"}>
                              Package Category Type:
                            </CustomLabel>
                            <Field
                              fullWidth
                              id="packageCategoryType"
                              name="packageCategoryType"
                              variant="outlined"
                              color="primary"
                              as={Select}
                              displayEmpty
                              sx={(theme : Theme) => ({
                                color: values.packageCategoryType === "" ? theme.palette.text.secondary : theme.palette.text.primary,
                              })}
                            >
                              <MenuItem value="" disabled>
                                Select Package Category Type
                              </MenuItem>
                              {!packageCategoryTypeLoading &&
                                packageCategoryTypes?.map(
                                  (item: any, index) => (
                                    <MenuItem value={item.id} key={index}>
                                      {item.name}
                                    </MenuItem>
                                  )
                                )}
                            </Field>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.price && errors.price)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"price"}>
                              Price:
                            </CustomLabel>
                            <CustomInput
                              id={"price"}
                              type="number"
                              value={values.price}
                              name={"price"}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              inputProps={{}}
                              placeholder="Enter Price"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.lessons && errors.lessons)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"lessons"}>
                              Add Lessons:
                            </CustomLabel>
                            <AutocompleteWithDynamicSearch
                              multiple
                              setFieldValue={setFieldValue}
                              values={values}
                              fieldName="lessons"
                              endpoint="/lesson/get"
                              debounceTime={300}
                              getOptionLabel={(option) =>
                                `${option.name} - ${option.duration} Hrs`
                              }
                              fetchedOptionsKey="lessons"
                              placeholder="Search Lessons"
                            />
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.packageType && errors.packageType)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"packageType"}>
                              Package Type:
                            </CustomLabel>
                            <Field
                              fullWidth
                              id="packageType"
                              name="packageType"
                              variant="outlined"
                              color="primary"
                              as={Select}
                              displayEmpty
                              sx={(theme: Theme) => ({
                                color: values.packageType === "" ? theme.palette.text.secondary : theme.palette.text.primary,
                              })}
                            >
                              <MenuItem value="" disabled>
                                Select Package Type
                              </MenuItem>
                              <MenuItem value="ONLINE">ONLINE</MenuItem>
                              <MenuItem value="OFFLINE">OFFLINE</MenuItem>
                            </Field>
                          </FormControl>
                        </Grid>

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
                              Status:
                            </Typography>
                            <FormControl
                              variant="standard"
                              error={Boolean(touched.status && errors.status)}
                              sx={{ width: "100%" }}
                            >
                              <RadioGroup
                                aria-labelledby="status-radio-btn-groups"
                                name="status"
                                value={values?.status}
                                onChange={(e) => {
                                  setFieldValue(
                                    "status",
                                    (e.target as HTMLInputElement).value
                                  );
                                }}
                                id="status"
                                row
                              >
                                <FormControlLabel
                                  value="active"
                                  control={<Radio />}
                                  label="Active"
                                />
                                <FormControlLabel
                                  value="inactive"
                                  control={<Radio />}
                                  label="Inactive"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Box>
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
                        onClick={() => router.back()}
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
                        onClick={() => handleSubmit()}
                      >
                        {`${packageById?.id ? "Update" : "Add"} `}
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default NewPackage;