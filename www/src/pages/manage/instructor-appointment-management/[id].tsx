import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import InstructorAppointmentView from "@/views/Admin/InstructorAppointmentView";
import UserLayout from "@/layouts/User/User";

// ==============================|| INSTRUCTOR APPOINTMENT MANAGEMENT PAGE ||============================== //
const InstructorAppointmentManagement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT") return null;
  if(user?.role === "INSTRUCTOR"){
    return <WithLayout layout={AdminLayout} component={InstructorAppointmentView} />;
  }
  return <WithLayout layout={AdminLayout} component={InstructorAppointmentView} />;
};

export default WithAuth(InstructorAppointmentManagement);
