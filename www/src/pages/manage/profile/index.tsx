import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import ProfileView from "@/views/Client/ProfileView";
import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import StudentLayout from "@/layouts/User/User";
import InstructorProfileView from "@/views/Admin/InstructorProfileView";
import { useRouter } from "next/router";
import useIsMobile from "@/hooks/useIsMobile";
import MobileLayout from "@/layouts/Mobile/MobileLayout";
import Loader from "@/components/Loader";

// ==============================|| PROFILE DETAILS PAGE ||============================== //
const UserProfile = () => {
  const user = useSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  const router = useRouter();
  const { isEdit, permitMissing } = router.query;
  const isMobile = useIsMobile();
  let redirectUrl = `/manage/profile/${user?.id}`;
  if (isEdit) {
    redirectUrl += "?isEdit=true";
  }
  if (permitMissing) {
    redirectUrl += "&permitMissing=true";
  }
  if (user?.role === "STUDENT") router.push(redirectUrl);
  else if (
    user?.role === "INSTRUCTOR" ||
    user?.role === "ADMIN" ||
    user?.role === "CSR"
  ) {
    return (
      <WithLayout layout={AdminLayout} component={InstructorProfileView} />
    );
  }
  return (
    <WithLayout
      layout={isMobile ? MobileLayout : AdminLayout}
      component={Loader}
    />
  );
};

export default WithAuth(UserProfile);
