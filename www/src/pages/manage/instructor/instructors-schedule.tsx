import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import Schedule from "@/views/Admin/InstructorView/InstructorSchedule";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER LIST PAGE ||============================== //
const InstructorSchedule = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={Schedule} />;
  return <WithLayout layout={AdminLayout} component={Schedule} />;
};

export default WithAuth(InstructorSchedule);
