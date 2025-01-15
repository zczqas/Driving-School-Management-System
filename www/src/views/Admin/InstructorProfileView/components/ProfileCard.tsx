import React from "react";

import { Box, Stack, Typography, Avatar, IconButton } from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

interface Props {
  id?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  verified: boolean;
  role: string;
}

const ProfileCard = ({
  id,
  firstName,
  middleName,
  lastName,
  email,
  verified,
  role,
}: Props) => {
  function capitalizeFirstLetter(string: any) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }

  return (
    <Box
      sx={{
        padding: "22px 18px",
        backgroundColor: "primary.light",
      }}
    >
      <Typography
        variant="h5"
        sx={{ fontWeight: "600", fontSize: "20px", mb: 3, pl: 1 }}
      >
        {capitalizeFirstLetter(role)} Profile
      </Typography>
      <Stack direction={"row"} spacing={2} justifyContent={"flex-start"}>
        <Box sx={{ position: "relative" }}>
          <Avatar
            sx={{
              height: "100px",
              width: "100px",
              textTransform: "uppercase",
              backgroundColor: "hsla(21, 89%, 58%, 1)",
            }}
          >
            {firstName?.slice(0, 1) + lastName?.slice(0, 1)}
          </Avatar>

          <IconButton
            sx={{
              position: "absolute",
              bottom: "0px",
              right: "-10px",
            }}
          >
            <img src="/icons/cameraicon.svg" alt="edit" />
          </IconButton>
        </Box>
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontSize: "22px",
              color: "#1E293B",
              letterSpacing: "-0.8px",
              lineHeight: "30.14px",
              paddingTop: "10px",
            }}
          >
            {`${firstName} ${middleName ? middleName + " " : ""}${lastName}`}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#7E84A3",
            }}
          >
            {email}
          </Typography>
          {verified ? (
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                pt: "20px",
                pb: "5px",
              }}
              spacing={1}
            >
              <CheckCircleRoundedIcon color="success" />
              <Typography sx={{ color: "#7E84A3" }}>
                Verified {capitalizeFirstLetter(role)}
              </Typography>
            </Stack>
          ) : (
            <Stack
              direction={"row"}
              alignItems={"center"}
              sx={{
                pt: "20px",
                pb: "5px",
              }}
              spacing={1}
            >
              <CancelRoundedIcon color="error" />
              <Typography>Unverified {capitalizeFirstLetter(role)}</Typography>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default ProfileCard;
