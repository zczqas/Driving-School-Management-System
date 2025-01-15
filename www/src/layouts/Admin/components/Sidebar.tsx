import * as React from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/auth.actions"; // Adjust the import path according to your project structure

// style + assets
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import KeyboardDoubleArrowLeftRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftRounded";
import LogoutIcon from "@mui/icons-material/Logout";

// third party
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import { Collapse, Divider, IconButton, Typography } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ExpandMore, ExpandLess, DriveEta } from "@mui/icons-material";

// project imports
import { navItems } from "./navItems";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { openSans } from "@/themes/typography";

const drawerWidth = 320;

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
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      // Add custom scrollbar styles
      "&::-webkit-scrollbar": {
        width: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.3)",
        borderRadius: "4px",
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255, 255, 255, 0.5)",
      },
    },
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

  const dispatch = useDispatch<any>();

  const memoizedDispatch = React.useCallback(dispatch, [dispatch]);

  const router = useRouter();
  const { pathname } = router;
  const [subItemOpenRootIds, setSubItemOpenRootIds] = React.useState<number[]>(
    () => {
      // Retrieve from local storage on component mount
      const storedIds = sessionStorage.getItem("subItemOpenRootIds");
      return storedIds ? JSON.parse(storedIds) : [];
    }
  );
  const currentUser = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  // =========== Handle Menu Dropdown =========== //
  function handleMenuDropdown(id: number) {
    const updatedIds = subItemOpenRootIds.includes(id)
      ? subItemOpenRootIds.filter((subId) => subId !== id)
      : [...subItemOpenRootIds, id];
    setSubItemOpenRootIds(updatedIds);

    // Store in local storage
    sessionStorage.setItem("subItemOpenRootIds", JSON.stringify(updatedIds));
  }

  function handleLogout() {
    memoizedDispatch(logout());
  }

  const navItemsFiltered = navItems?.filter(
    (item) =>
      (item?.role?.includes(currentUser?.role?.toLowerCase()) ||
        currentUser?.role?.toLowerCase() === "super_admin") &&
      (!item.showIfDriverEd || currentUser?.driver_ed)
  );

  return (
    <Drawer
      variant="permanent"
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.primary.main,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflowY: "auto", // Enable vertical scrolling
        },
      }}
      //disabled the hover effect
      // onMouseEnter={handleDrawerOpen}
      // onMouseLeave={handleDrawerClose}
    >
      <div>
        <DrawerHeader
          sx={{
            height: "100px", // Increased height
            display: "flex",
            justifyContent: open ? "space-between" : "center",
            alignItems: "center",
            px: 2,
            py: 1, // Added vertical padding
          }}
        >
          {open && (
            <>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                  fontFamily: openSans.style.fontFamily,
                  marginLeft: 6, // Added left margin,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                }}
                onClick={() => router.replace("/")}
              >
                <DriveEta sx={{ color: "#ffffff", fontSize: "2rem" }} />
                DSMS
              </Typography>
            </>
          )}
          <IconButton
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            sx={{ marginRight: open ? 0 : 1 }} // Added right margin when closed
          >
            {open ? (
              <KeyboardDoubleArrowLeftRoundedIcon
                style={{ color: "#ffffff" }}
              />
            ) : (
              <KeyboardDoubleArrowRightRoundedIcon
                style={{ color: "#ffffff" }}
              />
            )}
          </IconButton>
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
          {navItemsFiltered.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => {
                    handleDrawerOpen();
                    if (item?.subNavItems && item?.subNavItems.length > 0) {
                      handleMenuDropdown(item?.id);
                    } else {
                      router?.replace(item?.slug);
                    }
                  }}
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
                        fontWeight: 700,
                        fontFamily: openSans.style.fontFamily,
                      },
                    }}
                  />
                  {/* Conditionally render dropdown icon for items with subNavItems */}
                  {open &&
                    item?.subNavItems &&
                    item?.subNavItems.length > 0 && (
                      <ListItemIcon
                        sx={{
                          minWidth: 0, // Adjust as needed
                          justifyContent: "center",
                          transform: subItemOpenRootIds.includes(item.id)
                            ? "rotate(180deg)"
                            : "none",
                          transition: "transform 0.3s",
                          color: "white",
                        }}
                      >
                        <ExpandMore />
                      </ListItemIcon>
                    )}
                </ListItemButton>
              </ListItem>

              {item?.subNavItems && item?.subNavItems.length > 0
                ? item?.subNavItems
                    ?.filter(
                      (row) =>
                        row?.role?.includes(currentUser?.role?.toLowerCase()) ||
                        currentUser?.role?.toLowerCase() === "super_admin"
                    )
                    .map((subItem) => (
                      <ListItem
                        key={subItem?.id}
                        disablePadding
                        sx={{ display: "block" }}
                      >
                        <Collapse
                          in={subItemOpenRootIds.includes(item?.id) && open}
                          timeout="auto"
                          unmountOnExit
                        >
                          <List component="div" disablePadding>
                            <ListItem
                              key={subItem?.id}
                              disablePadding
                              sx={{
                                display: "block",
                                pl: 4,
                              }}
                            >
                              <ListItemButton
                                onClick={() => router.replace(subItem?.slug)}
                                sx={{
                                  minHeight: 48,
                                  justifyContent: open ? "initial" : "center",
                                  px: 2.5,
                                  margin: 0.5,
                                  borderRadius: "4px",
                                  backgroundColor:
                                    subItem?.slug === pathname
                                      ? "#48289B"
                                      : "transparent",
                                }}
                              >
                                <ListItemIcon
                                  sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : "auto",
                                    justifyContent: "center",
                                  }}
                                >
                                  {subItem?.icon}
                                </ListItemIcon>
                                <ListItemText
                                  primary={subItem?.title ?? ""}
                                  sx={{
                                    opacity: open ? 1 : 0,
                                    textTransform: "capitalize",
                                    "& > span": {
                                      color: "#fff",
                                      fontWeight: 500,
                                      fontFamily: openSans.style.fontFamily,
                                    },
                                  }}
                                />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </Collapse>
                      </ListItem>
                    ))
                : null}
            </React.Fragment>
          ))}
        </List>
      </div>
      <ListItem disablePadding sx={{ display: "block", mt: "auto" }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            minHeight: 48,
            justifyContent: open ? "initial" : "center",
            px: 2.5,
            margin: 0.5,
            borderRadius: "4px",
            backgroundColor: "transparent",
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              justifyContent: "center",
            }}
          >
            <LogoutIcon fontSize="small" sx={{ color: "#fff" }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
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
    </Drawer>
  );
};

export default Sidebar;
