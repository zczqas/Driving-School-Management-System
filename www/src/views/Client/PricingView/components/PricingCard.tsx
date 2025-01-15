import { lato } from "@/themes/typography";
import { Box, Button, Typography } from "@mui/material";
import React from "react";

const PricingCard = ({ title, subTitle, pricing, handleSelect }: Props) => {
  const styles = {
    root: {
      width: "100%",
      maxWidth: "360px",
      minHeight: "240px",
      background: "#E9E3F7",
      boxShadow: "4px 4px 10px 0px #00000014 inset",
      borderRadius: "14px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
      "& h3, h5, h2": {
        fontFamily: lato.style.fontFamily,
      },
    },
  };
  return (
    <Box sx={styles.root}>
      <Box sx={{ mb: "38px" }}>
        <Typography
          variant="h3"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: "12px",
            fontWeight: "regular",
          }}
        >
          {subTitle}
        </Typography>
      </Box>

      <Box sx={{ mb: "18px" }}>
        <Typography
          variant="h2"
          sx={{
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ${pricing}
        </Typography>
      </Box>
      <Button
        onClick={handleSelect}
        variant="contained"
        color="primary"
        sx={{
          borderRadius: "100px",
          padding: "12px 0",
          textTransform: "none",
          fontSize: "16px",
          fontWeight: 600,
          maxWidth: "175px",
          letterSpacing: "0.16px",
          width: "100%",
        }}
      >
        Select Plan
      </Button>
    </Box>
  );
};

export default PricingCard;

interface Props {
  title: string;
  subTitle: string;
  pricing: string;
  handleSelect: () => void;
}
