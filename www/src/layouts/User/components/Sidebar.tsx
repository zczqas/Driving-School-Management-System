import * as React from "react";
import { useRouter } from "next/router";

// style + assets
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";

// third party
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { Box, Divider, IconButton } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

// project imports
import { navItems } from "./navItems";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface SidebarProps {
  open: boolean;
  handleDrawerClose: any;
  handleDrawerOpen: any;
}

// ============================|| SIDEBAR COMPONENT ||============================ //
const Sidebar = ({
  open,
  handleDrawerClose,
  handleDrawerOpen,
}: SidebarProps) => {
  const theme = useTheme();

  const { user } = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser
  );

  const router = useRouter();
  const { pathname } = router;

  console.log("pathname: " + pathname);

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.primary.main,
        },
      }}
    >
      <DrawerHeader
        sx={{
          height: "90px",
        }}
      >
        {!open ? (
          <IconButton onClick={handleDrawerOpen}>
            <KeyboardDoubleArrowRightRoundedIcon style={{ color: "#ffffff" }} />
          </IconButton>
        ) : (
          <IconButton onClick={handleDrawerClose}>
            <KeyboardDoubleArrowLeftRoundedIcon style={{ color: "#ffffff" }} />
          </IconButton>
        )}
      </DrawerHeader>
      <Divider
        sx={{
          background: "rgba(255, 255, 255, 0.60)",
        }}
      />
      <List
        sx={{
          pt: 2.5,
        }}
      >
        {navItems.map((item) => {
          if (user?.role === "INSTRUCTOR" && item?.name === "Pricing")
            return null;
          return (
            <ListItem key={item?.id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={() => router.push(item?.slug)}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  margin: 0.5,
                  borderRadius: "4px",
                  backgroundColor:
                    item?.slug === pathname ? "#48289B" : "transparent",
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item?.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item?.title ?? ""}
                  sx={{
                    opacity: open ? 1 : 0,
                    textTransform: "capitalize",
                    "& > span": {
                      color: "#fff",
                      fontWeight: 600,
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
