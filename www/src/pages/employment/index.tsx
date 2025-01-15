import React from "react";
import dynamic from "next/dynamic";
import Layout from "../Layout";
import SEOHead from "./EmploymentSEOHead";

import { Box } from "@mui/material";
import Loader from "@/components/Loader";
import EmploymentIntroSection from "./component/EmploymentIntroSection";
import JobDescriptionSection from "./component/JobDescriptionSection";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <Loader />,
});

const PricingPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <Box component={"main"} sx={{ background: "#FAFBFF" }}>
          <EmploymentIntroSection />
          <JobDescriptionSection />
          <ContactSection />
        </Box>
      </Layout>
    </>
  );
};

export default PricingPage;
