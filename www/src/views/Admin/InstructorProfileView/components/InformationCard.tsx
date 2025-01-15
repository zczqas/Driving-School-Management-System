import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import styles from "../tableStyles.module.css";
import { lato } from "@/themes/typography";

interface Props {
  userRole: string;
  firstName: string;
  lastName: string;
  notes: string;
  phone: string;
  gender: string;
  birthDate: string;
  school: { id: string; name: string };
  address: string;
  city: string;
  unit: string;
  state: string;
  zip: string;
}

const InformationCard = ({
  userRole,
  firstName,
  lastName,
  notes,
  phone,
  gender,
  birthDate,
  school,
  address,
  city,
  unit,
  state,
  zip,
}: Props) => {
  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          lineHeight: "32.5px",
          color: "#000000",
          my: 2,
        }}
      >
        {capitalizeFirstLetter(userRole)} Information
      </Typography>
      <Grid container spacing={3} sx={{ fontFamily: lato.style.fontFamily }}>
        <Grid item xs={12} md={3}>
          <table className={styles.table}>
            <tr>
              <td>First Name:</td>
              <td>{firstName !== "" ? firstName : "-"}</td>
            </tr>
            <tr>
              <td>Last Name:</td>
              <td>{lastName !== "" ? lastName : "-"}</td>
            </tr>
            <tr>
              <td>Office Notes:</td>
              <td>{notes !== "" ? notes : "-"}</td>
            </tr>
            <tr>
              <td>Cell Phone:</td>
              <td>{phone !== "" ? phone : "-"}</td>
            </tr>
            <tr>
              <td>Gender:</td>
              <td>{gender !== "" ? gender : "-"}</td>
            </tr>
            <tr>
              <td>Birth Date:</td>
              <td>{birthDate !== "" ? birthDate : "-"}</td>
            </tr>
          </table>
        </Grid>
        <Grid item xs={12} md={3}>
          <table className={styles.table}>
            <tr>
              <td>Address:</td>
              <td>{address !== "" ? address : "-"}</td>
            </tr>
            <tr>
              <td>Apartment/Unit:</td>
              <td>{unit !== "" ? unit : "-"}</td>
            </tr>
            <tr>
              <td>City:</td>
              <td>{city !== "" ? city : "-"}</td>
            </tr>
            <tr>
              <td>State:</td>
              <td>{state !== "" ? state : "-"}</td>
            </tr>
            <tr>
              <td>Zip:</td>
              <td>{zip !== "" ? zip : "-"}</td>
            </tr>
          </table>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InformationCard;
