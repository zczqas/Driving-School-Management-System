import React from "react";

// project imports
import WithLayout from "@/components/WithLayout";
import AdminLayout from "@/layouts/Admin";

import WithAuth from "@/components/WithAuth";
import { useSelector } from "react-redux";
import IRootState from "@/store/interface";
import AddDriverTrainingView from "@/views/Admin/DrivingTrainingEducationView/components/AddEdit";
import AddTransactionView from "@/views/Admin/AccountingView/components/AddTransaction/AddTransactionView";
import { useAppDispatch, useAppSelector } from "@/hooks";
import { useRouter } from "next/router";
import { openAlert } from "@/store/alert/alert.actions";
import PricingCategoriesSection from "@/pages/pricing/component/PricingCategoriesSection";
import IndividualPricingSection from "@/pages/pricing/component/IndividualPricingSection";
import { getCookie } from "cookies-next";
import useIsMobile from "@/hooks/useIsMobile";
import MobileLayout from "@/layouts/Mobile/MobileLayout";
import MobileSubHeader from "@/components/MobileSubHeader";

// ==============================|| DRIVING TRAINING PAGE ||============================== //
const NewTransaction = () => {
  const isMobile = useIsMobile();
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

  const [purchasePackageExist, setPurchasePackageExist] = React.useState(false);

  React.useEffect(() => {
    if (auth?.isAuthenticated && !auth?.authLoading) {
      console.log("Checking Permit: ", checkIfPermitNoIsPresent());
      if (
        !checkIfPermitNoIsPresent() &&
        auth?.currentUser?.user?.role === "STUDENT"
      ) {
        router.replace("/manage/profile/?isEdit=true");
        dispatch(openAlert("Please update your profile to continue", "info"));
      }
    }
  }, [auth, router]);

  const userRole = auth?.currentUser?.user?.role.toLowerCase();

  React.useEffect(() => {
    const purchasePackageTypeIdCookies = getCookie("purchasePackageTypeId");
    const purchasePackageIdCookies = getCookie("purchasePackageId");
    const { purchasePackageId, purchasePackageTypeId } = router.query;
    if (
      (purchasePackageId && purchasePackageTypeId) ||
      (purchasePackageIdCookies && purchasePackageTypeIdCookies)
    ) {
      setPurchasePackageExist(true);
    } else {
      setPurchasePackageExist(false);
    }
  }, [userRole, router]);

  if (userRole === "student" && !purchasePackageExist) {
    const PricingPageSection = () => {
      return (
        <>
          {isMobile && <MobileSubHeader title="Pricing" />}
          <PricingCategoriesSection />
          <IndividualPricingSection />
        </>
      );
    };

    return (
      <WithLayout
        layout={isMobile ? MobileLayout : AdminLayout}
        component={PricingPageSection}
      />
    );
  }
  return (
    <WithLayout
      layout={userRole === "student" && isMobile ? MobileLayout : AdminLayout}
      component={AddTransactionView}
    />
  );
};

export default WithAuth(NewTransaction);
