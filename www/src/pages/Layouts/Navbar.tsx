import React from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Tab,
  Tabs,
  Box,
  useMediaQuery,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Drawer,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Image from "next/image";
import Link from "next/link";
import { dmSans } from "@/themes/typography";
import { useRouter } from "next/router";
import { constants } from "@/utils/constants";
import IRootState from "@/store/interface";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { logout } from "@/store/auth/auth.actions";

// Icons
import LogoutIcon from "@mui/icons-material/Logout";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import TrafficIcon from "@mui/icons-material/Traffic";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArticleIcon from "@mui/icons-material/Article";
import CloseIcon from "@mui/icons-material/Close";
import { ArrowLeft, OpenInNew } from "@mui/icons-material";

const Navbar = ({ tenantData }: { tenantData: any }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useAppDispatch();

  const router = useRouter();
  const pathname = router.asPath;

  const getActiveTabIndex = () => {
    return navMenuItems.findIndex((item) => item.url === pathname) || 0;
  };

  const { isAuthenticated, authLoading, currentUser } = useAppSelector(
    (state: IRootState) => state?.auth
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    dispatch(logout());
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{
        fontFamily: dmSans.style.fontFamily,
        px: { xs: "20px", xl: "90px" },
        py: "30px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Link href="/" passHref>
            <Box
              sx={{
                position: "relative",
                width: { xs: "80px", bigMd: "100px", lg: "133px" }, // Slightly smaller for `md`
                height: { xs: "50px", bigMd: "60px", lg: "80px" }, // Adjust height accordingly
              }}
            >
              <Image
                src={
                  tenantData?.logo
                    ? tenantData?.logo
                    : "/assets/landing/sfds/logo.webp"
                }
                alt="logo safety first driving school"
                fill
                style={{ objectFit: "contain" }}
                quality={100}
                priority
              />
            </Box>
          </Link>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            gap: { xs: "20px", lg: "60px", xl: "80px" },
          }}
        >
          {!isMobile ? (
            <>
              {/* ====== Web Navigation Landing Starts ======= */}
              <Box>
                {/* Contact Details */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    "& > button": {
                      fontFamily: dmSans.style.fontFamily,
                      fontSize: "14px",
                    },
                  }}
                >
                  {" "}
                  <Image
                    src="/assets/landing/icons/phoneIcon.svg"
                    alt="phone icon safety first driving school"
                    width={20}
                    height={20}
                  />
                  <Button color="inherit" sx={{ mr: 1 }}>
                    (805)-374-2393
                  </Button>
                  <Button color="inherit" sx={{ mr: 1 }}>
                    (818)-866-9455
                  </Button>
                </Box>
                {/* Navigation Items */}
                <Box>
                  <Tabs
                    value={getActiveTabIndex()}
                    centered
                    sx={{
                      flexGrow: 1,
                      "& .MuiTabs-indicator": {
                        display: "flex",
                        justifyContent: "center",
                        backgroundColor: "transparent",
                        height: "4px",
                      },
                      "& .MuiTabs-indicatorSpan": {
                        maxWidth: { md: 8, bigMd: 10, lg: 12 },
                        width: "100%",
                        borderRadius: "4px",
                        backgroundColor: constants.color.text.primary,
                      },
                      minHeight: "35px", // Reduce overall height
                    }}
                    TabIndicatorProps={{
                      children: <span className="MuiTabs-indicatorSpan" />,
                    }}
                  >
                    {navMenuItems.map((item) => (
                      <Tab
                        key={item.id}
                        label={item.name}
                        component={Link}
                        href={item.url}
                        sx={{
                          fontFamily: dmSans.style.fontFamily,
                          color:
                            pathname === item.url
                              ? constants.color.text.primary
                              : "text.primary",
                          "&:hover": { color: constants.color.text.primary },
                          "&.Mui-selected": {
                            color: constants.color.text.primary,
                          },
                          transition: "color 0.3s ease",
                          fontSize: { md: "14px", bigMd: "16px", lg: "18px" },
                          "&:active": {
                            background: "transparent",
                          },
                          "& .MuiTouchRipple-root": {
                            display: "none",
                          },
                        }}
                      />
                    ))}
                  </Tabs>
                </Box>
              </Box>
              {!!isAuthenticated ? (
                <Box display={"flex"} alignItems={"center"} gap={"8px"}>
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
                        fontFamily: (theme) =>
                          theme.typography.button.fontFamily,
                        fontSize: "14px",
                        fontWeight: 600,
                        lineHeight: "14px",
                        letterSpacing: "0.28px",
                        textTransform: "uppercase",
                      }}
                    >
                      {/* {currentUser?.user?.first_name?.slice(0, 1) +
                  " " +
                  currentUser?.user?.last_name?.slice(0, 1)} */}
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
                  <Typography
                    sx={{
                      fontFamily: dmSans.style.fontFamily,
                      fontSize: "18px",
                      fontWeight: 500,
                      color: constants.color.text.primary,
                    }}
                  >
                    {`${currentUser?.user?.first_name} ${currentUser?.user?.last_name}`}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    "& .MuiButtonBase-root": {
                      fontFamily: dmSans.style.fontFamily,
                      fontSize: { md: "14px", lg: "18px" },
                      borderRadius: "40px",
                    },
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    component={Link}
                    href="/login"
                    sx={{
                      border: "1px solid #6C5E8F",
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={Link}
                    href="/pricing"
                    sx={{
                      border: "1px solid #6C5E8F",
                      color: "#48289B",
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
              {/* ====== Web Navigation Landing Ends ======= */}
            </>
          ) : (
            <MobileNavigation
              isAuthenticated={isAuthenticated}
              user={currentUser?.user}
            />
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

// Keep the navMenuItems array as is

const navMenuItems = [
  {
    id: 1,
    name: "Home",
    url: "/",
    icon: HomeIcon,
  },
  {
    id: 3,
    name: "Driver's Ed",
    url: "/drivers-ed",
    icon: SchoolIcon,
  },
  {
    id: 4,
    name: "Behind the Wheel",
    url: "/behind-the-wheel",
    icon: DriveEtaIcon,
  },
  {
    id: 5,
    name: "Traffic School",
    url: "/traffic-school",
    icon: TrafficIcon,
  },
  {
    id: 6,
    name: "Pricing",
    url: "/pricing",
    icon: AttachMoneyIcon,
  },
  {
    id: 2,
    name: "Blog",
    url: "/blog",
    icon: ArticleIcon,
  },
];

const MobileNavigation = ({
  isAuthenticated,
  user,
}: {
  isAuthenticated: boolean | null;
  user: any;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openMobileDrawer, setOpenMobileDrawer] =
    React.useState<boolean>(false);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleLogout() {
    dispatch(logout());
  }
  return (
    <Box>
      <IconButton
        aria-label="menu"
        color="inherit"
        onClick={() => {
          setOpenMobileDrawer(!openMobileDrawer);
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        anchor="left"
        open={openMobileDrawer}
        onClose={() => setOpenMobileDrawer(false)}
      >
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: "20px",
            gap: "20px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box
            sx={{
              paddingTop: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            {navMenuItems.map((item) => (
              <Button
                key={item.id}
                component={Link}
                href={item.url}
                startIcon={<item.icon />}
                sx={{
                  fontFamily: dmSans.style.fontFamily,
                  fontSize: "16px",
                  color: constants.color.text.primary,
                  justifyContent: "flex-start",
                  "&:hover": { color: constants.color.primary.light },
                }}
              >
                {item.name}
              </Button>
            ))}
          </Box>
          {!isAuthenticated && (
            <Box
              sx={{
                paddingTop: "20px",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                component={Link}
                href="/login"
                sx={{
                  fontFamily: dmSans.style.fontFamily,
                  fontSize: "18px",
                  borderRadius: "40px",
                  "&:hover": { background: constants.color.primary.light },
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                component={Link}
                href="/signup"
                sx={{
                  fontFamily: dmSans.style.fontFamily,
                  fontSize: "18px",
                  borderRadius: "40px",
                  "&:hover": { background: constants.color.primary.light },
                  marginTop: "10px",
                }}
              >
                Sign Up
              </Button>
            </Box>
          )}
          {isAuthenticated && (
            <>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={handleClick}
              >
                <Avatar alt={user?.name} src={user?.profilePicture} />
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: dmSans.style.fontFamily,
                    fontWeight: "bold",
                  }}
                >
                  {`${user?.first_name} ${user?.last_name}`}
                </Typography>
              </Box>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={menuOpen}
                onClose={handleClose}
                onClick={handleClose}
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
            </>
          )}
        </Box>
      </Drawer>
    </Box>
  );
};
