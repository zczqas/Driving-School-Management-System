import React, { Fragment, useCallback } from "react";

// third party libraries
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

// project imports
import SubHeader from "./components/SubHeader";
import CouponsTable from "./components/CouponsTable";
import { fetchUsers } from "@/store/user/user.actions";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createCoupons,
  deleteCoupons,
  fetchCoupons,
  fetchCouponsById,
  resetCoupons,
  updateCoupons,
  updateCouponsStatus,
} from "@/store/coupons/coupons.action";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik } from "formik";
import { CustomInput, CustomLabel } from "@/components/CustomInput";
import { lato } from "@/themes/typography";
import { DatePicker } from "@/components/CustomInput";

import * as Yup from "yup";
import { openAlert } from "@/store/alert/alert.actions";
import { debounce } from "lodash";
import moment from "moment";
import { generateSecureCode } from "@/utils/couponCodeGenerator";

// ==============================|| LESSON VIEW ||============================== //
const CouponsView = () => {
  const {
    couponList,
    couponListError,
    couponListLoading,
    updateCouponLoading,
    couponById,
    couponByIdLoading,
  } = useAppSelector((state: IRootState) => state.coupons);

  const dispatch = useAppDispatch();

  const [openDialog, setOpenDialog] = React.useState(false);

  const [changesMade, setChangesMade] = React.useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);

    // reset stale data
    dispatch(resetCoupons());
  };

  const handleAcceptDialog = () => {
    setOpenDialog(false);
  };

  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const [deleteId, setDeleteId] = React.useState<number | null>();

  const [sortBy, setSortBy] = React.useState("Sort by Date");

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as string);
  };

  React.useEffect(() => {
    dispatch(fetchCoupons(0, 30));
  }, [dispatch]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredCouponsData =
    couponList?.length > 0
      ? couponList.map((coupons: any) => {
          return {
            id: coupons.id,
            couponCode: coupons.code,
            note : coupons.notes,
            amount : coupons.amount,
            minPurchase : coupons.min_purchase,
            maxUses : coupons.max_uses,
            uses : coupons.uses,
            expiration : coupons.expiration,
            status: coupons.is_active,
          };
        })
      : [];

  function changeCouponsStatus(id: number, status: boolean) {
    console.log("changeCouponsStatus", id, status);
    dispatch(updateCouponsStatus(id, !status, () => {}));
  }

  function handleDeleteCoupons(id: number) {
    setDeleteDialog(true);
    setDeleteId(id);
  }

  function editCoupons(id: number) {
    dispatch(fetchCouponsById(id));
  }

  React.useEffect(() => {
    if (couponById?.id) {
      setOpenDialog(true);
    }
  }, [couponById]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  // const fetchOptions = useCallback(
  //   debounce(async (searchTerm: string) => {
  //     try {
  //       dispatch(fetchCoupons(0, 30, searchTerm));
  //     } catch (error: any) {
  //       console.log("error", error);
  //     }
  //   }, 300),
  //   [dispatch]
  // );

  // React.useEffect(() => {
  //   console.log(searchQuery);
  //   fetchOptions(searchQuery);
  // }, [fetchOptions, searchQuery]);

  function calendarIcon() {
    return <img src="/icons/calendarIcon.svg" alt="calendar" />;
  }

  return (
    <Fragment>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={couponListLoading || updateCouponLoading || couponByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/*========= Confirmation Dialog====== */}
      <CustomDialog
        handleAccept={() => {
          if (deleteId) {
            dispatch(
              deleteCoupons(deleteId, () => {
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
        dialogTitle="Delete Coupon"
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{ p: 2 }}>
          <h4>Are you sure you want to delete this coupon?</h4>
        </Box>
      </CustomDialog>
      {/*========= Add Edit Form ========*/}
      <CustomDialog
        handleClose={handleCloseDialog}
        handleAccept={handleAcceptDialog}
        open={openDialog}
        dialogTitle={`${couponById?.id ? "Edit" : "Add"} Coupons`}
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            code: couponById?.code ? couponById.code : "",
            amount: couponById?.amount ? couponById.amount : null,
            min_purchase: couponById?.min_purchase
              ? couponById.min_purchase
              : null,
            max_uses: couponById?.max_uses ? couponById.max_uses : null,
            expiration: couponById?.expiration ? moment(couponById.expiration) : null,
            type: couponById?.type ? couponById.type : "MULTIPLE",
            status: couponById?.is_active ? "active" : "inactive",
            notes: couponById?.notes ? couponById.notes : "",
          }}
          validationSchema={Yup.object().shape({
            code: Yup.string().required("Code is required"),
            amount: Yup.number()
              .required("Amount is required")
              .min(0, "Amount must be at least 0"),
            min_purchase: Yup.number()
              .required("Minimum purpose is required")
              .min(0, "Minimum purpose must be at least 0"),
            max_uses: Yup.number(),
            expiration: Yup.string(),
            // type: Yup.string().required("Type is required"),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            if (couponById?.id) {
              if (changesMade) {
                dispatch(
                  updateCoupons(
                    couponById.id,
                    {
                      code: values.code,
                      amount: values.amount,
                      min_purchase: values.min_purchase,
                      max_uses: values.max_uses,
                      expiration: moment(values.expiration).format(
                        "YYYY-MM-DD"
                      ),
                      type: values.type,
                      is_active: values.status === "active" ? true : false,
                    },
                    () => {
                      handleCloseDialog();
                    }
                  )
                );
              } else {
                dispatch(openAlert("No changes made to save", "error"));
              }
            } else {
              dispatch(
                createCoupons(
                  {
                    code: values.code,
                    amount: values.amount,
                    min_purchase: values.min_purchase,
                    max_uses: values.max_uses,
                    expiration: moment(values.expiration).format("YYYY-MM-DD"),
                    type: values.type,
                    is_active: values.status === "active" ? true : false,
                  },
                  () => {
                    dispatch(fetchCoupons(0, 30));
                    handleCloseDialog();
                  }
                )
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

            function handleGenerateCode() {
              setFieldValue("code", generateSecureCode());
            }

            return (
              <Form>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Grid container spacing={2} maxWidth={"sm"}>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.code && errors.code)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"code"}>
                          Code*:
                        </CustomLabel>
                        <CustomInput
                          id={"code"}
                          type={"text"}
                          value={values.code}
                          name={"code"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter code"
                        />
                        <Button
                          component={"span"}
                          sx={{
                            alignSelf: "flex-end",
                            fontSize: "12px",
                            width: "100px",
                          }}
                          variant="text"
                          onClick={handleGenerateCode}
                        >
                          {" "}
                          Generate Code
                        </Button>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.amount && errors.amount)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"amount"}>
                          Amount*:
                        </CustomLabel>
                        <CustomInput
                          id={"amount"}
                          type={"number"}
                          value={values.amount}
                          name={"amount"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter amount"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(
                          touched.min_purchase && errors.min_purchase
                        )}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"min_purchase"}>
                          Minimum Purchase Amount*:
                        </CustomLabel>
                        <CustomInput
                          id={"min_purchase"}
                          type={"number"}
                          value={values.min_purchase}
                          name={"min_purchase"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter minimum purchase amount"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.max_uses && errors.max_uses)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"max_uses"}>
                          Maximum Uses:
                        </CustomLabel>
                        <CustomInput
                          id={"max_uses"}
                          type={"number"}
                          value={values.max_uses}
                          name={"max_uses"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter maximum uses"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.notes && errors.notes)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"notes"}>
                          Notes:
                        </CustomLabel>
                        <CustomInput
                          id={"notes"}
                          type={"text"}
                          value={values.notes}
                          name={"notes"}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          inputProps={{}}
                          placeholder="Enter Notes"
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl
                        variant="standard"
                        error={Boolean(touched.expiration && errors.expiration)}
                        sx={{ width: "100%" }}
                      >
                        <CustomLabel shrink htmlFor={"expiration"}>
                          Expiration:
                        </CustomLabel>
                        <Box sx={{ pt: (theme) => theme.spacing(3) }}>
                          <DatePicker
                            name="expiration"
                            slots={{
                              openPickerIcon: calendarIcon,
                            }}
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: "32px",
                                backgroundColor: (theme) =>
                                  theme.palette.common.white,
                                height: "52px",
                              },
                            }}
                            format="MM-DD-YYYY"
                            onChange={(value: any) => {
                              if (value?._isValid) {
                                setFieldValue("expiration", value);
                              }
                            }}
                            value={values.expiration}
                          />
                        </Box>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
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
                    {couponById?.id ? "Edit" : "Add"}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>
      <SubHeader
        sortBy={sortBy}
        handleSortChange={handleSortChange}
        setSearchQuery={setSearchQuery}
        searchQuery={searchQuery}
        setOpenDialog={setOpenDialog}
      />
      <Container maxWidth={false}>
        <Box py={3}>
          <CouponsTable
            couponsData={filteredCouponsData}
            changeCouponsStatus={changeCouponsStatus}
            deleteCoupons={handleDeleteCoupons}
            editCoupons={editCoupons}
          />
        </Box>
      </Container>
    </Fragment>
  );
};

export default CouponsView;
