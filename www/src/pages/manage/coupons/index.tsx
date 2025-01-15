import React, { useEffect } from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import { useRouter } from "next/router";
import CouponsManagementView from "@/views/Admin/CouponsManagementView";

// ==============================|| COUPONS PAGE ||============================== //
const LessonManagement = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );
  const router = useRouter();
  useEffect(() => {
    if (user?.role === "STUDENT") {
      router.replace("/404");
    }
  }, [user, router]);

  if (user?.role === "STUDENT") return null;
  return <WithLayout layout={AdminLayout} component={CouponsManagementView} />;
};

export default WithAuth(LessonManagement);
