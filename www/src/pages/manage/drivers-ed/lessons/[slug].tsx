import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import DriversEdLessons from "@/views/Client/DriversEd/components/Lessons";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  return <WithLayout layout={AdminLayout} component={DriversEdLessons} />;
};

export default WithAuth(UserDashboard);
