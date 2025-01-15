import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import CurrentInstructor from "@/views/Admin/InstructorView/CurrentInstructors";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER LIST PAGE ||============================== //
const CurrentInstructors = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT")
    return <WithLayout layout={UserLayout} component={CurrentInstructor} />;
  return <WithLayout layout={AdminLayout} component={CurrentInstructor} />;
};

export default WithAuth(CurrentInstructors);
