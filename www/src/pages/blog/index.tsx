import React from "react";
import dynamic from "next/dynamic";
import Layout from "../Layout";
import SEOHead from "./BlogSEOHead";

import { Box } from "@mui/material";
import Loader from "@/components/Loader";
import BlogsSection from "./component/BlogsSection";

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  loading: () => <Loader />,
});

const BlogPage = () => {
  return (
    <>
      <SEOHead />
      <Layout>
        <Box component={"main"} sx={{ background: "#FAFBFF" }}>
          <BlogsSection />
          <ContactSection />
        </Box>
      </Layout>
    </>
  );
};

export default BlogPage;
