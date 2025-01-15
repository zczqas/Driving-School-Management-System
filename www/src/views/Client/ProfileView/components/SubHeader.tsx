import React from "react";

// third party libraries
import { Box, Button, Stack, Typography } from "@mui/material";

// style + assets
import AddRoundedIcon from "@mui/icons-material/AddRounded";

interface SubHeaderProps {
  title: string;
  subTitle: string;
  children: React.ReactNode;
}

// ==============================|| SUB HEADER ||============================== //
const SubHeader = ({ title, subTitle, children }: SubHeaderProps) => {
  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      width={"100%"}
      py={4}
    >
      <Box>
        <Typography variant="h3">{title ?? ""}</Typography>
        <Typography variant="body1">{subTitle ?? ""}</Typography>
      </Box>
      <Box sx={{ minHeight: "36px", display: "flex", alignItems: "center" }}>
        {children}
      </Box>
    </Stack>
  );
};

export default SubHeader;
