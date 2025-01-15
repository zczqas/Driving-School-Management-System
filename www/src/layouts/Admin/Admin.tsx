import * as React from "react";

// project imports
import Topbar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

// third party imports
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";

// styles
const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AdminLayoutProps {
  children: React.ReactNode;
}

// ==============================|| ADMIN LAYOUT ||============================== //
export default function AdminLayout({ children }: AdminLayoutProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(
    localStorage.getItem("sidebar") === "open" ?? false
  );

  const handleDrawerOpen = () => {
    setOpen(true);
    localStorage.setItem("sidebar", "open");
  };

  const handleDrawerClose = () => {
    setOpen(false);
    localStorage.setItem("sidebar", "close");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Topbar open={open} />
      <Sidebar
        open={open}
        handleDrawerClose={handleDrawerClose}
        handleDrawerOpen={handleDrawerOpen}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundColor: "backgroundColor.main",
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        <Box>{children}</Box>
      </Box>
    </Box>
  );
}
