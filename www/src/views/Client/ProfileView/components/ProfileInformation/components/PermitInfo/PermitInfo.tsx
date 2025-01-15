// third party libraries
import { Grid, Typography } from "@mui/material";

// project imports
import { PageSection } from "../../ProfileInformation";
import { lato } from "@/themes/typography";

// import styles
import styles from "../../tableStyles.module.css";
import formatDateToString from "@/utils/formatDateToString";

// ==============================|| PERMIT INFO COMPONENT ||============================== //
const PermitInfo = ({ values }: any) => {
  console.log({ values });
  return (
    <PageSection id="field4">
      <Typography variant="h4">Permit Info</Typography>
      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Permit Number:</td>
              <td>{values?.permitNumber ?? "-"}</td>
            </tr>
            <tr>
              <td>Permit Date Issued:</td>
              <td>
                {values?.permitDateIssued ?
                  formatDateToString(values?.permitDateIssued)
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Permit Endorsed by:</td>
              <td>
                {values?.permitEndorsedBy 
                  ? values?.permitEndorsedBy?.first_name +
                    " " +
                    values?.permitEndorsedBy?.last_name
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Permit Expiration Date:</td>
              <td>
                {values?.permitExpDate 
                  ? formatDateToString(values?.permitExpDate)
                  : "-"}
              </td>
            </tr>
            <tr>
              <td>Permit Endorsed Date:</td>
              <td>
                {values?.permitEndorsedDate
                  ? formatDateToString(values?.permitEndorsedDate)
                  : "-"}
              </td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default PermitInfo;
