import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import DriversEd from "@/views/Client/DriversEd";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  return <WithLayout layout={AdminLayout} component={DriversEd} />;
};

export default WithAuth(UserDashboard);