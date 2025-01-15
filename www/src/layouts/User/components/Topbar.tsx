import React, { useCallback } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

// project imports
import hyphenToCapitalCase from "@/utils/helper";

// third party
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";

import { useDispatch } from "react-redux";
import { logout } from "@/store/auth/auth.actions";
import { useAppSelector } from "@/hooks";

interface TopbarProps {
  open: boolean;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// ============================|| TOPBAR COMPONENT ||============================ //
const Topbar = ({ open }: TopbarProps) => {
  const router = useRouter();

  const {
    currentUser: { user },
  } = useAppSelector((state) => state.auth);

  const { id } = router.query;
  const {
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);

  const dispatch = useDispatch<any>();
  const memoizedDispatch = useCallback(dispatch, [dispatch]);
  const { pathname } = router;

  const match = pathname.match(/\/manage\/(.+)/);
  let pageTitle = match ? match[1] : null;
  if (pageTitle === "profile") {
    if (id) {
      if (detailsById?.user?.role === "STUDENT") {
        pageTitle = "Student Profile";
      } else if (detailsById?.user?.role === "INSTRUCTOR") {
        pageTitle = "Instructor Profile";
      }
    } else {
      if (user?.role === "STUDENT" && !id) {
        pageTitle = "Student Profile";
      } else if (user?.role === "INSTRUCTOR") {
        pageTitle = "Instructor Profile";
      }
    }
  } else if (pageTitle === "instructor-appointment-management") {
    pageTitle = "Instructor";
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    memoizedDispatch(logout());
  }

  const getFirstLetter = (words: any) => {
    let letters;
    return (letters = words?.match(/\b(\w)/g).join(""));
  };

  return (
    <AppBar
      position="fixed"
      open={open}
      sx={{
        background: (theme) => theme.palette.primary.light,
        color: "#111",
        boxShadow: "0px -1px 0px 0px #F1F1F1 inset",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          ...(!open && { marginLeft: "60px" }),
        }}
      >
        <Typography variant="h3" noWrap component="div">
          {pageTitle ? hyphenToCapitalCase(pageTitle) : ""}
        </Typography>

        <Box display={"flex"} gap={"9px"} alignItems={"center"}>
          <Box
            sx={{
              borderRadius: "32px",
              border: "1px solid var(--Gray-200, #EAECEE)",
              background: "var(--Base-background-white, #FFF)",
              height: 40,
              width: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              cursor: "pointer",
            }}
          >
            <Image
              src={"/assets/icons/notification.svg"}
              height={16}
              width={16}
              alt="bell"
            />
            <Box
              sx={{
                top: -2,
                right: -2,
                position: "absolute",
                borderRadius: "50px",
                border: "2px solid #EEE6FF",
                background: "#5E38B5",
                height: 14,
                width: 14,
              }}
            ></Box>
          </Box>
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={menuOpen ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={menuOpen ? "true" : undefined}
          >
            <Avatar
              sx={{
                border: "3px solid hsla(33, 95%, 84%, 1)",
                backgroundColor: "hsla(21, 89%, 58%, 1)",
                fontFamily: (theme) => theme.typography.button.fontFamily,
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: "14px",
                letterSpacing: "0.28px",
                textTransform: "uppercase",
              }}
            >
              {user?.first_name && user?.last_name
                ? getFirstLetter(user?.first_name + " " + user.last_name)
                : "SF"}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={menuOpen}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {user?.role === "INSTRUCTOR" ? null : (
              <MenuItem onClick={() => router.push("/manage/profile")}>
                <ListItemIcon>
                  <PersonOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
            )}
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Sign Out{" "}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
