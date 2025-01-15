import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import ProfileView from "@/views/Client/ProfileView";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { Theme, useMediaQuery, useTheme } from "@mui/material";
import MobileLayout from "@/layouts/Mobile/MobileLayout";
import ProfileViewMobile from "@/views/Client/MobileView/ProfileView";
// import StudentLayout from "@/layouts/User/User";

// ==============================|| DYNAMIC PROFILE DETAILS PAGE ||============================== //
const UserProfile = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const isMobile = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("md")
  );

  if (user?.role === "STUDENT") {
    if (isMobile) {
      return <WithLayout layout={MobileLayout} component={ProfileViewMobile} />;
    }
    return <WithLayout layout={AdminLayout} component={ProfileView} />;
  }

  return <WithLayout layout={AdminLayout} component={ProfileView} />;
};

export default WithAuth(UserProfile);
