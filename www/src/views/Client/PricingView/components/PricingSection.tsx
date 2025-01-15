import React from "react";

import PricingCard from "./PricingCard";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Box, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { fetchPackages } from "@/store/package/package.action";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";

const pages = ["Pricing", "About"];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

//design will come later so for now everything is in this single page
//later based on the desing use layout for this page as well
const PricingSection = () => {
  const { packages } = useAppSelector((state) => state?.package?.packageList);

  const categories: any = {};
  packages?.forEach((item: any) => {
    const categoryId: string = item?.category?.name;
    if (!categories[categoryId]) {
      categories[categoryId] = [];
    }
    categories[categoryId].push(item);
  });

  const categoryEntries = Object.entries(categories).map(([title, items]) => {
    return {
      title: title,
      items: items,
    };
  });

  categoryEntries.forEach((category) => {
    console.log(category.title);
    console.log(category.items);
  });

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const { isAuthenticated, authLoading, loadUserFailed, currentUser, role } =
    useSelector((state: IRootState) => state.auth);
  const router = useRouter();
  return (
    <Box>
      <AppBar position="static">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img
              src={"/assets/logo.png"}
              alt="logo"
              style={{ padding: "10px" }}
            />

            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box
              sx={{ flexGrow: 1, ml: 4, display: { xs: "none", md: "flex" } }}
            >
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    ml: 4,
                    color: "white",
                    display: "block",
                    fontWeight: 500,
                    fontSize: "16px",
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box>
        {categoryEntries?.map((category, index) => (
          <Box key={index} sx={{ p: 5 }}>
            <Typography variant="h4" gutterBottom>
              {category.title}
            </Typography>
            <Grid container spacing={2.5}>
              {Array.isArray(category.items) &&
                category.items.map((item) => (
                  <Grid key={item.name} item xs={12} sm={6} md={4} lg={3}>
                    <PricingCard
                      title={item.name}
                      subTitle={item.description}
                      pricing={item.price.toFixed(2)}
                      handleSelect={() => {
                        if (isAuthenticated) {
                          console.log("paymenttt");
                        } else {
                          alert("Please Login First");
                          router.push("/login");
                        }
                      }}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PricingSection;
