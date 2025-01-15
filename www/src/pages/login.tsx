import React from "react";

// project imports
import LoginView from "@/views/Auth/LoginView";
import WithLayout from "@/components/WithLayout";
import Blank from "@/layouts/Blank";
import withPublicRoute from "@/components/WithPublicRoute";
import { GetServerSideProps } from "next";
import { wrapper } from "@/store";
import { setTenantData } from "@/store/tenant/tenant.actions";

// ==============================|| LOGIN PAGE ||============================== //

const Login = ({ tenantData }: { tenantData: any }) => {
  return (
    <>
      <Blank>
        <LoginView tenantData={tenantData} />
      </Blank>
    </>
  );
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

export default withPublicRoute(Login);
