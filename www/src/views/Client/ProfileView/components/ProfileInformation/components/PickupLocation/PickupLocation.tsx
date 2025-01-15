// third party libraries
import { FormControl, Grid, Typography } from "@mui/material";

// project imports
import {
  CustomTextField,
  InputFormLabel,
  PageSection,
} from "../../ProfileInformation";
import { lato } from "@/themes/typography";
import styles from "../../tableStyles.module.css";

// ==============================|| Pickup Location COMPONENT ||============================== //
const PickUpLocation = ({ values }: any) => {
  return (
    <PageSection id="field3">
      <Typography variant="h4">Alternate Pickup Location</Typography>

      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Name:</td>
              <td>
                {values?.pickUpLocationName !== ""
                  ? values?.pickUpLocationName
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Apartment/Unit:</td>
              <td>
                {values?.pickUpLocationUnit !== ""
                  ? values?.pickUpLocationUnit
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Address:</td>
              <td>
                {values?.pickUpLocationAddress !== ""
                  ? values?.pickUpLocationAddress
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>City:</td>
              <td>
                {values?.pickUpLocationCity !== ""
                  ? values?.pickUpLocationCity
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default PickUpLocation;
