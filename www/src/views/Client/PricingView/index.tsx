import React from "react";
import PricingSection from "./components/PricingSection";
import { useAppDispatch } from "@/hooks";
import { fetchPackages } from "@/store/package/package.action";

const PricingView = () => {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    dispatch(fetchPackages(0,30));
  }, []);

  return <PricingSection />;
};

export default PricingView;
