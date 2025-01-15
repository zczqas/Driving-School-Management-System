import React from "react";
import PricingCard from "./components/PricingCard";
import { Box, Grid } from "@mui/material";

const PricingView = () => {
  return (
    <Box sx={{ p: 5 }}>
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <PricingCard
            title="Introduction to Driving"
            subTitle="Initial Driving lesson - first time on the road"
            pricing="155.00"
            handleSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <PricingCard
            title="Basic surface streets"
            subTitle="Basic surface streets"
            pricing="155.00"
            handleSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <PricingCard
            title="Introduction to Driving"
            subTitle="Initial Driving lesson - first time on the road"
            pricing="155.00"
            handleSelect={() => {}}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <PricingCard
            title="Basic surface streets"
            subTitle="Basic surface streets"
            pricing="155.00"
            handleSelect={() => {}}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PricingView;
