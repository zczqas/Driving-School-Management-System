// third party libraries
import {
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
  FormHelperText,
} from "@mui/material";
import { Field } from "formik";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../../ProfileInformation";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

// ==============================|| CONTACT INFORMATION COMPONENT ||============================== //
const EditContactInformationForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  editMode,
}: any) => {
  const handlePhoneNumberChange = (fieldName: any) => (event: any) => {
    const cleaned = event.target.value.replace(/\D/g, "");

    if (cleaned?.length <= 10) {
      const formattedPhoneNumber = formatPhoneNumber(cleaned);
      setFieldValue(fieldName, formattedPhoneNumber);
    }
  };

  const handlePhoneNumberBlur = (fieldName: any) => (event: any) => {
    const cleaned = event.target.value.replace(/\D/g, "");
    if (cleaned?.length !== 10) {
      setFieldValue(fieldName, cleaned);
    }
  };
  return (
    <PageSection id="field2">
      <Typography variant="h4">1st Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.contactName && errors.contactName)}
            size="small"
          >
            <InputFormLabel htmlFor="contactName">
              Contact Name *
            </InputFormLabel>
            <CustomTextField
              id="contactName"
              type="text"
              value={values.contactName}
              name="contactName"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.contactName && errors.contactName && (
              <FormHelperText error>{errors.contactName}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            size="small"
            error={Boolean(touched.contactRelation && errors.contactRelation)}
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
            <InputFormLabel id="contact-relation">
              Contact Relation *
            </InputFormLabel>

            <Field
              fullWidth
              id="contact-relation"
              name="contactRelation"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
              <MenuItem value={"Spouse"}>Spouse</MenuItem>
              <MenuItem value={"Self"}>Self</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Field>
            {touched.contactRelation && errors.contactRelation && (
              <FormHelperText error>{errors.contactRelation}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.contactEmail && errors.contactEmail)}
            size="small"
          >
            <InputFormLabel htmlFor="contactEmail">
              Contact Email
            </InputFormLabel>
            <CustomTextField
              id="contactEmail"
              type="email"
              value={values.contactEmail}
              name="contactEmail"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.contactEmail && errors.contactEmail && (
              <FormHelperText error>{errors.contactEmail}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.contactPhone && errors.contactPhone)}
            size="small"
          >
            <InputFormLabel htmlFor="contactPhone">
              Contact Cell Phone *
            </InputFormLabel>
            <CustomTextField
              id="contactPhone"
              type="text"
              value={values.contactPhone}
              name="contactPhone"
              onBlur={handlePhoneNumberBlur("contactPhone")}
              onChange={handlePhoneNumberChange("contactPhone")}
              size="small"
              disabled={!editMode}
            />
            {touched.contactPhone && errors.contactPhone && (
              <FormHelperText error>{errors.contactPhone}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>

      <Divider
        sx={{
          margin: "30px 0",
        }}
      />

      <Typography variant="h4">2nd Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.secondContactName && errors.secondContactName
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactName">
              Contact Name
            </InputFormLabel>
            <CustomTextField
              id="secondContactName"
              type="text"
              value={values.secondContactName}
              name="secondContactName"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.secondContactName && errors.secondContactName && (
              <FormHelperText error>{errors.secondContactName}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            size="small"
            error={Boolean(touched.secondContactRelation && errors.secondContactRelation)}
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
            <InputFormLabel id="secondContactRelation">
              Contact Relation
            </InputFormLabel>

            <Field
              fullWidth
              id="secondContactRelation"
              name="secondContactRelation"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
              <MenuItem value={"Spouse"}>Spouse</MenuItem>
              <MenuItem value={"Self"}>Self</MenuItem>
              <MenuItem value={"Other"}>Other</MenuItem>
            </Field>
            {touched.secondContactRelation && errors.secondContactRelation && (
              <FormHelperText error>{errors.secondContactRelation}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.secondContactEmail && errors.secondContactEmail
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactEmail">
              Contact Email
            </InputFormLabel>
            <CustomTextField
              id="secondContactEmail"
              type="email"
              value={values.secondContactEmail}
              name="secondContactEmail"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.secondContactEmail && errors.secondContactEmail && (
              <FormHelperText error>{errors.secondContactEmail}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.secondContactPhone && errors.secondContactPhone
            )}
            size="small"
          >
            <InputFormLabel htmlFor="secondContactPhone">
              Contact Cell Phone
            </InputFormLabel>
            <CustomTextField
              id="secondContactPhone"
              type="text"
              value={values.secondContactPhone}
              name="secondContactPhone"
              onBlur={handlePhoneNumberBlur("secondContactPhone")}
              onChange={handlePhoneNumberChange("secondContactPhone")}
              size="small"
              disabled={!editMode}
            />
            {touched.secondContactPhone && errors.secondContactPhone && (
              <FormHelperText error>{errors.secondContactPhone}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default EditContactInformationForm;