import React, { useEffect, useState } from "react";
import moment from "moment";

import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Typography,
} from "@mui/material";
import { lato } from "@/themes/typography";
import CustomDialog from "@/components/CustomDialog";
import { Form, Formik, Field } from "formik";
import * as Yup from "yup";
import {
  CustomInput,
  CustomLabel,
  CustomSelect as Select,
} from "@/components/CustomInput";
import AutocompleteWithDynamicSearch from "../Transactions/components/AutoComplete";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  createTransactionStart,
  fetchTransactionsStart,
} from "@/store/account/account.actions";
import { fetchSchools } from "@/store/masterlist/masterlist.actions";
import { useRouter } from "next/router";
import IRootState from "@/store/interface";
import { fetchUserDetailsById } from "@/store/user/user.actions";
import { useSelector } from "react-redux";
import axiosInstance from "@/config/axios.config";
import { openAlert } from "@/store/alert/alert.actions";
import { getCookie, deleteCookie } from "cookies-next";
import { isValidCardNumber } from "@/utils/validateCardNumber";

const AddTransactionView = () => {
  const router = useRouter();
  const { currentUser } = useSelector((state: IRootState) => state.auth);
  const { student_id, first_name, last_name } = router.query;
  const dispatch = useAppDispatch();
  const [selectedStudent, setSelectedStudent] = useState<any>({});
  const [paymentType, setPaymentType] = useState(
    currentUser?.user?.role === "STUDENT" ? "CREDIT_CARD" : ""
  );
  const [formStep, setFormStep] = useState(1);
  const [couponVerificationLoading, setCouponVerificationLoading] =
    useState<boolean>(false);
  const [billingData, setBillingData] = useState<any>({
    amount: 0,
    discount: 0,
    additionalAmount: 0,
    coupon: null,
    total: null,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [submissionValues, setSubmissionValues] = useState<any>(null);

  async function verifyCoupon(coupon: string) {
    try {
      setCouponVerificationLoading(true);
      const { data } = await axiosInstance.post(
        `/coupon/verify/${coupon.trim()}`
      );

      return { valid: true, message: "Coupon Verified", data };
    } catch (error: any) {
      console.log({ error });
      return {
        valid: false,
        message:
          error?.response?.data?.detail ?? "Coupon has reached maximum uses",
        data: null,
      };
    } finally {
      setCouponVerificationLoading(false);
    }
  }

  async function handleFormContinue(values: any, setFieldError: any) {
    let total = values?.packageId?.price;
    if (values?.additionalAmount) {
      total += values?.additionalAmount;
      console.log("Total + additional amount", total);
    }
    if (values?.additionalDiscount) {
      total -= values?.additionalDiscount;
      console.log("Total - additional discount", total);
    }
    let coupon = null;
    if (values.coupon) {
      coupon = await verifyCoupon(values.coupon);
      if (coupon?.valid === false) {
        dispatch(openAlert(coupon?.message, "error"));
        setFieldError("coupon", coupon?.message);
        return;
      }
      if (coupon?.data?.amount > total) {
        dispatch(
          openAlert(
            "Coupon amount cannot be greater than the total amount",
            "error"
          )
        );
        setFieldError(
          "coupon",
          "Coupon amount cannot be greater than the total amount"
        );
        return;
      }
      if (coupon?.data?.min_purchase && coupon?.data?.min_purchase > total) {
        dispatch(
          openAlert(
            `Minimum purchase amount for this coupon is $${coupon?.data?.min_purchase}`,
            "error"
          )
        );
        setFieldError(
          "coupon",
          `Minimum purchase amount for this coupon is $${coupon?.data?.min_purchase}`
        );
        return;
      }
      total -= coupon?.data?.amount;
      console.log("Total - coupon", total);
    }
    setBillingData({
      amount: values?.packageId?.price,
      discount: values?.additionalDiscount,
      additionalAmount: values?.additionalAmount,
      coupon: coupon ? coupon : null,
      total,
    });
    setFormStep(2);
  }

  useEffect(() => {
    console.log({ formStep });
    if (formStep === 2) {
      setShowConfirmationModal(true);
    }
  }, [formStep]);

  const handleSubmitTransaction = async (values: any, formikHelpers: any) => {
    setSubmissionValues({ values, formikHelpers });
    if (formStep === 1) {
      handleFormContinue(values, formikHelpers.setFieldError);
      return;
    }

    // Store the values and show confirmation modal instead of submitting directly
    // setShowConfirmationModal(true);
  };

  // This is the function that will be called when the user confirms the transaction
  const handleConfirmTransaction = async () => {
    const { values, formikHelpers } = submissionValues;

    interface TransactionFields {
      driving_school_id: number | null;
      user_id: any;
      package_id: any;
      location: any;
      method: any;
      cardholder_name?: string;
      card_number?: string;
      expiration_date?: string;
      cvv?: string;
      coupon?: string;
      discount?: number;
      additional_amount?: number;
      coupon_id?: number;
    }

    // Construct transaction fields as before
    let transactionFields: TransactionFields = {
      driving_school_id: values?.driving_school
        ? (values?.driving_school as { id: number })?.id
        : null,
      user_id: values?.userId?.id,
      package_id: values?.packageId?.id,
      location: values.location,
      method: values.paymentType,
    };

    if (
      values.paymentType === "CREDIT_CARD" ||
      values.paymentType === "DEBIT_CARD" ||
      values.paymentType === "DIGITAL"
    ) {
      transactionFields = {
        ...transactionFields,
        cardholder_name: values.cardholderName,
        card_number: values.cardNumber,
        expiration_date: `${values.expiryYear}-${values.expiryMonth}`,
        cvv: values.cvv,
      };
    }

    if (values.coupon) {
      transactionFields = {
        ...transactionFields,
        coupon: values.coupon,
      };
    }
    if (values.additionalDiscount) {
      transactionFields = {
        ...transactionFields,
        discount: values.additionalDiscount,
      };
    }
    if (values.additionalAmount) {
      transactionFields = {
        ...transactionFields,
        additional_amount: values.additionalAmount,
      };
    }
    if (!!billingData.coupon) {
      transactionFields = {
        ...transactionFields,
        coupon_id: billingData.coupon.data.id,
      };
    }

    // Submit the transaction
    dispatch(
      createTransactionStart(
        transactionFields,
        () => {
          if (currentUser?.user?.role === "STUDENT") {
            router.push(`/manage/profile/${currentUser?.user?.id}?tabValue=1`);
          } else {
            router.back();
          }
          dispatch(fetchTransactionsStart());
        },
        () => {
          //reset to first step and clear billing data
          setFormStep(1);
          setBillingData({
            amount: 0,
            discount: 0,
            coupon: null,
            total: 0,
          });
        }
      )
    );

    setShowConfirmationModal(false);
  };

  function cancelTransaction() {
    if (formStep === 1) {
      router.back();
    } else {
      setFormStep(1);
      setBillingData({
        amount: 0,
        discount: 0,
        coupon: null,
        total: 0,
      });
    }
  }

  useEffect(() => {
    if (student_id) {
      dispatch(
        fetchUserDetailsById(student_id as string, (data) => {
          setSelectedStudent(data);
        })
      );
    }
  }, [student_id]);

  useEffect(() => {
    dispatch(fetchSchools(0, 25));
  }, [dispatch]);

  const { schoolList, schoolListLoading } = useAppSelector(
    (state: IRootState) => state?.masterlist?.school
  );

  console.log({ currentUser });

  return (
    <Container maxWidth={false} sx={{ mt: 2 }}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={couponVerificationLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          display: "flex",
          background: "#fff",
          flexDirection: "column",
          height: "100%",
          minHeight: "90vh",
        }}
      >
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
            Add Transaction
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "14px 18px", display: "flex" }}>
          <Box>
            <Formik
              initialValues={{
                driving_school:
                  currentUser?.user?.role === "STUDENT"
                    ? {
                        name: "Safety First Driving School",
                        description: "sfds",
                        address: "California",
                        phone: "198-391-8391",
                        email: "contact@sfds.com",
                        website: "sfds.com",
                        sign_in_url: null,
                        sign_up_url: null,
                        pricing_url: null,
                        id: 1,
                        driving_school_urls_id: 1,
                        driving_school_urls: {
                          sign_in_url: "testing test",
                          sign_up_url: null,
                          pricing_url: null,
                          logo_url:
                            "logo/16bd9ff1-29ae-4540-a4eb-e121a1e526fc_logo.png",
                        },
                      }
                    : null,
                userId:
                  currentUser?.user?.role === "STUDENT" || !!student_id
                    ? {
                        id:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.id
                            : student_id ?? null,
                        first_name:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.first_name
                            : first_name ?? "",
                        last_name:
                          currentUser?.user?.role === "STUDENT"
                            ? currentUser?.user?.last_name
                            : last_name ?? "",
                        package: currentUser?.user?.package ?? [],
                      }
                    : {
                        id: null,
                        first_name: "",
                        last_name: "",
                        package: [],
                      },
                packageId: { id: null, name: "", price: 0 },
                packageCategoryId: { id: null, name: "" },
                coupon: "",
                additionalDiscount: null,
                additionalAmount: null,
                location: " ",
                paymentType:
                  currentUser?.user?.role === "STUDENT" ? "CREDIT_CARD" : "",
                note: "",
                cardholderName: "",
                cardNumber: "",
                expiryMonth: "",
                expiryYear: "",
                cvv: "",
              }}
              validationSchema={Yup.object({
                userId: Yup.object().required("Student is required"),
                packageId: Yup.object().required("Package is required"),
                location: Yup.string()
                  .required("Location is required")
                  .test(
                    "not-empty",
                    "Location is required",
                    (value) =>
                      value.trim() !== "" ||
                      currentUser?.user?.role === "STUDENT"
                  ),

                paymentType: Yup.string().required("Payment type is required"),
                ...(paymentType === "CREDIT_CARD" ||
                paymentType === "DEBIT_CARD" ||
                paymentType === "DIGITAL"
                  ? {
                      cardholderName: Yup.string()
                        .required("Cardholder Name is required")
                        .min(2, "Cardholder Name is too short"),
                      cardNumber: Yup.string()
                        .required("Card Number is required")
                        .matches(
                          /^\d{13,19}$/,
                          "Card Number must be between 13 and 19 digits"
                        )
                        .test(
                          "isValidCardNumber",
                          "Card Number is invalid",
                          function (value) {
                            return isValidCardNumber(value || "");
                          }
                        ),
                      expiryMonth: Yup.string()
                        .required("Expiration Month is required")
                        .matches(/^(0[1-9]|1[0-2])$/, "Invalid month format"),
                      expiryYear: Yup.string()
                        .required("Expiration Year is required")
                        .matches(/^\d{4}$/, "Invalid year format")
                        .test(
                          "expiryYear",
                          "Card is expired",
                          function (value) {
                            const { expiryMonth } = this.parent;
                            const currentYear = moment().year();
                            const currentMonth = moment().month() + 1; // moment months are 0-indexed
                            if (value && expiryMonth) {
                              const cardYear = parseInt(value, 10);
                              const cardMonth = parseInt(expiryMonth, 10);
                              return (
                                cardYear > currentYear ||
                                (cardYear === currentYear &&
                                  cardMonth >= currentMonth)
                              );
                            }
                            return true;
                          }
                        ),
                      cvv: Yup.string()
                        .required("CVV is required")
                        .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
                    }
                  : {}),
                additionalDiscount: Yup.number()
                  .nullable()
                  .test(
                    "max-discount",
                    `Discount cannot be greater than the package price `,
                    function (value: any) {
                      const { packageId } = this.parent;
                      console.log("testing discount", value, packageId?.price);
                      if (value === null || value === undefined) {
                        console.log("Value is null");
                        return true;
                      }
                      return value <= packageId?.price;
                    }
                  ),
              })}
              onSubmit={handleSubmitTransaction}
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
              }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                useEffect(() => {
                  if (currentUser?.user?.role === "STUDENT") {
                    setPaymentType("CREDIT_CARD");
                    const purchasePackageTypeId = getCookie(
                      "purchasePackageTypeId"
                    );
                    const purchasePackageId = getCookie("purchasePackageId");

                    if (purchasePackageTypeId && purchasePackageId) {
                      fetchPackageTypeDetails(purchasePackageTypeId as string);
                      fetchPackageDetails(purchasePackageId as string);
                    }
                  }
                }, [currentUser]);

                const fetchPackageTypeDetails = async (typeId: string) => {
                  try {
                    const response = await axiosInstance.get(
                      `/package_category/get/${typeId}`
                    );
                    setFieldValue("packageCategoryId", {
                      id: response.data.id,
                      name: response.data.name,
                    });
                    deleteCookie("purchasePackageTypeId");
                  } catch (error) {
                    console.error(
                      "Error fetching package type details:",
                      error
                    );
                    dispatch(
                      openAlert(
                        "Failed to fetch package type details. Please try again.",
                        "error"
                      )
                    );
                  }
                };

                const fetchPackageDetails = async (packageId: string) => {
                  try {
                    const response = await axiosInstance.get(
                      `/package/get/${packageId}`
                    );
                    setFieldValue("packageId", {
                      id: response.data.id,
                      name: response.data.name,
                      price: response.data.price,
                    });
                    deleteCookie("purchasePackageId");
                  } catch (error) {
                    console.error("Error fetching package details:", error);
                    dispatch(
                      openAlert(
                        "Failed to fetch package details. Please try again.",
                        "error"
                      )
                    );
                  }
                };

                return (
                  <Form>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Grid container spacing={2}>
                        <Grid container item xs={12} md={8} spacing={2}>
                          {currentUser?.user?.role &&
                            currentUser?.user?.role !== "STUDENT" && (
                              <Grid item xs={12} sm={6}>
                                <FormControl
                                  variant="standard"
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"userId"}>
                                    Student :
                                  </CustomLabel>
                                  <AutocompleteWithDynamicSearch
                                    disabled={!!student_id || formStep === 2}
                                    fieldName="userId"
                                    endpoint="/user/get"
                                    setFieldValue={setFieldValue}
                                    values={values}
                                    placeholder="Search Student"
                                    fetchedOptionsKey="users"
                                    getOptionLabel={(option: any) =>
                                      `${option.first_name} ${option.last_name}`
                                    }
                                  />
                                  {touched.userId && errors.userId && (
                                    <Typography variant="caption" color="error">
                                      {errors.userId as string}
                                    </Typography>
                                  )}
                                </FormControl>
                              </Grid>
                            )}
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
                                disabled={formStep === 2}
                                fieldName="driving_school"
                                endpoint="/driving-school/get"
                                setFieldValue={setFieldValue}
                                values={values}
                                placeholder="Search School"
                                fetchedOptionsKey=""
                                getOptionLabel={(option: any) =>
                                  `${option.name}`
                                }
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
                                touched.packageCategoryId &&
                                  errors.packageCategoryId
                              )}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"packageCategoryId"}>
                                Package Category:
                              </CustomLabel>
                              <AutocompleteWithDynamicSearch
                                disabled={formStep === 2}
                                fieldName="packageCategoryId"
                                endpoint="/package_category/get"
                                setFieldValue={setFieldValue}
                                values={values}
                                placeholder="Search Package Category"
                                getOptionLabel={(option: any) => option.name}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              variant="standard"
                              error={Boolean(
                                touched.packageId && errors.packageId
                              )}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"packageId"}>
                                Package :
                              </CustomLabel>
                              <AutocompleteWithDynamicSearch
                                disabled={formStep === 2}
                                existingPurchasedPackages={
                                  selectedStudent?.user
                                    ? selectedStudent?.user?.package
                                    : values?.userId?.package
                                }
                                fieldName="packageId"
                                endpoint="/package/get"
                                setFieldValue={setFieldValue}
                                values={values}
                                placeholder="Search Package"
                                fetchedOptionsKey="packages"
                                getOptionLabel={(option: any) => option.name}
                                packageCategory={values?.packageCategoryId}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              variant="standard"
                              error={Boolean(touched.coupon && errors.coupon)}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"coupon"}>
                                Coupon:
                              </CustomLabel>
                              <CustomInput
                                disabled={formStep === 2}
                                id={"coupon"}
                                type={"text"}
                                value={values.coupon}
                                name={"coupon"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                                placeholder="Enter Coupon"
                              />
                              {touched.coupon && errors.coupon && (
                                <FormHelperText>{errors.coupon}</FormHelperText>
                              )}
                            </FormControl>
                          </Grid>

                          {currentUser?.user?.role &&
                            currentUser?.user?.role !== "STUDENT" && (
                              <>
                                <Grid item xs={12} sm={6}>
                                  <FormControl
                                    variant="standard"
                                    error={Boolean(
                                      touched.additionalDiscount &&
                                        errors.additionalDiscount
                                    )}
                                    sx={{ width: "100%" }}
                                  >
                                    <CustomLabel
                                      shrink
                                      htmlFor={"additionalDiscount"}
                                    >
                                      Additional Discount:
                                    </CustomLabel>
                                    <CustomInput
                                      disabled={formStep === 2}
                                      id={"additionalDiscount"}
                                      type={"number"}
                                      value={values.additionalDiscount}
                                      name={"additionalDiscount"}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      inputProps={{}}
                                      placeholder="Enter Discount"
                                    />
                                    {touched.additionalDiscount &&
                                      errors.additionalDiscount && (
                                        <FormHelperText>
                                          {errors.additionalDiscount}
                                        </FormHelperText>
                                      )}
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl
                                    variant="standard"
                                    error={Boolean(
                                      touched.additionalAmount &&
                                        errors.additionalAmount
                                    )}
                                    sx={{ width: "100%" }}
                                  >
                                    <CustomLabel
                                      shrink
                                      htmlFor={"additionalAmount"}
                                    >
                                      Additional Amount:
                                    </CustomLabel>
                                    <CustomInput
                                      disabled={formStep === 2}
                                      id={"additionalAmount"}
                                      type={"number"}
                                      value={values.additionalAmount}
                                      name={"additionalAmount"}
                                      onBlur={handleBlur}
                                      onChange={handleChange}
                                      inputProps={{}}
                                      placeholder="Enter Amount"
                                    />
                                  </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                  <FormControl
                                    variant="standard"
                                    error={Boolean(
                                      touched.location && errors.location
                                    )}
                                    sx={{ width: "100%" }}
                                  >
                                    <CustomLabel shrink htmlFor={"location"}>
                                      Location: *
                                    </CustomLabel>
                                    <Field
                                      disabled={formStep === 2}
                                      fullWidth
                                      id="location"
                                      name="location"
                                      variant="outlined"
                                      color="primary"
                                      as={Select}
                                      placeholder="Select location"
                                    >
                                      <MenuItem value=" " disabled>
                                        Select Location
                                      </MenuItem>
                                      {[
                                        {
                                          label: "Telephone",
                                          value: "TELEPHONE",
                                        },
                                        { label: "Walk In", value: "WALK_IN" },
                                      ].map((item, index) => (
                                        <MenuItem
                                          value={item?.value}
                                          key={index}
                                        >
                                          {item?.label}
                                        </MenuItem>
                                      ))}
                                    </Field>
                                  </FormControl>
                                </Grid>
                              </>
                            )}
                          <Grid item xs={12} sm={6}>
                            <FormControl
                              variant="standard"
                              error={Boolean(
                                touched.paymentType && errors.paymentType
                              )}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"paymentType"}>
                                Payment Type:
                              </CustomLabel>
                              <Field
                                disabled={formStep === 2}
                                fullWidth
                                id="paymentType"
                                name="paymentType"
                                variant="outlined"
                                color="primary"
                                as={Select}
                                placeholder="Select Payment Type"
                                onChange={(e: any) => {
                                  handleChange(e);
                                  setPaymentType(e.target.value);
                                }}
                              >
                                <MenuItem value="" disabled>
                                  Select Payment Type
                                </MenuItem>
                                {[
                                  { label: "Cash", value: "CASH" },
                                  {
                                    label: "Credit Card",
                                    value: "CREDIT_CARD",
                                  },
                                  { label: "Debit Card", value: "DEBIT_CARD" },
                                  // { label: "Digital", value: "DIGITAL" },
                                ]
                                  .filter(
                                    (item) =>
                                      !(
                                        currentUser?.user?.role === "STUDENT" &&
                                        item.value === "CASH"
                                      )
                                  )
                                  .map((item, index) => (
                                    <MenuItem value={item?.value} key={index}>
                                      {item?.label}
                                    </MenuItem>
                                  ))}
                              </Field>
                            </FormControl>
                          </Grid>

                          {(paymentType === "CREDIT_CARD" ||
                            paymentType === "DEBIT_CARD" ||
                            paymentType === "DIGITAL" ||
                            currentUser?.user?.role === "STUDENT") && (
                            <>
                              <Grid item xs={12} sm={6}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(
                                    touched.cardholderName &&
                                      errors.cardholderName
                                  )}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel
                                    shrink
                                    htmlFor={"cardholderName"}
                                  >
                                    Cardholder Name:
                                  </CustomLabel>
                                  <CustomInput
                                    disabled={formStep === 2}
                                    id={"cardholderName"}
                                    type={"text"}
                                    value={values.cardholderName}
                                    name={"cardholderName"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                    placeholder="Enter Cardholder Name"
                                  />
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(
                                    touched.cardNumber && errors.cardNumber
                                  )}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"cardNumber"}>
                                    Card Number:
                                  </CustomLabel>
                                  <CustomInput
                                    disabled={formStep === 2}
                                    id={"cardNumber"}
                                    type={"text"}
                                    value={values.cardNumber}
                                    name={"cardNumber"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{ maxLength: 16 }}
                                    placeholder="Enter Card Number"
                                  />
                                  {touched.cardNumber && errors.cardNumber && (
                                    <FormHelperText>
                                      {errors.cardNumber}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(
                                    touched.expiryMonth && errors.expiryMonth
                                  )}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"expiryMonth"}>
                                    Expiration Month:
                                  </CustomLabel>

                                  <Box sx={{ display: "flex", mt: 3, gap: 4 }}>
                                    <Box>
                                      <CustomInput
                                        disabled={formStep === 2}
                                        id={"expiryMonth"}
                                        type={"text"}
                                        value={values.expiryMonth}
                                        name={"expiryMonth"}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{}}
                                        placeholder="MM"
                                      />
                                      {touched.expiryMonth &&
                                        errors.expiryMonth && (
                                          <FormHelperText>
                                            {errors.expiryMonth}
                                          </FormHelperText>
                                        )}
                                    </Box>

                                    <Box>
                                      <CustomInput
                                        disabled={formStep === 2}
                                        id={"expiryYear"}
                                        type={"text"}
                                        value={values.expiryYear}
                                        name={"expiryYear"}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        inputProps={{ maxLength: 4 }}
                                        placeholder="YYYY"
                                      />
                                      {touched.expiryYear &&
                                        errors.expiryYear && (
                                          <FormHelperText>
                                            {errors.expiryYear}
                                          </FormHelperText>
                                        )}
                                    </Box>
                                  </Box>
                                </FormControl>
                              </Grid>

                              <Grid item xs={12} sm={6}>
                                <FormControl
                                  variant="standard"
                                  error={Boolean(touched.cvv && errors.cvv)}
                                  sx={{ width: "100%" }}
                                >
                                  <CustomLabel shrink htmlFor={"cvv"}>
                                    CVV:
                                  </CustomLabel>
                                  <CustomInput
                                    disabled={formStep === 2}
                                    id={"cvv"}
                                    type={"text"}
                                    value={values.cvv}
                                    name={"cvv"}
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    inputProps={{}}
                                    placeholder="Enter CVV"
                                  />
                                  {touched.cvv && errors.cvv && (
                                    <FormHelperText>
                                      {errors.cvv}
                                    </FormHelperText>
                                  )}
                                </FormControl>
                              </Grid>
                            </>
                          )}
                          <Grid item xs={12}>
                            <FormControl
                              variant="standard"
                              error={Boolean(touched.note && errors.note)}
                              sx={{ width: "100%" }}
                            >
                              <CustomLabel shrink htmlFor={"note"}>
                                Note :
                              </CustomLabel>
                              <CustomInput
                                disabled={formStep === 2}
                                multiline
                                id={"note"}
                                type={"text"}
                                value={values.note}
                                name={"note"}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                inputProps={{}}
                                placeholder="Enter Note"
                                rows={4}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                        {values?.packageId?.price > 0 && (
                          <Grid item xs={12} md={4}>
                            <Box
                              sx={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "16px",
                                backgroundColor: "#ffffff",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  marginBottom: "16px",
                                  color: "#333",
                                  fontWeight: 700,
                                }}
                              >
                                Summary
                              </Typography>
                              <Divider sx={{ marginBottom: "16px" }} />
                              <Typography
                                variant="body1"
                                sx={{
                                  marginBottom: "8px",
                                  fontSize: "16px",
                                  fontWeight: 500,
                                }}
                              >
                                Package Price: $
                                {values?.packageId?.price.toFixed(2)}
                              </Typography>
                              {formStep === 2 && billingData && (
                                <>
                                  {billingData.discount > 0 && (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        marginBottom: "8px",
                                        fontSize: "16px",
                                        color: "#FF5722",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Discount: -$
                                      {billingData.discount.toFixed(2)}
                                    </Typography>
                                  )}
                                  {billingData.additionalAmount > 0 && (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        marginBottom: "8px",
                                        fontSize: "16px",
                                        color: "#4CAF50",
                                        fontWeight: 500,
                                      }}
                                    >
                                      Additional Amount: +$
                                      {billingData.additionalAmount.toFixed(2)}
                                    </Typography>
                                  )}
                                  {billingData.coupon ? (
                                    <>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          marginBottom: "8px",
                                          fontSize: "16px",
                                          color: "#4CAF50",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Coupon Applied:{" "}
                                        {billingData.coupon.data.code}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        sx={{
                                          marginBottom: "8px",
                                          fontSize: "16px",
                                          color: "#FF5722",
                                          fontWeight: 500,
                                        }}
                                      >
                                        Coupon Amount: -$
                                        {billingData.coupon.data.amount}
                                      </Typography>
                                    </>
                                  ) : null}
                                  {billingData.total && (
                                    <Typography
                                      variant="body1"
                                      sx={{
                                        fontWeight: "bold",
                                        fontSize: "18px",
                                        color: "#000",
                                      }}
                                    >
                                      Total: ${billingData.total.toFixed(2)}
                                    </Typography>
                                  )}
                                </>
                              )}
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop:
                          formStep === 2 && billingData ? "20px" : "100px",
                        marginBottom: "20px",
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
                        onClick={cancelTransaction}
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
                        Continue
                      </Button>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Box>
        </Box>
      </Box>

      <CustomDialog
        open={showConfirmationModal}
        handleClose={() => setShowConfirmationModal(false)}
        handleAccept={handleConfirmTransaction}
        dialogTitle="Confirm Transaction"
        fullWidth
        maxWidth="sm"
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to process this transaction?
          </Typography>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Package Price: ${billingData?.amount?.toFixed(2)}
          </Typography>
          {billingData?.additionalAmount > 0 && (
            <Typography variant="body1" sx={{ mb: 1, color: "#4CAF50" }}>
              Additional Amount: +${billingData.additionalAmount.toFixed(2)}
            </Typography>
          )}
          {billingData?.discount > 0 && (
            <Typography variant="body1" sx={{ mb: 1, color: "#FF5722" }}>
              Discount: -${billingData.discount.toFixed(2)}
            </Typography>
          )}
          {billingData?.coupon && (
            <>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Coupon Applied: {billingData.coupon.data.code}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, color: "#FF5722" }}>
                Coupon Amount: -${billingData.coupon.data.amount.toFixed(2)}
              </Typography>
            </>
          )}
          <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
            Total Amount: ${billingData?.total?.toFixed(2)}
          </Typography>
        </Box>
      </CustomDialog>
    </Container>
  );
};

export default AddTransactionView;
