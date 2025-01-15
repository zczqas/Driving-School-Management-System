import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import ChartImages from "@/views/Client/DriversEd/components/Chart";
import WithAuth from "@/components/WithAuth";
import AdminLayout from "@/layouts/Admin/Admin";

// ==============================|| DASHHBOARD PAGE ||============================== //
const Charts = () => {
  return <WithLayout layout={AdminLayout} component={ChartImages} />;
};

export default WithAuth(Charts);
