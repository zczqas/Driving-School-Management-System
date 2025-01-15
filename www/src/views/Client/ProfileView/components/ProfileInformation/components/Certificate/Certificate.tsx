// third party libraries
import { Divider, Grid, Typography } from "@mui/material";

// project imports
import { PageSection } from "../../ProfileInformation";

import styles from "../../tableStyles.module.css";
import { lato } from "@/themes/typography";

// ==============================|| CERTIFICATE COMPONENT ||============================== //
const Certificate = ({ values }: any) => {
  return (
    <PageSection id="field5">
      <Typography variant="h4">Drivers Ed (Pink) Certificate</Typography>
      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>D.E. Cert number:</td>
              <td>{values?.pinkCertNum !== "" ? values?.pinkCertNum : "-"}</td>
            </tr>
            <tr>
              <td>D.E. Cert issue date:</td>
              <td>{values?.pinkCertDate !== "" ? values?.pinkCertDate : "-"}</td>
            </tr>
            <tr>
              <td>D.E. Cert instructor:</td>
              <td>{values?.pinkCertInst !== "" ? values?.pinkCertInst : "-"}</td>
            </tr>
          </table>
        </Grid>
      </Grid>
      <Divider
        sx={{
          margin: "30px 0",
        }}
      />

      <Typography variant="h4">Drivers Ed (Gold) Certificate</Typography>
      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>D.E. Cert number:</td>
              <td>{values?.goldCertNum !== "" ? values?.goldCertNum : "-"}</td>
            </tr>
            <tr>
              <td>D.E. Cert issue date:</td>
              <td>{values?.goldCertDate !== "" ? values?.goldCertDate : "-"}</td>
            </tr>
            <tr>
              <td>D.E. Cert instructor:</td>
              <td>{values?.goldCertInst !== "" ? values?.goldCertInst : "-"}</td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default Certificate;
