import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import DashboardViewStudent from "@/views/Client/DashboardViewStudent";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  return <WithLayout layout={AdminLayout} component={DashboardViewStudent} />;
};

export default WithAuth(UserDashboard);
