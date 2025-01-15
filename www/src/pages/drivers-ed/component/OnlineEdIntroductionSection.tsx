import { inter, openSans } from "@/themes/typography";
import { Box, Typography } from "@mui/material";
import React from "react";

const OnlineEdIntroductionSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        pt: "80px",
        px: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* ====== Title ======= */}
      <Typography
        variant="h4"
        sx={{
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
          fontSize: "42px",
          fontWeight: 600,
          mb: "16px",
          lineHeight: "normal",
        }}
      >
        {`Online Driver's Education Course`}
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
          fontSize: "18px",
          fontWeight: 400,
          color: "#1E1E1E",
          maxWidth: "1268px",
          letterSpacing: "0.18px",
          mb: "90px",
        }}
      >
        Our online driver education course is fun and easy. What you can expect
        with this course
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          textAlign: "center",
          fontFamily: openSans.style.fontFamily,
          fontSize: "18px",
          fontWeight: 400,
          color: "#454545",
          maxWidth: "847px",
          letterSpacing: "0.18px",
          mb: "52px",
        }}
      >
        {` When you register with Safety First, you will receive an e-mail to get
        started with your online Driver's Education course along with your
        Username and Password`}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "30px",
          maxWidth: "1070px",
          width: "100%",
          rowGap: "38px",
          columnGap: "130px",
        }}
      >
        {[
          "10 chapters and a final exam",
          "Format makes it simple to understand",
          "Thorough information you need",
          "No classroom attendance required",
          "Start and stop anytime you want",
        ].map((text, index) => (
          <Box
            key={index}
            sx={{
              maxWidth: "470px",
              width: "100%",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "6px",
              boxShadow: "0px 2px 16px 0px rgba(182, 149, 255, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                fontSize: "20px",
                fontWeight: 400,
                color: "#000",
                textAlign: "center",
                fontFamily: inter.style.fontFamily,
              }}
            >
              {text}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OnlineEdIntroductionSection;
