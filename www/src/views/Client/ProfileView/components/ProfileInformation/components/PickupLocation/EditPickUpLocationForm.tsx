// third party libraries
import { FormControl, Grid, Typography, FormHelperText } from "@mui/material";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../../ProfileInformation";
// import AddressAutoComplete from "@/components/AddressAutoComplete";
import AddressAutoCompleteMapBox from "@/components/AddressAutoCompleteMapBox";

// ==============================|| Pickup Location COMPONENT ||============================== //
const EditPickUpLocationForm = ({
  touched,
  errors,
  values,
  handleChange,
  handleBlur,
  setFieldValue,
  editMode,
}: any) => {
  return (
    <PageSection id="field3">
      <Typography variant="h4">Alternate Pickup Location</Typography>

      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.pickUpLocationName && errors.pickUpLocationName
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationName">Name *</InputFormLabel>
            <CustomTextField
              id="pickUpLocationName"
              type="text"
              value={values.pickUpLocationName}
              name="pickUpLocationName"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.pickUpLocationName && errors.pickUpLocationName && (
              <FormHelperText error>{errors.pickUpLocationName}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.pickUpLocationAddress && errors.pickUpLocationAddress
            )}
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
            <InputFormLabel htmlFor="pickUpLocationAddress">
              Address *
            </InputFormLabel>
            {/* <AddressAutoComplete
              name="pickUpLocationAddress"
              inputValue={values.pickUpLocationAddress}
              setFieldValue={setFieldValue}
              disabled={!editMode}
              fieldKeys={{
                city: "pickUpLocationCity",
              }}
            /> */}
            <AddressAutoCompleteMapBox
              name="pickUpLocationAddress"
              inputValue={values.pickUpLocationAddress}
              setFieldValue={setFieldValue}
              disabled={!editMode}
              fieldKeys={{
                city: "pickUpLocationCity",
              }}
            />
            {touched.pickUpLocationAddress && errors.pickUpLocationAddress && (
              <FormHelperText error>
                {errors.pickUpLocationAddress}
              </FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.pickUpLocationUnit && errors.pickUpLocationUnit
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationUnit">
              Apartment/Unit
            </InputFormLabel>
            <CustomTextField
              id="pickUpLocationUnit"
              type="text"
              value={values.pickUpLocationUnit}
              name="pickUpLocationUnit"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              disabled={!editMode}
            />
            {touched.pickUpLocationUnit && errors.pickUpLocationUnit && (
              <FormHelperText error>{errors.pickUpLocationUnit}</FormHelperText>
            )}
          </FormControl>
        </Grid>

        <Grid item xs={6}>
          <FormControl
            fullWidth
            variant="standard"
            error={Boolean(
              touched.pickUpLocationCity && errors.pickUpLocationCity
            )}
            size="small"
          >
            <InputFormLabel htmlFor="pickUpLocationCity">City *</InputFormLabel>
            <CustomTextField
              id="pickUpLocationCity"
              type="text"
              value={values.pickUpLocationCity}
              name="pickUpLocationCity"
              onBlur={handleBlur}
              onChange={handleChange}
              size="small"
              // disabled={!editMode}
              disabled={true}
            />
            {touched.pickUpLocationCity && errors.pickUpLocationCity && (
              <FormHelperText error>{errors.pickUpLocationCity}</FormHelperText>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default EditPickUpLocationForm;
