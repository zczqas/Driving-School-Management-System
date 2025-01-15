// third party libraries
import {
  Divider,
  FormControl,
  Grid,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { Field } from "formik";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../../ProfileInformation";
import { DatePicker } from "@/components/CustomInput";

// ==============================|| EDIT CERTIFICATE COMPONENT ||============================== //
const EditCertificateForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  editMode,
}: any) => {
  return (
    <PageSection id="field5">
      <Typography variant="h4">Drivers Ed (Pink) Certificate</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.pinkCertNum && errors.pinkCertNum)}
            size="small"
          >
            <InputFormLabel htmlFor="pinkCertNum">
              D.E. Cert number
            </InputFormLabel>
            <CustomTextField
              id="pinkCertNum"
              type="text"
              value={values.pinkCertNum}
              name="pinkCertNum"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputFormLabel id="pinkCertDate">
              D.E. cert issue date
            </InputFormLabel>
            <DatePicker name="pinkCertDate" disabled={!editMode} />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
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
            <InputFormLabel id="pink-cert-instructor">
              D.E. Cert instructor
            </InputFormLabel>

            <Field
              fullWidth
              id="pink-cert-instructor"
              name="pinkCertInst"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
            </Field>
          </FormControl>
        </Grid>
      </Grid>

      <Divider
        sx={{
          margin: "30px 0",
        }}
      />

      <Typography variant="h4">Drivers Ed (Gold) Certificate</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(touched.goldCertNum && errors.goldCertNum)}
            size="small"
          >
            <InputFormLabel htmlFor="goldCertNum">
              D.E. Cert number
            </InputFormLabel>
            <CustomTextField
              id="goldCertNum"
              type="text"
              value={values.goldCertNum}
              name="goldCertNum"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl>
            <InputFormLabel id="goldCertDate">
              D.E. cert issue date
            </InputFormLabel>
            <DatePicker name="goldCertDate" disabled={!editMode} />
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
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
            <InputFormLabel id="gold-cert-instructor">
              D.E. Cert instructor
            </InputFormLabel>

            <Field
              fullWidth
              id="gold-cert-instructor"
              name="goldCertInst"
              variant="outlined"
              color="primary"
              as={Select}
              disabled={!editMode}
            >
              <MenuItem value={"Father"}>Father</MenuItem>
              <MenuItem value={"Mother"}>Mother</MenuItem>
            </Field>
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default EditCertificateForm;
