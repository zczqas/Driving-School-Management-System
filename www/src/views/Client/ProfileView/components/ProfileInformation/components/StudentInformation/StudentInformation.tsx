import { Grid, Typography } from "@mui/material";

import React from "react";
import styles from "../../tableStyles.module.css";
import { lato } from "@/themes/typography";
import { PageSection } from "../../ProfileInformation";
import formatPhoneNumber from "@/utils/formatPhoneNumber";

/**
 * Capitalizes the first letter of a given string.
 * @param {String} string - The input string to capitalize.
 * @returns {String} The input string with the first letter capitalized.
 */
function capitalizeFirstLetter(string: String) {
  return string[0].toUpperCase() + string.slice(1);
}

const StudentInformationTable = ({ values, userRole, editMode }: any) => {
  console.log(values, "values student information");
  return (
    <PageSection id="field1">
      <Typography
        variant="h4"
        sx={{
          lineHeight: "32.5px",
          color: "#000000",
        }}
      >
        {userRole} Information
      </Typography>
      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>First Name:</td>
              <td>{values?.firstName !== "" ? values?.firstName : "-"}</td>
            </tr>
            <tr>
              <td>Last Name:</td>
              <td>{values?.lastName !== "" ? values?.lastName : "-"}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>{values?.email !== "" ? values?.email : "-"}</td>
            </tr>
            <tr>
              <td>Office Notes:</td>
              <td>{values?.notes !== "" ? values?.notes : "-"}</td>
            </tr>
            <tr>
              <td>Cell Phone:</td>
              <td>
                {values?.phone !== "" ? formatPhoneNumber(values?.phone) : "-"}
              </td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{values?.gender !== "" ? values?.gender : "-"}</td>
            </tr>
            <tr>
              <td>Birth Date:</td>
              <td>{values?.birthDate !== "" ? values?.birthDate : "-"}</td>
            </tr>
            <tr>
              <td>School:</td>
              <td>{values?.school?.id !== "" ? values?.school?.name : "-"}</td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={6}>
          <table className={styles.table}>
            <tr>
              <td>Address:</td>
              <td>{values?.address !== "" ? values?.address : "-"}</td>
            </tr>
            <tr>
              <td>Apartment/Unit:</td>
              <td>{values?.unit !== "" ? values?.unit : "-"}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{values?.city !== "" ? values?.city : "-"}</td>
            </tr>
            <tr>
              <td>State:</td>
              <td>{values?.state !== "" ? values?.state : "-"}</td>
            </tr>
            <tr>
              <td>Zip:</td>
              <td>{values?.zip !== "" ? values?.zip : "-"}</td>
            </tr>
            <tr>
              <td> Certificates:</td>
              {/* <td>{values?.birthDate !== "" ? values?.birthDate : "-"}</td> */}
            </tr>
          </table>
        </Grid>
      </Grid>
    </PageSection>
  );
};

export default StudentInformationTable;
