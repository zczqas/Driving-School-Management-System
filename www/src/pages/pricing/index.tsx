import React from "react";
import { GetServerSideProps } from "next";
import { wrapper } from "../../store";
import { setTenantData } from "../../store/tenant/tenant.actions";
import Layout from "../Layout";
import SEOHead from "./PricingSEOHead";
import PricingCategoriesSection from "./component/PricingCategoriesSection";
import IndividualPricingSection from "./component/IndividualPricingSection";
import { Box } from "@mui/material";
import Loader from "@/components/Loader";
import dynamic from "next/dynamic";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <Loader />,
});

const PricingPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <Box component={"main"} sx={{ background: "#FAFBFF" }}>
          <PricingCategoriesSection />
          <IndividualPricingSection />
          <ContactSection />
        </Box>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps((store) => async ({ query }) => {
    if (query.tenantData) {
      try {
        const tenantData = JSON.parse(query.tenantData as string);
        store.dispatch(setTenantData(tenantData));
      } catch (error) {
        console.error("Error parsing tenantData:", error);
      }
    }

    return { props: {} };
  });

export default PricingPage;
