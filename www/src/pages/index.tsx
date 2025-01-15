import React from "react";
import { GetServerSideProps } from "next";
import { wrapper } from "../store";
import { setTenantData } from "../store/tenant/tenant.actions";
import Layout from "./Layout";
import MoreInfo from "./components/Sections/MoreInfo";
import SEOHead from "./SEOHead";
import Hero from "./components/Sections/Hero";
import BusinessInfo from "./components/Sections/BusinessInfo";
import AboutSection from "./components/Sections/AboutSection";
import PackageInfoSection from "./components/Sections/PackageInfoSection";
import FAQ from "./components/Sections/FAQ";

const LandingPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <main>
          <Hero />
          <MoreInfo />
          <BusinessInfo />
          <AboutSection />
          <PackageInfoSection />
          <FAQ />
        </main>
      </Layout>
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

export default LandingPage;
