import { openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

const AboutSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        pt: "40px",
        pb: "80px",
        px: constants.paddingContainerX,
        backgroundColor: "#FAF4F5",
      }}
    >
      <Box sx={{ mb: "85px" }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: "center",
            fontFamily: openSans.style.fontFamily,
            fontSize: "18px",
            fontWeight: 400,
            mb: "8px",
          }}
        >
          Who we are?
        </Typography>
        <Typography
          variant="h3"
          sx={{
            textAlign: "center",
            fontFamily: openSans.style.fontFamily,
            fontSize: "42px",
            fontWeight: 600,
          }}
        >
          About Safety First Driving School
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column-reverse", md: "row" },
          gap: "40px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            " & p": {
              fontFamily: openSans.style.fontFamily,
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "normal",
              letterSpacing: "0.16px",
              color: "#1E1E1E",
            },
            "& p>span": {
              fontWeight: 600,
            },
            display: "flex",
            flexDirection: "column",
            gap: "30px",
            flex: 1,
          }}
        >
          <Typography component={"p"}>
            We offer <span>online driver’s education,</span> behind the wheel
            lessons and traffic school. Along with a staff that will go above
            and beyond to help you. We are here to help those in the Ventura and
            Los Angeles county to get a driver’s license or those that have
            gotten a ticket and need that point off their record.
          </Typography>
          <Typography component={"p"}>
            We service the areas of{" "}
            <span>
              Malibu (extra fee involved) Calabasas, Agoura Hills, Oak Park,
              West Lake Village, Thousand Oaks, Moorpark, Newbury Park and
              Camarillo.
            </span>{" "}
            Even for those outside of our area we try to make accommodations to
            fit those students.
          </Typography>
          <Typography component={"p"}>
            Safety First offers Driver’s Education course to students of{" "}
            <span>all ages.</span> If you have a child that is 15 ½ they must
            complete Driver’s Education before they take the permit test at the
            DMV. For those that are 17 ½ and older this program can help you to
            pass the test even though it is not required. We have been teaching
            students of all ages for over 25+ years with a{" "}
            <span>passing rate well above 99%.</span> For those having
            difficulty passing the permit test we go above and beyond to help.
          </Typography>
        </Box>
        <Box
          sx={{
            position: "relative",
            height: "298px",
            width: {
              xs: "450px",
              md: "850px",
            },
          }}
        >
          <Image
            src="/assets/landing/about-image.webp"
            fill
            style={{ objectFit: "contain" }}
            alt="About us"
            aria-label="About us"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AboutSection;
