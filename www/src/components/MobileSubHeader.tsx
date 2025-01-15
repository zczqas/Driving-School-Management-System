import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";

interface MobileSubHeaderProps {
  title?: string;
  backLink?: string | null;
  rightAction?: React.ReactNode;
  notificationIcon?: boolean;
}

/**
 * Mobile SubHeader Component
 * @param title - Title of the page
 * @param backLink - Link to go back
 * @param rightAction - ReactNode for right action
 * @param notificationIcon - default is true, Overrides to false if rightAction is provided
 * @returns MobileSubHeader
 * @see MobileSubHeaderProps
 * @see MobileSubHeader
 */
const MobileSubHeader = ({
  title,
  backLink,
  rightAction,
  notificationIcon = true,
}: MobileSubHeaderProps) => {
  const router = useRouter();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "56px",
        px: 2,
        width: "100%",
        backgroundColor: "background.main",
        // borderBottom: '1px solid',
        // borderColor: 'divider',
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      {/* Left Section */}
      <Box sx={{ width: "48px" }}>
        {backLink && (
          <IconButton
            onClick={() => router.push(backLink)}
            sx={{ p: 1 }}
            aria-label="back"
          >
            <ArrowBack />
          </IconButton>
        )}
      </Box>

      {/* Center Title */}
      <Typography
        variant="h6"
        component="h1"
        sx={{
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          fontWeight: 500,
          fontSize: "1.125rem",
        }}
      >
        {title}
      </Typography>

      {/* Right Section */}
      <Box sx={{ width: "48px" }}>
        {rightAction ? (
          rightAction
        ) : notificationIcon ? (
          <NotificationButton />
        ) : null}
      </Box>
    </Box>
  );
};

export default MobileSubHeader;

const NotificationButton = () => {
  return (
    <IconButton sx={{ p: 1 }} aria-label="notification">
      <NotificationsNoneOutlinedIcon />
    </IconButton>
  );
};
