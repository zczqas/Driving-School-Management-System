import React, { useState } from "react";
import moment from "moment";

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
  Stack,
  Typography,
  FormHelperText,
} from "@mui/material";

// style + assets
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Download, DownloadRounded } from "@mui/icons-material";
import { lato } from "@/themes/typography";
import CustomDialog from "@/components/CustomDialog";
import { Field, Form, Formik } from "formik";

// import yup
import * as Yup from "yup";
import {
  CustomInput,
  CustomLabel,
  CustomSelect as Select,
} from "@/components/CustomInput";
import AddressAutoComplete from "@/components/AddressAutoComplete";
import { useAppDispatch, useAppSelector } from "@/hooks";

import {
  createTransactionStart,
  fetchTransactionsByTransactionId,
  fetchTransactionsByUserIdStart,
  fetchTransactionsStart,
  updateTransaction,
} from "@/store/account/account.actions";
import { useRouter } from "next/router";
import AutocompleteWithDynamicSearch from "../Transactions/components/AutoComplete";
import IRootState from "@/store/interface";
import { isValidCardNumber } from "@/utils/validateCardNumber";

const UpdateTransactionView = () => {
  const router = useRouter();
  // const [addNewTransactionDialog, setAddNewTransactionDialog] =
  //   React.useState(false);

  // function handleOpenAddNewTransactionDialog() {
  //   setAddNewTransactionDialog(true);
  // }

  // function handleCloseAddNewTransactionDialog() {
  //   setAddNewTransactionDialog(false);
  // }
  const styles = {
    root: {
      display: "flex",
      background: "#fff",
      flexDirection: "column",
      height: "100%",
      minHeight: "90vh",
    },
  };
  const dispatch = useAppDispatch();
  const { transactionById, transactionByIdLoading } = useAppSelector(
    (state: IRootState) => state.account
  );

  const [paymentType, setPaymentType] = useState("");

  React.useEffect(() => {
    const transactionId = router.query.id as string;
    dispatch(fetchTransactionsByTransactionId(transactionId));
  }, []);

  const { transactionStatus, referrer } = router.query;

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
            {transactionStatus === "PENDING" ? "Settle" : "Update"} Transaction
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ padding: "14px 18px", display: "flex " }}>
          <Box>
            <Formik
              initialValues={{
                userId: { id: null, first_name: "", last_name: "" },
                packageId: { id: null, name: "" },
                packageCategoryId: { id: null, name: "" },
                coupon: "",
                additionalDiscount: null,
                additionalAmount: null,
                location: " ",
                paymentType: "",
                note: "",
                cardholderName: "",
                cardNumber: "",
                expiryMonth: "",
                expiryYear: "",
                cvv: "",
              }}
              validationSchema={Yup.object().shape({
                userId: Yup.object().required("Student is required"),
                packageId: Yup.object().required("Package is required"),
                // coupon: Yup.string().required("Coupon is required"),
                // additionalDiscount: Yup.number().required(
                //   "Additional discount is required"
                // ),
                // additionalAmount: Yup.number().required(
                //   "Additional amount is required"
                // ),
                location:
                  transactionStatus === "pending"
                    ? Yup.string().required("Location is required")
                    : Yup.string().notRequired(),
                paymentType: Yup.string().required("Payment type is required"),
                ...(paymentType === "CREDIT_CARD" ||
                paymentType === "DEBIT_CARD"
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
                            const currentMonth = moment().month() + 1;
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
              })}
              onSubmit={async (
                values,
                { setErrors, setStatus, setSubmitting }
              ) => {
                console.log("values", values);
                const transactionFields = {
                  user_id: values?.userId?.id,
                  package_id: values?.packageId?.id,
                  coupon: values.coupon,
                  discount: values.additionalDiscount,
                  packageCategoryId: values.packageCategoryId?.id,
                  additional_amount: values.additionalAmount,
                  method: values.paymentType,
                  // status:
                  ...(transactionStatus !== "PENDING" && {
                    location: values.location,
                  }), // Conditionally include location
                  ...(transactionStatus === "PENDING" && { status: "SETTLED" }), // If pending then make it settled
                  // note: values.note,
                };

                dispatch(
                  updateTransaction(
                    router.query.id as string,
                    transactionFields,
                    () => {
                      // router.back();
                      if (referrer === "PROFILE_PAGE" && values?.userId?.id) {
                        // dispatch(
                        //   fetchTransactionsByUserIdStart(
                        //     values?.userId?.id as string,
                        //     transactionStatus === "PENDING"
                        //       ? "PENDING"
                        //       : "SETTLED"
                        //   )
                        // );
                        router.push(
                          `/manage/profile/${values?.userId?.id}?tabValue=1`
                        );
                      } else {
                        dispatch(fetchTransactionsStart());
                      }
                    }
                  )
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
              }) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                React.useEffect(() => {
                  if (transactionById) {
                    setFieldValue("paymentType", transactionById?.method);
                    setFieldValue("userId", transactionById?.user);
                    setFieldValue("packageId", transactionById?.package);
                    setFieldValue(
                      "packageCategoryId",
                      transactionById?.package?.category
                    );
                    setFieldValue("coupon", transactionById?.coupon);
                    setFieldValue(
                      "additionalDiscount",
                      transactionById?.discount
                    );
                    setFieldValue(
                      "additionalAmount",
                      transactionById?.additional_amount
                    );
                    setFieldValue("location", transactionById?.location || "");
                    setFieldValue("note", transactionById?.note);
                  }
                }, [transactionById]);
                return (
                  <Form>
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Grid container spacing={2} maxWidth={"md"}>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(touched.userId && errors.userId)}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"userId"}>
                              Student :
                            </CustomLabel>
                            <AutocompleteWithDynamicSearch
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
                            <CustomLabel shrink htmlFor={"packageCategoryId"}>
                              Package Category:
                            </CustomLabel>
                            <AutocompleteWithDynamicSearch
                              fieldName="packageCategoryId"
                              endpoint="/package_category/get"
                              setFieldValue={setFieldValue}
                              values={values}
                              placeholder="Search Package Category"
                              // fetchedOptionsKey="packages"
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
                              id={"coupon"}
                              type={"text"}
                              value={values.coupon}
                              name={"coupon"}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              inputProps={{}}
                              placeholder="Enter Coupon"
                            />
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <FormControl
                            variant="standard"
                            error={Boolean(
                              touched.additionalDiscount &&
                                errors.additionalDiscount
                            )}
                            sx={{ width: "100%" }}
                          >
                            <CustomLabel shrink htmlFor={"additionalDiscount"}>
                              Additional Discount:
                            </CustomLabel>
                            <CustomInput
                              id={"additionalDiscount"}
                              type={"number"}
                              value={values.additionalDiscount}
                              name={"additionalDiscount"}
                              onBlur={handleBlur}
                              onChange={handleChange}
                              inputProps={{}}
                              placeholder="Enter Discount"
                            />
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
                            <CustomLabel shrink htmlFor={"additionalAmount"}>
                              Additional Amount:
                            </CustomLabel>
                            <CustomInput
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
                        {transactionStatus === "PENDING" ? null : (
                          <Grid item xs={12} sm={6}>
                            <CustomLabel
                              shrink
                              htmlFor={"location"}
                              sx={{ pl: "5px" }}
                            >
                              Location :
                            </CustomLabel>
                            <FormControl
                              fullWidth
                              variant="standard"
                              error={Boolean(
                                touched.location && errors.location
                              )}
                            >
                              <AddressAutoComplete
                                name={"location"}
                                inputValue={values?.location}
                                setFieldValue={setFieldValue}
                              />
                            </FormControl>
                          </Grid>
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
                              <MenuItem value=" " disabled>
                                Payment Type :
                              </MenuItem>
                              {[
                                "CASH",
                                "CREDIT_CARD",
                                "DEBIT_CARD",
                                "DIGITAL",
                              ].map((item, index) => (
                                <MenuItem value={item} key={item}>
                                  {item}
                                </MenuItem>
                              ))}
                            </Field>
                          </FormControl>
                        </Grid>
                        {(paymentType === "CREDIT_CARD" ||
                          paymentType === "DEBIT_CARD") && (
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
                                <CustomLabel shrink htmlFor={"cardholderName"}>
                                  Cardholder Name:
                                </CustomLabel>
                                <CustomInput
                                  id={"cardholderName"}
                                  type={"text"}
                                  value={values.cardholderName}
                                  name={"cardholderName"}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  inputProps={{}}
                                  placeholder="Enter Cardholder Name"
                                />
                                {touched.cardholderName &&
                                  errors.cardholderName && (
                                    <FormHelperText>
                                      {errors.cardholderName}
                                    </FormHelperText>
                                  )}
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
                                  Expiration Date:
                                </CustomLabel>
                                <Box sx={{ display: "flex", mt: 3, gap: 4 }}>
                                  <Box>
                                    <CustomInput
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
                                  <FormHelperText>{errors.cvv}</FormHelperText>
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
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: "140px",
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
                        // onClick={() => handleSubmit()}
                        type="submit"
                      >
                        {transactionStatus === "PENDING" ? "Settle" : "Update"}
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

export default UpdateTransactionView;
