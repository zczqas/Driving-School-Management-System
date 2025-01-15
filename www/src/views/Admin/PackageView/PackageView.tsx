import React, { Fragment, useCallback } from "react";

// third party libraries
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import PackageTable from "./components/PackageTable";
import IRootState from "@/store/interface";
import {
  createPackage,
  deletePackage,
  fetchPackageById,
  fetchPackages,
  resetPackage,
  updatePackage,
  updatePackageStatus,
} from "@/store/package/package.action";
import { useAppDispatch, useAppSelector } from "@/hooks";
import CustomDialog from "@/components/CustomDialog";
import {
  CustomLabel,
  CustomInput,
  CustomSelect as Select,
} from "@/components/CustomInput";
import { lato } from "@/themes/typography";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import AutocompleteWithDynamicSearch from "@/components/AutoCompleteDynamicSearch";
import usePackageCategoryTypes from "@/hooks/package/usePackageCategoryType";
import { openAlert } from "@/store/alert/alert.actions";
import { debounce } from "lodash";
import { Theme } from "@mui/material";

// ==============================|| PACKAGE VIEW ||============================== //
const PackageView = () => {
  const dispatch = useAppDispatch();
  const {
    packageList,
    packageListLoading,
    updatePackageLoading,
    packageById,
    packageByIdLoading,
  } = useAppSelector((state: IRootState) => state.package);

  // ====Sort Filter State====//
  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  // ====Create Dialog ====//
  const [openDialog, setOpenDialog] = React.useState(false);
  const [changesMade, setChangesMade] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (packageById?.id) {
      dispatch(resetPackage());
    }
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  // ====Delete Dialog ====//
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>();

  React.useEffect(() => {
    dispatch(fetchPackages(0, 30));
  }, []);

  const [searchQuery, setSearchQuery] = React.useState("");

  const [filteredPackagesData, setFilteredPackagesData] = React.useState<any>(
    []
  );
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
            packageType: item.package_type,
            lessonsWithPackage: item.lessons,
            expandLessons: false,
            price: item.price,
            status: item.is_active,
          };
        })
      );
    }
  }, [packageList]);

  function changePackageStatus(id: number, status: boolean) {
    dispatch(updatePackageStatus(id, !status, () => {}));
  }

  function expandLessonsWithPackage(id: number) {
    const updatedPackages = filteredPackagesData.map((package_lesson: any) => {
      if (package_lesson.id === id) {
        package_lesson.expandLessons = !package_lesson.expandLessons;
      }
      return package_lesson;
    });
    setFilteredPackagesData(updatedPackages);
  }

  function handleDeletePackage(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  function editPackage(id: number) {
    dispatch(fetchPackageById(id));
  }

  React.useEffect(() => {
    if (packageById?.id) {
      setOpenDialog(true);
    }
  }, [packageById]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOptions = useCallback(
    debounce(async (searchTerm: string) => {
      try {
        dispatch(fetchPackages(0, 30, searchTerm));
      } catch (error: any) {
        console.log("error", error);
      }
    }, 300),
    [dispatch]
  );

  React.useEffect(() => {
    console.log(searchQuery);
    fetchOptions(searchQuery);
  }, [fetchOptions, searchQuery]);

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={packageListLoading || updatePackageLoading || packageByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog for delete====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deletePackage(deleteId, () => {
                setDeleteDialog(false);
                setDeleteId(null);
              })
            );
          }
        }}
        handleClose={() => {
          setDeleteDialog(false);
          setDeleteId(null);
        }}
        open={deleteDialog}
        dialogTitle="Delete Package"
        fullWidth
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this package?</h4>
        </Box>
      </CustomDialog>
      {/* =========Dialog for Add Edit Package======== */}
      {/* ======== moved the logic to page =========== */}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${packageById?.id ? "Edit" : "Add"}  Packages`}
        isFormikForm
        fullWidth
        maxWidth={"lg"}
      >
        <Formik
          initialValues={{
            driving_school: packageById?.driving_school ?? null,
            packageName: packageById?.name ?? "",
            packageCategoryType: packageById?.category?.id ?? "",
            lessons: packageById?.lessons ?? [],
            price: packageById?.price ?? "",
            packageType: packageById?.package_type ?? "ONLINE",
            status: (packageById?.is_active ? "active" : "inactive") ?? "active",
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
              package_type: values.packageType,
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
                    handleCloseDialog();
                    resetForm();
                    setChangesMade(false);
                  })
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createPackage(packageFields, () => {
                  handleCloseDialog();
                  dispatch(fetchPackages(0, 30));
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
                <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
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
                        {touched.driving_school && errors.driving_school && (
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
                          Package Type:
                        </CustomLabel>
                        <Field
                          fullWidth
                          id="packageCategoryType"
                          name="packageCategoryType"
                          variant="outlined"
                          color="primary"
                          as={Select}
                        >
                          {!packageCategoryTypeLoading &&
                            packageCategoryTypes?.map((item: any, index) => (
                              <MenuItem value={item.id} key={index}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Field>
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
                          fieldName="lessons" // Specify the field name here
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
                        error={Boolean(
                          touched.packageType && errors.packageType
                        )}
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
                          error={Boolean(
                            touched.status && errors.status
                          )}
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
                    onClick={() => handleSubmit()}
                  >
                    {`${packageById?.id ? "Update" : "Add"} `}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>
      ;
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setOpenDialog={setOpenDialog}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          <PackageTable
            packagesData={filteredPackagesData}
            changePackageStatus={changePackageStatus}
            expandLessonsWithPackage={expandLessonsWithPackage}
            deletePackage={handleDeletePackage}
            editPackage={editPackage}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default PackageView;