import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import UserLayout from "@/layouts/User/User";
import LessonListing from "@/views/Admin/InstructorView/InstructorsLessonListing";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";

// ==============================|| USER LIST PAGE ||============================== //
const InstructorLessonLisitng = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT")
    return <WithLayout layout={AdminLayout} component={LessonListing} />;
  return <WithLayout layout={AdminLayout} component={LessonListing} />;
};

export default WithAuth(InstructorLessonLisitng);
