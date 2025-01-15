import React from "react";
import dynamic from "next/dynamic";
import { GetServerSideProps } from 'next';
import { wrapper } from '../../store';
import { setTenantData } from '../../store/tenant/tenant.actions';
import Layout from "../Layout";
import SEOHead from "./BehindTheWheelSEOHead";

import { Box } from "@mui/material";
import Loader from "@/components/Loader";
import BehindTheWheelIntroSection from "./component/BehindTheWheelIntroSection";
import TeenLearnSection from "./component/TeenLearnSection";
import BehindTheWheelFeaturesBottom from "./component/BehindTheWheelFeaturesBottom";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <Loader />,
});

const BehindTheWheelPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <Box component={"main"} sx={{ background: "#FAFBFF" }}>
          <BehindTheWheelIntroSection />
          <TeenLearnSection />
          <BehindTheWheelFeaturesBottom />
          <ContactSection />
        </Box>
      </Layout>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(
  (store) => async ({ query }) => {
    if (query.tenantData) {
      try {
        const tenantData = JSON.parse(query.tenantData as string);
        store.dispatch(setTenantData(tenantData));
      } catch (error) {
        console.error('Error parsing tenantData:', error);
      }
    }

    return { props: {} };
  }
);

export default BehindTheWheelPage;
