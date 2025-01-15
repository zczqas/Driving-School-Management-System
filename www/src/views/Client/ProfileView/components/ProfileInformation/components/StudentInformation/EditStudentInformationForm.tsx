import AddressAutoComplete from "@/components/AddressAutoComplete";
import {
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
  FormHelperText,
} from "@mui/material";

import { Field } from "formik";
import moment from "moment";
import React from "react";
import {
  InputFormLabel,
  CustomTextField,
  PageSection,
} from "../../ProfileInformation";
import AutocompleteWithDynamicSearch from "./components/AutoCompleteWithDynamicSearch";
import { CustomLabel, DatePicker } from "@/components/CustomInput";
import formatPhoneNumber from "@/utils/formatPhoneNumber";
import AddressAutoCompleteMapBox from "@/components/AddressAutoCompleteMapBox";
/**
 * Capitalizes the first letter of a given string.
 * @param {String} string - The input string to capitalize.
 * @returns {String} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string: String) {
  return string[0].toUpperCase() + string.slice(1);
}

const EditStudentInformationForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  editMode,
}: any) => {
  const handlePhoneNumberChange = (event: any) => {
    // Remove all non-numeric characters
    const cleaned = event.target.value.replace(/\D/g, "");

    // Limit the input to 10 digits
    if (cleaned.length <= 10) {
      const formattedPhoneNumber = formatPhoneNumber(cleaned);
      setFieldValue("phone", formattedPhoneNumber);
    }
  };

  const handlePhoneNumberBlur = (event: any) => {
    const cleaned = event.target.value.replace(/\D/g, "");
    if (cleaned.length !== 10) {
      setFieldValue("phone", cleaned);
    }
  };

  return (
    <PageSection id="field1">
      <Typography
        variant="h4"
        sx={{
          lineHeight: "32.5px",
          color: "#000000",
        }}
      >
        Student Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            variant="standard"
            fullWidth
            error={Boolean(touched.firstName && errors.firstName)}
          >
            <InputFormLabel htmlFor="firstName">First Name *</InputFormLabel>
            <CustomTextField
              size="small"
              id="firstName"
              name="firstName"
              value={values?.firstName}
              variant="outlined"
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={!editMode}
            />
            {touched.firstName && errors.firstName && (
              <FormHelperText error>{errors.firstName}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.lastName && errors.lastName)}
          >
            <InputFormLabel htmlFor="last-name">Last Name *</InputFormLabel>
            <CustomTextField
              id="last-name"
              type="text"
              className="lastName"
              value={values.lastName}
              name="lastName"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.lastName && errors.lastName && (
              <FormHelperText error>{errors.lastName}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.email && errors.email)}
          >
            <InputFormLabel htmlFor="email">Email</InputFormLabel>
            <CustomTextField
              id="email"
              type="text"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              minRows={2}
              disabled
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.notes && errors.notes)}
          >
            <InputFormLabel htmlFor="office-notes">Office Notes</InputFormLabel>
            <CustomTextField
              id="office-notes"
              type="text"
              value={values.notes}
              name="notes"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              multiline
              minRows={2}
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.address && errors.address)}
            size="small"
            sx={{
              "& > div": {
                borderRadius: "50px",
                "&:hover": {
                  "&& fieldset": {
                    border: "2px solid #EAECEE",
                  },
                },
              },
            }}
          >
            <InputFormLabel htmlFor="address">Address *</InputFormLabel>
            {/* <AddressAutoComplete
              name={"address"}
              inputValue={values?.address}
              setFieldValue={setFieldValue}
              disabled={!editMode}
              fieldKeys={{
                streetAddress: "address",
                city: "city",
                state: "state",
                country: "country",
                zip: "zip",
              }}
            /> */}
            <AddressAutoCompleteMapBox
              name={"address"}
              inputValue={values?.address}
              setFieldValue={setFieldValue}
              disabled={!editMode}
              fieldKeys={{
                streetAddress: "address",
                city: "city",
                state: "state",
                country: "country",
                zip: "zip",
              }}
            />
            {touched.address && errors.address && (
              <FormHelperText error>{errors.address}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.unit && errors.unit)}
          >
            <InputFormLabel htmlFor="unit">Apartment/Unit</InputFormLabel>
            <CustomTextField
              id="unit"
              type="text"
              value={values.unit}
              name="unit"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.city && errors.city)}
          >
            <InputFormLabel htmlFor="city">City</InputFormLabel>
            <CustomTextField
              id="city"
              type="text"
              value={values.city}
              name="city"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              // disabled={!editMode}
              disabled
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.state && errors.state)}
          >
            <InputFormLabel htmlFor="state">State</InputFormLabel>
            <CustomTextField
              id="state"
              type="text"
              value={values.state}
              name="state"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.zip && errors.zip)}
          >
            <InputFormLabel htmlFor="zip">Zip *</InputFormLabel>
            <CustomTextField
              id="zip"
              type="text"
              value={values.zip}
              name="zip"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.zip && errors.zip && (
              <FormHelperText error>{errors.zip}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.phone && errors.phone)}
            size="small"
          >
            <InputFormLabel htmlFor="phone">Cell Phone *</InputFormLabel>
            <CustomTextField
              id="phone"
              type="text"
              value={formatPhoneNumber(values.phone)}
              name="phone"
              onBlur={handlePhoneNumberBlur}
              onChange={handlePhoneNumberChange}
              size="small"
              disabled={!editMode}
            />
            {touched.phone && errors.phone && (
              <FormHelperText error>{errors.phone}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(touched.gender && errors.gender)}
          >
            <InputFormLabel id="gender-radio-group">Gender *</InputFormLabel>
            <RadioGroup
              row
              aria-labelledby="gender-radio-group"
              name="gender"
              value={values?.gender}
              onChange={(event) =>
                setFieldValue(
                  "gender",
                  (event.target as HTMLInputElement).value
                )
              }
            >
              {["FEMALE", "MALE", "OTHER"].map((item, index) => (
                <FormControlLabel
                  key={index}
                  value={item || "MALE"}
                  control={<Radio />}
                  label={capitalizeFirstLetter(item)}
                  disabled={!editMode}
                />
              ))}
            </RadioGroup>
            {touched.gender && errors.gender && (
              <FormHelperText error>{errors.gender}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(touched.birthDate && errors.birthDate)}
          >
            <InputFormLabel id="birthDate">Birth Date *</InputFormLabel>
            <DatePicker
              disableFuture
              name="birthDate"
              value={moment(values?.birthDate)}
              onChange={(newValue: any) => {
                let formattedDate = moment(newValue).format("YYYY-MM-DD");

                setFieldValue("birthDate", formattedDate);
              }}
              disabled={!editMode}
            />
            {touched.birthDate && errors.birthDate && (
              <FormHelperText error>{errors.birthDate}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            size="small"
            error={Boolean(touched.school && errors.school)}
            sx={{
              "& > div": {
                borderRadius: "50px",
                "&:hover": {
                  "&& fieldset": {
                    border: "2px solid #EAECEE",
                  },
                },
              },
            }}
          >
            <CustomLabel shrink htmlFor={"school"}>
              School: *
            </CustomLabel>
            <AutocompleteWithDynamicSearch
              fieldName="school"
              endpoint="/school/get"
              setFieldValue={setFieldValue}
              values={values}
              placeholder="Search School"
              fetchedOptionsKey="school"
              getOptionLabel={(option: any) => option.name}
            />
            {touched.school && errors.school && (
              <FormHelperText error>{errors.school}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputFormLabel id="certificate-radio-btn-groups">
              Receive Certificates
            </InputFormLabel>

            <RadioGroup
              aria-labelledby="certificate-radio-btn-groups"
              name="receiveCertificate"
            >
              <FormControlLabel
                value="mail"
                control={<Radio />}
                label="Mail me my certificate."
                disabled={!editMode}
              />
              <FormControlLabel
                value="pickup"
                control={<Radio />}
                label="I will pickup my certificate personally."
                disabled={!editMode}
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default EditStudentInformationForm;
