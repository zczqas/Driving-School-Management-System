import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { setCookie } from "cookies-next";
import { GetServerSideProps } from "next";
import { wrapper } from "../store";
import { setTenantData } from "../store/tenant/tenant.actions";
import WithLayout from "@/components/WithLayout";
import Blank from "@/layouts/Blank";
import RegisterView from "@/views/Auth/RegisterView";
import withPublicRoute from "@/components/WithPublicRoute";

const Signup = () => {
  const router = useRouter();

  useEffect(() => {
    const { purchasePackageId, purchasePackageTypeId } = router.query;
    const oneHour = 60 * 60;

    if (purchasePackageId && typeof purchasePackageId === "string") {
      setCookie("purchasePackageId", purchasePackageId, { maxAge: oneHour });
    }

    if (purchasePackageTypeId && typeof purchasePackageTypeId === "string") {
      setCookie("purchasePackageTypeId", purchasePackageTypeId, {
        maxAge: oneHour,
      });
    }
  }, [router.query]);

  return <WithLayout layout={Blank} component={RegisterView} />;
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ query }) => {
    let tenantData = null;

    if (query.tenantData) {
      try {
        tenantData = JSON.parse(query.tenantData as string);
        // Dispatch the tenant data to the Redux store
        store.dispatch(setTenantData(tenantData));
      } catch (error) {
        console.error("Error parsing tenantData:", error);
      }
    }

    // If tenantData is null, you might want to fetch it here
    // or redirect to an error page

    return {
      props: { tenantData },
    };
  });

export default withPublicRoute(Signup);
