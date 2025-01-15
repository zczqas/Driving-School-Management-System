import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import InstructorReportView from "@/views/Admin/InstructorReportView";
import ActivitiesView from "@/views/Admin/ActivitiesView";

// ==============================|| INSTRUCTOR PAGE ||============================== //
const InstructorPage = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  //   if (user?.role === "STUDENT")
  //     return <WithLayout layout={UserLayout} component={} />;
//   return <WithLayout layout={AdminLayout} component={ActivitiesView} />;
  return <WithLayout layout={AdminLayout} component={InstructorReportView} />;
};

export default WithAuth(InstructorPage);
