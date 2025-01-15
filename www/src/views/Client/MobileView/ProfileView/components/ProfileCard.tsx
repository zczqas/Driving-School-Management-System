import React from "react";
import {
  Avatar,
  Stack,
  Typography,
  Box,
  Tooltip,
  Badge,
  Skeleton,
} from "@mui/material";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";

interface ProfileCardProps {
  firstName?: string;
  lastName?: string;
  email?: string;
  isVerified?: boolean;
  isActive?: boolean;
  drivingSchool?: string;
  loading?: boolean;
  isAdmin?: boolean;
  onToggleLock?: () => void;
}

const ProfileCard = ({
  firstName = "",
  lastName = "",
  email = "",
  isVerified = false,
  isActive = true,
  drivingSchool,
  loading = false,
  isAdmin = false,
  onToggleLock,
}: ProfileCardProps) => {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)} ${last.charAt(0)}`;
  };

  return (
    <Box>
      <Stack direction="column" justifyContent="center" alignItems="center">
        {!loading ? (
          <Tooltip title={isVerified ? "Verified" : "Unverified"}>
            <Avatar
              sx={{
                height: "90px",
                width: "90px",
                textTransform: "uppercase",
                backgroundColor: "hsla(21, 89%, 58%, 1)",
                fontSize: "40px",
              }}
            >
              {getInitials(firstName, lastName)}
            </Avatar>
          </Tooltip>
        ) : (
          <Box>
            <Skeleton variant="circular" width={72} height={72} />
          </Box>
        )}

        {!loading ? (
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontSize: "20px",
                color: "#1E293B",
                letterSpacing: "-0.5px",
                lineHeight: "32px",
                paddingTop: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
              }}
            >
              {`${firstName} ${lastName}`}
              <Tooltip title={isVerified ? "Verified" : "Unverified"}>
                <Badge
                  sx={{ ml: 2 }}
                  badgeContent={
                    isVerified ? (
                      <CheckCircleRoundedIcon color="success" />
                    ) : (
                      <CancelRoundedIcon color="error" />
                    )
                  }
                />
              </Tooltip>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#7E84A3",
                fontSize: "10px",
                lineHeight: "22px",
                fontWeight: 500,
              }}
            >
              {drivingSchool} | {email}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%" }}>
            <Skeleton
              variant="text"
              sx={{ fontSize: "18px", paddingTop: "10px" }}
            />
            <Skeleton
              variant="text"
              sx={{ fontSize: "10px", paddingTop: "10px" }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ProfileCard;
