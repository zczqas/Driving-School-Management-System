// third party libraries
import { Divider, Grid, Typography } from "@mui/material";

// project imports
import { PageSection } from "../../ProfileInformation";
import { lato } from "@/themes/typography";
import styles from "../../tableStyles.module.css";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

// ==============================|| CONTACT INFORMATION COMPONENT ||============================== //
const ContactInformation = ({ values }: any) => {
  return (
    <PageSection id="field2" sx={{ fontFamily: lato.style.fontFamily }}>
      <Typography variant="h4">1st Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Contact Name:</td>
              <td>{values?.contactName !== "" ? values?.contactName : "-"}</td>
            </tr>
            <tr>
              <td>Contact Email:</td>
              <td>
                {values?.contactEmail !== "" ? values?.contactEmail : "-"}
              </td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Contact Relation:</td>
              <td>
                {values?.contactRelation !== "" ? values?.contactRelation : "-"}
              </td>
            </tr>
            <tr>
              <td>Contact Cell Phone:</td>
              <td>
                {values?.contactPhone !== ""
                  ? formatPhoneNumber(values?.contactPhone)
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
      </Grid>

      <Divider
        sx={{
          margin: "30px 0",
        }}
      />

      <Typography variant="h4">2nd Emergency Contact Information</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Contact Name:</td>
              <td>
                {values?.secondContactName !== ""
                  ? values?.secondContactName
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Contact Email:</td>
              <td>
                {values?.secondContactEmail !== ""
                  ? values?.secondContactEmail
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Contact Relation:</td>
              <td>
                {values?.secondContactRelation !== ""
                  ? values?.secondContactRelation
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Contact Cell Phone:</td>
              <td>
                {values?.secondContactPhone !== ""
                  ? values?.secondContactPhone
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default ContactInformation;
