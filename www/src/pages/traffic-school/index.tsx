import React from "react";
import { GetServerSideProps } from "next";
import { wrapper } from "../../store";
import { setTenantData } from "../../store/tenant/tenant.actions";
import dynamic from "next/dynamic";
import Layout from "../Layout";
import SEOHead from "./TrafficSchoolSEOHead";

import { Box } from "@mui/material";
import Loader from "@/components/Loader";
import OnlineCourseList from "./component/OnlineCourseList";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <Loader />,
});

const TrafficSchoolPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <Box component={"main"} sx={{ background: "#FAFBFF" }}>
          <OnlineCourseList />
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

export default TrafficSchoolPage;
