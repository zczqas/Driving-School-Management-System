import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import InstructorAppointmentView from "@/views/Admin/InstructorAppointmentView";
import UserLayout from "@/layouts/User/User";
import { useRouter } from "next/router";
import { notFound } from "next/navigation";
import InstructorDailyLessonListingView from "@/views/Admin/InstructorDailyLessonListingView";

// ==============================|| INSTRUCTOR DAILY LESSON LISTING PAGE ||============================== //
const InstructorDailyLessonListing = () => {
  const router = useRouter();
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  if (user?.role === "STUDENT") {
    router.push("/404");
  }
  if (user?.role === "INSTRUCTOR") {
    return (
      <WithLayout
        layout={AdminLayout}
        component={InstructorDailyLessonListingView}
      />
    );
  }
  return (
    <WithLayout
      layout={AdminLayout}
      component={InstructorDailyLessonListingView}
    />
  );
};

export default WithAuth(InstructorDailyLessonListing);
