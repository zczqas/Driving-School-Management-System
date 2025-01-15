import { inter, openSans } from "@/themes/typography";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";
import React from "react";

const JobDescriptionSection = () => {
  return (
    <Box
      component={"section"}
      sx={{
        px: "30px",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        maxWidth: "1595px",
        margin: "0 auto",
      }}
    >
      <Box sx={{ fontFamily: openSans.style.fontFamily }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: inter.style.fontFamily,
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "normal",
          }}
        >
          Driving Instructor
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            mb: "40px",
            color: "#ACACAC",
            fontSize: "14px",
            letterSpacing: "0.14px",
          }}
        >
          Open position
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: "14px",
            fontFamily: inter.style.fontFamily,
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          About company
        </Typography>
        <Typography paragraph>
          Safety First is seeking people that love to teach, drive and have fun
          on the job!
        </Typography>
        <Typography paragraph>
          We are growing and need new Driving Instructors to work in the San
          Fernando, Conejo and Simi Valleys and other areas of Ventura county.
          Familiarity with these areas is a plus but not necessary. Previous
          experience in teaching or professional driving is a big plus but note
          necessary. Female and bi-lingual instructors are in high demand.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: "14px",
            fontFamily: inter.style.fontFamily,
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Job description
        </Typography>
        <Typography paragraph>
          At Safety First Driving School, we are passionate about teaching and
          training people to drive. We are looking for talented people with
          great communication skills and a desire to make a difference. If you
          want a growth opportunity with an industry leader we want to talk with
          you.
        </Typography>
        <Typography paragraph>
          As a Driving Instructor candidate at Safety First, you will
          participate in our world-class instructor-training program that
          prepares you for a state certification and an rewarding, fun career
          teaching young people a skill they will use for life.
        </Typography>

        <Typography
          variant="h6"
          sx={{
            mb: "14px",
            fontFamily: inter.style.fontFamily,
            fontWeight: 500,
            lineHeight: "normal",
          }}
        >
          Requirements
        </Typography>
        <List>
          {[
            "Must be high energy and able to connect with teens",
            "Passionate about teaching and driving",
            "Patient and enthusiastic with new learners",
            "Exceptional customer service skills",
            "Must be 21 or older, have a high school diploma or GED and have a clean driving record",
            "Must pass a background check",
            "Willing to work 20 hours a week or more including at least one weekend day",
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 0 }}>
              <ListItemText primary={`• ${item}`} />
            </ListItem>
          ))}
        </List>

        <Typography sx={{ mt: 4 }}>
          Our office is in Westlake Village but covers areas from San Fernando
          Valley to Santa Barbara.
        </Typography>
        <Typography sx={{ mt: 2, fontWeight: "bold" }}>
          For applicants with a current Instructor License, we pay a sign on
          bonus!
        </Typography>
      </Box>
    </Box>
  );
};

export default JobDescriptionSection;
