// third party libraries
import {
  FormControl,
  Grid,
  Icon,
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
import { CustomLabel, DatePicker } from "@/components/CustomInput";
import AutocompleteWithDynamicSearch from "./components/AutoCompleteWithDynamicSearch";
import moment from "moment";

// ==============================|| EDIT PERMIT INFO COMPONENT ||============================== //
const EditPermitInfoForm = ({
  touched,
  errors,
  values,
  handleChange,
  setFieldValue,
  handleBlur,
  editMode,
  permitNumberRef,
}: any) => {
  return (
    <PageSection id="field4">
      <Typography variant="h4">Permit Info</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.permitNumber && errors.permitNumber)}
            size="small"
          >
            <InputFormLabel htmlFor="permitNumber">
              Permit Number *
            </InputFormLabel>
            <Field
              name="permitNumber"
              as={CustomTextField}
              type="text"
              value={values.permitNumber}
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
              inputProps={{ maxLength: 8 }}
              inputRef={permitNumberRef}
            />
            {touched.permitNumber && errors.permitNumber && (
              <FormHelperText error>{errors.permitNumber}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6} />

        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(touched.permitDateIssued && errors.permitDateIssued)}
          >
            <InputFormLabel id="permitDateIssued">
              Permit Date Issued *
            </InputFormLabel>
            <DatePicker
              disableFuture
              name="permitDateIssued"
              value={moment(values?.permitDateIssued)}
              onChange={(newValue: any) => {
                let formattedDate = moment(newValue).format("YYYY-MM-DD");

                setFieldValue("permitDateIssued", formattedDate);
                if (formattedDate) {
                  let expDate = moment(newValue)
                    .add(1, "year")
                    .format("YYYY-MM-DD");
                  setFieldValue("permitExpDate", expDate);
                }
              }}
            />
            {touched.permitDateIssued && errors.permitDateIssued && (
              <FormHelperText error>{errors.permitDateIssued}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(touched.permitExpDate && errors.permitExpDate)}
          >
            <InputFormLabel id="permitExpDate">
              Permit Expiration Date *
            </InputFormLabel>
            <DatePicker
              disablePast
              name="permitExpDate"
              value={moment(values?.permitExpDate)}
              onChange={(newValue: any) => {
                let formattedDate = moment(newValue).format("YYYY-MM-DD");

                setFieldValue("permitExpDate", formattedDate);
              }}
            />
            {touched.permitExpDate && errors.permitExpDate && (
              <FormHelperText error>{errors.permitExpDate}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            variant="standard"
            error={Boolean(touched.permitEndorsedBy && errors.permitEndorsedBy)}
            fullWidth
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
            <InputFormLabel id="permitEndorsedBy">
              Permit Endorsed by
            </InputFormLabel>

            <AutocompleteWithDynamicSearch
              fieldName="permitEndorsedBy"
              endpoint="/user/get"
              setFieldValue={setFieldValue}
              values={values}
              placeholder="Search Instructor"
              fetchedOptionsKey="users"
              getOptionLabel={(option: any) =>
                `${option.first_name} ${option.last_name}`
              }
              userRole="INSTRUCTOR"
            />
            {touched.permitEndorsedBy && errors.permitEndorsedBy && (
              <FormHelperText error>{errors.permitEndorsedBy}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            error={Boolean(
              touched.permitEndorsedDate && errors.permitEndorsedDate
            )}
          >
            <InputFormLabel id="permitEndorsedDate">
              Permit Endorsed Date
            </InputFormLabel>
            <DatePicker
              name="permitEndorsedDate"
              value={moment(values?.permitEndorsedDate)}
              onChange={(newValue: any) => {
                let formattedDate = moment(newValue).format("YYYY-MM-DD");
                setFieldValue("permitEndorsedDate", formattedDate);
              }}
              disabled={!values.permitEndorsedBy}
            />
            {touched.permitEndorsedDate && errors.permitEndorsedDate && (
              <FormHelperText error>{errors.permitEndorsedDate}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default EditPermitInfoForm;
