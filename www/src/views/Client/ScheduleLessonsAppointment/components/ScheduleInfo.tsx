import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import Image from "next/image";
import React from "react";

interface Lesson {
  id: number;
  name: string;
  // Add other fields if needed
}

interface Package {
  id: number;
  name: string;
  lessons: Lesson[];
  // Add other fields if needed
}

const ScheduleInfo = ({ scheduleData, details }: any) => {
  let selectedLesson: Lesson | undefined;
  let selectedPackage: Package | undefined;

  details?.user?.package?.forEach((pkg: Package) => {
    const lesson = pkg.lessons?.find(
      (lesson: Lesson) => lesson.id === scheduleData?.lesson_id
    );
    if (lesson) {
      selectedLesson = lesson;
    }

    if(pkg.id === scheduleData?.package_id) {
      selectedPackage = pkg;
    }
  });

  return (
    <Box>
      <Grid container spacing={2} sx={{ paddingTop: 1, px: 3 }}>
        <Grid item xs={3}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Student :{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {details?.user?.first_name || "---"}
                {` ${details?.user?.last_name || ""}` || "---"}
              </span>
            </Typography>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Lessons:{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {selectedLesson?.name || "---"}
              </span>
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Pickup Location:{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {scheduleData?.pickup_location_type_name || "---"}
              </span>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Packages of students:{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {selectedPackage?.name || "---"}
              </span>
            </Typography>

            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Pickup Location Text:{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {scheduleData?.pickup_location_text || "---"}
              </span>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={4}>
          <Box
            sx={{
              display: "flex",
              alignItems: "end",
              height: "100%",
            }}
          >
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: "17px",
                color: "rgba(79, 91, 103, 1)",
              }}
            >
              Notes:{" "}
              <span
                style={{
                  fontWeight: 400,
                  fontSize: "15px",
                  color: "rgba(0, 0, 0, 1)",
                }}
              >
                {scheduleData?.notes ?? "---"}
              </span>
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={1}>
          {/* <IconButton>
            <Image
              src="/assets/icons/edit.svg"
              width={20}
              height={20}
              alt="Edit Icon"
            />
          </IconButton> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduleInfo;
