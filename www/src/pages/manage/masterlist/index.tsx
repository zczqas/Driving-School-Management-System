import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import MasterListView from "@/views/Admin/MasterListView";

// ==============================|| INSTRUCTOR APPOINTMENT MANAGEMENT PAGE ||============================== //
const InstructorAppointmentManagement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT" || user?.role === "INSTRUCTOR") return null;

  return (
    <WithLayout layout={AdminLayout} component={MasterListView} />
  );
};

export default WithAuth(InstructorAppointmentManagement);
