import React from "react";

import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import ScheduleLesson from "@/views/Client/ScheduleLessons";
import { useRouter } from "next/router";
import WithAuth from "@/components/WithAuth";
import { openAlert } from "@/store/alert/alert.actions";
import useIsMobile from "@/hooks/useIsMobile";
import MobileSubHeader from "@/components/MobileSubHeader";
import MobileLayout from "@/layouts/Mobile/MobileLayout";

//  ==================== | ScheduleLessons | ====================
const ScheduleLessons = () => {
  const auth = useAppSelector((state: IRootState) => state?.auth);
  const router = useRouter();

  function checkIfPermitNoIsPresent() {
    if (
      auth?.currentUser?.user?.permit_information?.length > 0 &&
      !!auth?.currentUser?.user?.permit_information?.[0]?.permit_number
    ) {
      return true;
    }
    return false;
  }

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (auth?.isAuthenticated && !auth?.authLoading) {
      console.log("Checking Permit: ", checkIfPermitNoIsPresent());
      if (
        !checkIfPermitNoIsPresent() &&
        auth?.currentUser?.user?.role === "STUDENT"
      ) {
        router.replace("/manage/profile/?isEdit=true&permitMissing=true");
        dispatch(
          openAlert("Please add your permit information to continue", "info")
        );
      }
    }
  }, [auth, router]);

  const isMobile = useIsMobile();
  if (auth?.currentUser?.user?.role === "STUDENT" && isMobile) {
    const ScheduleStudent = () => (
      <>
        <MobileSubHeader title="Schedule Lessons" />
        <ScheduleLesson />
      </>
    );
    return <WithLayout layout={MobileLayout} component={ScheduleStudent} />;
  }

  return <WithLayout layout={AdminLayout} component={ScheduleLesson} />;
};

export default WithAuth(ScheduleLessons);
