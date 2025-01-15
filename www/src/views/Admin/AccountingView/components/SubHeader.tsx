import React from "react";

// third party libraries
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  Typography,
} from "@mui/material";

// style + assets
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Download, DownloadRounded } from "@mui/icons-material";
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
import { useAppDispatch } from "@/hooks";
import AutocompleteWithDynamicSearch from "./Transactions/components/AutoComplete";
import {
  createTransactionStart,
  fetchTransactionsStart,
} from "@/store/account/account.actions";
import { useRouter } from "next/router";

// ==============================|| SUB HEADER ||============================== //
const SubHeader = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [addNewTransactionDialog, setAddNewTransactionDialog] =
    React.useState(false);

  function handleOpenAddNewTransactionDialog() {
    setAddNewTransactionDialog(true);
  }

  function handleCloseAddNewTransactionDialog() {
    setAddNewTransactionDialog(false);
  }

  const [selectedPackageType, setSelectedPackageType] = React.useState<any>({});
  return (
    <>
      <CustomDialog
        handleClose={handleCloseAddNewTransactionDialog}
        handleAccept={handleOpenAddNewTransactionDialog}
        open={addNewTransactionDialog}
        dialogTitle="Add Transaction"
        isFormikForm
        fullWidth
      >
        <Formik
          initialValues={{
            userId: { id: null, first_name: "", last_name: "" },
            packageId: { id: null, name: "" },
            packageCategoryId: { id: null, name: "" },
            coupon: "",
            additionalDiscount: null,
            additionalAmount: null,
            location: " ",
            paymentType: " ",
            note: "",
          }}
          // validationSchema={Yup.object().shape({
          //   userId: Yup.object().required("Student is required"),
          //   packageId: Yup.object().required("Package is required"),
          //   coupon: Yup.string().required("Coupon is required"),
          //   additionalDiscount: Yup.number().required(
          //     "Additional discount is required"
          //   ),
          //   additionalAmount: Yup.number().required(
          //     "Additional amount is required"
          //   ),
          //   location: Yup.string().required("Location is required"),
          //   paymentType: Yup.string().required("Payment type is required"),
          // })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            console.log("values", values);
            const transactionFields = {
              user_id: values?.userId?.id,
              package_id: values?.packageId?.id,
              coupon: values.coupon,
              discount: values.additionalDiscount,
              additional_amount: values.additionalAmount,
              location: values.location,
              method: values.paymentType,
              // note: values.note,
            };
            console.log(values);

            dispatch(
              createTransactionStart(
                transactionFields,
                () => {
                  handleCloseAddNewTransactionDialog();
                  dispatch(fetchTransactionsStart());
                  router.push(
                    `/manage/profile/${values?.userId?.id}?tabValue=1`
                  );
                },
                () => {}
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
                        error={Boolean(touched.packageId && errors.packageId)}
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
                        error={Boolean(touched.packageId && errors.packageId)}
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
                          touched.additionalAmount && errors.additionalAmount
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
                        error={Boolean(touched.location && errors.location)}
                      >
                        <AddressAutoComplete
                          name={"location"}
                          inputValue={values?.location}
                          setFieldValue={setFieldValue}
                        />
                      </FormControl>
                    </Grid>
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
                        >
                          <MenuItem value=" " disabled>
                            Payment Type :
                          </MenuItem>
                          {["CASH", "CREDIT_CARD", "DEBIT_CARD", "DIGITAL"].map(
                            (item, index) => (
                              <MenuItem value={item} key={item}>
                                {item}
                              </MenuItem>
                            )
                          )}
                        </Field>
                      </FormControl>
                    </Grid>
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
                          placeholder="Enter Amount"
                          rows={4}
                        />
                      </FormControl>
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
                    onClick={() => handleCloseAddNewTransactionDialog()}
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
                    Add
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </CustomDialog>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        py={4}
      >
        <Box>
          <Typography variant="h3">Statements and Invoicing</Typography>
          <Typography variant="body1">
            Your payment and subscription details
          </Typography>
        </Box>
        <Box>
          {" "}
          {/* <Button
            variant="contained"
            startIcon={<DownloadRounded />}
            sx={{
              backgroundColor: "#1E293B",
              color: "#fff",
              borderRadius: "32px",
              "&:hover": {
                backgroundColor: "#1E293B",
              },
              mr: 0.8,
            }}
          >
            Download{" "}
          </Button> */}
          {/* <Button
            variant="contained"
            endIcon={<AddRoundedIcon />}
            sx={{
              borderRadius: "32px",
              color: "#fff",
            }}
            color="primary"
            onClick={() => router.push("/manage/accounting/create")}
          >
            Add New Student Transaction
          </Button> */}
        </Box>
      </Stack>
    </>
  );
};

export default SubHeader;
