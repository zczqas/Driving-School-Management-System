import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import SalesReportView from "@/views/Admin/SalesReportView";
import ProfileView from "@/views/Client/ProfileView";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| Sales Report PAGE ||============================== //
const SalesReport = () => {
  const user = useSelector((state: IRootState) => state?.auth?.currentUser?.user);
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={ProfileView} />;
  return <WithLayout layout={AdminLayout} component={SalesReportView} />;
};

export default WithAuth(SalesReport);
