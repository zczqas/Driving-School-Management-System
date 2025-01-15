import { dmSans, openSans } from "@/themes/typography";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const MoreInfoCard = ({ title, link, image }: MoreInfoCardProps) => {
  return (
    <Box
      sx={{
        color: "#000",
        fontFamily: openSans.style.fontFamily,
        maxWidth: "300px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "16px",
        boxShadow: "0px 4px 14px 4px rgba(0, 0, 0, 0.20)",
      }}
    >
      <Box
        sx={{
          height: "138px",
          position: "relative",
          mb: "24px",
        }}
      >
        <Image
          src={image}
          fill
          alt={`${title} image`}
          style={{
            borderRadius: "6px",
            objectFit: "cover",
          }}
        />
      </Box>
      <Typography
        sx={{
          fontSize: "20px",
          fontWeight: 600,
          textAlign: "center",
          mb: "45px",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          variant="outlined"
          sx={{
            borderRadius: "50px",
            fontSize: "18px",
            background: "linear-gradient(100deg, #F37636 -17%, #816AB6 99.2%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textFillColor: "transparent", // For non-webkit browsers,
            border: "1.4px solid #F37636",
            padding: "10px 20px",
            fontWeight: 500,
            fontFamily: dmSans.style.fontFamily,
          }}
        >
          Learn More
        </Button>
      </Box>
    </Box>
  );
};

export default MoreInfoCard;

interface MoreInfoCardProps {
  title: string;
  link: string;
  image: string;
}
