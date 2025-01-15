import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import Timesheet from "@/views/Admin/InstructorView/InstructorsTimeSheet";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER LIST PAGE ||============================== //
const InstructorTimesheet = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={Timesheet} />;
  return <WithLayout layout={AdminLayout} component={Timesheet} />;
};

export default WithAuth(InstructorTimesheet);
