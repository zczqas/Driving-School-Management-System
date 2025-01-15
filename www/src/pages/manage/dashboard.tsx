import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import DashboardViewAdmin from "@/views/Admin/DashboardViewAdmin";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import StudentLayout from "@/layouts/User/User";
import { Theme, useMediaQuery } from "@mui/material";
import DashboardViewStudent from "@/views/Client/DashboardViewStudent";
import MobileLayout from "@/layouts/Mobile/MobileLayout";
import useIsMobile from "@/hooks/useIsMobile";
import MobileSubHeader from "@/components/MobileSubHeader";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const isMobile = useIsMobile();
  if (user?.role === "STUDENT" && isMobile) {
    const Dashboard = () => (
      <>
        <MobileSubHeader />
        <DashboardViewStudent />
      </>
    );
    return <WithLayout layout={MobileLayout} component={Dashboard} />;
  } else if (user?.role === "INSTRUCTOR") {
    return <WithLayout layout={AdminLayout} component={DashboardViewAdmin} />;
  }
  return <WithLayout layout={AdminLayout} component={DashboardViewAdmin} />;
};

export default WithAuth(UserDashboard);
