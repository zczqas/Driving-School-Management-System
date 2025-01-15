import React, { useState, useEffect } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import PricingCard from "./PricingCard";
import { openSans } from "@/themes/typography";
// import axios from "axios";
import axiosConfig from "@/config/axios.config";

interface Feature {
  name: string;
  included: boolean;
}

interface Lesson {
  name: string;
  duration: number;
}

interface Package {
  id: number;
  name: string;
  price: number;
  lessons: Lesson[];
}

interface Category {
  id: number;
  name: string;
  packages: Package[];
}

interface FormattedPlan {
  id: number;
  title: string;
  price: string;
  hours: number;
  features: Feature[];
}

interface FormattedCategory {
  id: number;
  title: string;
  plans: FormattedPlan[];
}

const staticFeatures: Feature[] = [
  { name: "Introduction to Driving", included: false },
  { name: "Basic surface streets", included: false },
  { name: "DMV Exam Preparation", included: false },
  { name: "Freeways", included: false },
  { name: "Canyons", included: false },
  { name: "Defensive Driving", included: false },
  { name: "DMV Drive Test Service", included: false },
];

const PricingCategoriesSection: React.FC = () => {
  const filterCategoriesList = ["individual lesson", "miscellaneous", "legacy"];
  const [pricingCategories, setPricingCategories] = useState<
    FormattedCategory[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPricingCategories = async () => {
      try {
        const response = await axiosConfig.get<Category[]>(
          "/package_category/get"
        );

        setIsLoading(true);
        const formattedCategories: FormattedCategory[] = response.data
          .filter(
            (category) =>
              !filterCategoriesList.includes(category.name.toLowerCase())
          )
          .map((category) => ({
            id: category.id,
            title: category.name,
            plans:
              category.packages
                ?.map((plan) => ({
                  id: plan.id,
                  title: plan.name?.split(" - ")[0] ?? "",
                  price: `$${plan.price?.toFixed(2) ?? "0.00"}`,
                  hours:
                    plan.lessons?.reduce(
                      (total, lesson) => total + (lesson.duration ?? 0),
                      0
                    ) ?? 0,
                  features: staticFeatures.map((feature) => ({
                    ...feature,
                    included:
                      plan.lessons?.some((lesson) =>
                        lesson.name
                          ?.toLowerCase()
                          .includes(feature.name.toLowerCase())
                      ) ?? false,
                  })),
                }))
                .sort((a, b) => {
                  const aTrueFeatures = a.features.filter(
                    (feature) => feature.included
                  ).length;
                  const bTrueFeatures = b.features.filter(
                    (feature) => feature.included
                  ).length;
                  return bTrueFeatures - aTrueFeatures; // Sort descending by true feature count
                }) ?? [],
          }));
        setPricingCategories(formattedCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pricing categories:", error);
      }
    };
    fetchPricingCategories();
  }, []);

  const renderSkeletonLoading = () => (
    <Box sx={{ mb: 8 }}>
      <Skeleton
        variant="text"
        width="50%"
        height={60}
        sx={{ mx: "auto", mb: 4 }}
        animation={"wave"}
      />
      <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
        {[1, 2, 3].map((i) => (
          <Box key={i} sx={{ width: 300, height: 500 }}>
            <Skeleton
              variant="rectangular"
              width={300}
              height={500}
              animation={"wave"}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );

  return (
    <Box component="section" sx={{ py: 8 }}>
      {isLoading
        ? renderSkeletonLoading()
        : pricingCategories.map((category) => (
            <Box key={category.title} sx={{ mb: 8 }}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: "center",
                  fontFamily: openSans.style.fontFamily,
                  fontSize: "42px",
                  fontWeight: 600,
                  mb: "60px",
                  lineHeight: "1.2",
                }}
              >
                {category.title}
              </Typography>
              <Box
                sx={{
                  gap: 4,
                  mt: 4,
                  mb: "140px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                {category.plans?.map((plan) => (
                  <PricingCard
                    categoryId={category?.id}
                    id={plan.id}
                    key={plan.title}
                    title={plan.title}
                    price={plan.price}
                    hours={plan.hours}
                    features={plan.features}
                  />
                ))}
              </Box>
            </Box>
          ))}
    </Box>
  );
};

export default PricingCategoriesSection;
