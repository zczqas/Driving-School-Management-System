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
  FormControl,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
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
import { RemoveRedEye } from "@mui/icons-material";

interface TopbarProps {
  open: boolean;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 320;

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
  const dispatch = useDispatch<any>();
  const user = useAppSelector((state: any) => state.auth?.currentUser?.user);
  const {
    userDetailsById: { details: detailsById, loading: loadingById },
  } = useAppSelector((store) => store?.user);

  const memoizedDispatch = useCallback(dispatch, [dispatch]);
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const match = pathname.match(/\/manage\/(.+)/);
  let pageTitle = match ? match[1] : '';
  const mainPath = pageTitle?.split('/')[0];
  const subPath = pageTitle?.split('/')[1];

  const getPageTitle = () => {
    switch (mainPath) {
      case 'profile':
        if (id) {
          if (detailsById?.user?.role === 'STUDENT') {
            return 'Student Profile';
          }
          if (detailsById?.user?.role === 'INSTRUCTOR') {
            return 'Instructor Profile';
          }
        }
        return user?.role === 'STUDENT' ? 'Student Profile' : 'Instructor Profile';

      case 'pricing':
        return !id ? 'Packages for Teens with a Permit' : pageTitle;

      case 'driver-training-and-education':
        return subPath === 'create' ? 'Drivers Training' : pageTitle;

      case 'accounting':
        if (subPath === 'create') return 'Add Student Transaction';
        if (subPath === 'sales-report') return 'Sales Report';
        return pageTitle;

      case 'instructor-appointment-management':
        return 'Instructor';

      case 'packages':
        return 'Packages';

      case 'school-configuration':
        return 'School Configuration';

      case 'drivers-ed':
        return 'Drivers Ed';
      
      case "course":
        if (pageTitle?.split("/")[2] === "edit") return "Edit Course";
        if (pageTitle?.split("/")[2] === "preview") return "Course Peview";
        return "Course";

      default:
        // Handle instructor-related pages
        if (['current-instructors', 'instructors-lesson-listing', 
             'instructors-schedule', 'instructors-timesheet'].includes(subPath)) {
          return subPath;
        }
        return pageTitle;
    }
  };

  pageTitle = getPageTitle();

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

  const [currentSchool, setCurrentSchool] = React.useState(
    localStorage.getItem("selectedSchool") ?? "Safety First"
  );
  const handleSchoolChange = (event: any) => {
    setCurrentSchool(event.target.value as string);
    localStorage.setItem("selectedSchool", event.target.value);
  };

  React.useEffect(() => {
    const school = localStorage.getItem("selectedSchool");
    if (!school) {
      localStorage.setItem("selectedSchool", "Safety First");
    }
  }, []);

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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h3" noWrap component="div">
            {pageTitle ? hyphenToCapitalCase(pageTitle) : ""}
          </Typography>
          {pageTitle === "Edit Course" && (
            <IconButton
              onClick={() => router.push(`/manage/course/${router.query.id}/preview`)}
              size="small"
              sx={{ ml: 2 }}
            >
              <RemoveRedEye />
            </IconButton>
          )}
        </Box>
        <Box display={"flex"} gap={"9px"} alignItems={"center"}>
          <Box
            sx={{
              borderRadius: "50px",
              border: "2px solid #EEE6FF",
              background: "#5E38B5",
              padding: "8px 12px",
            }}
          >
            <Typography sx={{ fontWeight: "800", color: "white" }}>
              {user.role}
            </Typography>
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
              {user?.first_name?.slice(0, 1) +
                " " +
                user?.last_name?.slice(0, 1)}
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
            <MenuItem onClick={() => router.push("/manage/profile")}>
              <ListItemIcon>
                <PersonOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
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
