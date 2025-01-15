import React, { Fragment } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import SearchStudents from "@/views/Admin/SearchStudents";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import StudentLayout from "@/layouts/User/User";

// ==============================|| DASHHBOARD PAGE ||============================== //
const UserDashboard = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  if (user?.role === "STUDENT")
    return <WithLayout layout={StudentLayout} component={SearchStudents} />;
  else if (user?.role === "INSTRUCTOR") {
    return <WithLayout layout={AdminLayout} component={SearchStudents} />;
  }
  return <WithLayout layout={AdminLayout} component={SearchStudents} />;
};

export default WithAuth(UserDashboard);
