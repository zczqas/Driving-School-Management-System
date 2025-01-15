import React, { useState, useEffect } from "react";
import { lato, openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import {
  Box,
  Typography,
  Button,
  Grid,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/router";
// import axios from "axios";
import axiosInstance from "@/config/axios.config";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { setCookie } from "cookies-next";

interface PricingItem {
  id: number;
  name: string;
  description: string;
  price: number;
  onClick: () => void;
}

const PricingCard: React.FC<PricingItem> = ({
  name,
  description,
  price,
  onClick,
}) => (
  <Box
    sx={{
      p: "40px",
      borderRadius: "10px",
      height: "288px",
      display: "flex",
      flexDirection: "column",
      bgcolor: "white",
      boxShadow: "inset 0px 2px 14px 0px rgba(136, 136, 136, 0.30)",
      width: "370px",
    }}
  >
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: "22px",
          mb: "10px",
          textAlign: "center",
          fontFamily: lato.style.fontFamily,
        }}
      >
        {name}
      </Typography>
      <Tooltip
        title={description}
        placement="top"
        arrow
        enterDelay={500}
        leaveDelay={200}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#5A5A5A",
            fontFamily: lato.style.fontFamily,
            fontSize: "14px",
            lineHeight: "20px",
            height: "40px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          {description}
        </Typography>
      </Tooltip>
    </Box>
    <Box sx={{ mt: "auto", textAlign: "center" }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: "38px",
          fontSize: "26px",
          fontFamily: lato.style.fontFamily,
        }}
      >
        ${price?.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        onClick={onClick}
        sx={{
          bgcolor: "#F37636",
          "&:hover": { bgcolor: "#e67341" },
          textTransform: "none",
          borderRadius: "100px",
          px: "45px",
          fontFamily: openSans.style.fontFamily,
          fontWeight: 600,
        }}
      >
        Select Plan
      </Button>
    </Box>
  </Box>
);

const IndividualPricingSection: React.FC = () => {
  const [pricingData, setPricingData] = useState<PricingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  function handleSelectPlanStudent(
    purchasePackageId: number,
    purchasePackageTypeId: number
  ) {
    if (purchasePackageId && purchasePackageTypeId) {
      const oneHour = 60 * 60;
      setCookie("purchasePackageId", purchasePackageId, { maxAge: oneHour });
      setCookie("purchasePackageTypeId", purchasePackageTypeId, {
        maxAge: oneHour,
      });
    }

    router.push(
      "/manage/accounting/create/?purchasePackageId=" +
        purchasePackageId +
        "&purchasePackageTypeId=" +
        purchasePackageTypeId
    );
  }

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await axiosInstance.get("/package_category/get");
        const individualLessonCategory = response.data.find(
          (category: any) => category.name === "Individual Lesson"
        );
        if (individualLessonCategory) {
          const formattedData = individualLessonCategory?.packages?.map(
            (item: any) => ({
              id: item?.id,
              name: item?.name,
              description: item?.lessons[0]?.description || "",
              price: item?.price,
            })
          );
          setPricingData(formattedData);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching pricing data:", error);
        setIsLoading(false);
      }
    };
    fetchPricingData();
  }, []);

  const renderSkeletonLoading = () => (
    <Grid container spacing={3} sx={{ maxWidth: "1588px", mx: "auto" }}>
      {[...Array(8)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Skeleton
            variant="rectangular"
            width={370}
            height={288}
            animation="wave"
          />
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box
      component={"section"}
      sx={{
        paddingX: constants.paddingContainerX,
      }}
    >
      <Box
        sx={{
          mb: "80px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
          Purchase Individual Lesson
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            textAlign: "center",
            fontFamily: openSans.style.fontFamily,
            fontSize: "16px",
            fontWeight: 400,
            color: "#454545",
            maxWidth: "1268px",
          }}
        >
          {` Many of our students want to use our amazing online drivers ed but
          don't live in an area where we offer behind the wheel training. Our
          online driver education course is DMV approved throughout the entire
          state of California. For students in our behind the wheel training
          service areas, they may want to purchase an individual lesson instead
          of a package of lessons. Remember, buying a package of lessons will
          save you money versus buying them one at a time.`}
        </Typography>
      </Box>
      {isLoading ? (
        renderSkeletonLoading()
      ) : (
        <Grid container spacing={3} sx={{ maxWidth: "1588px", mx: "auto" }}>
          {pricingData?.map((item) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={item.id}>
              <PricingCard
                {...item}
                onClick={() => {
                  if (user?.role.toLowerCase() === "student") {
                    handleSelectPlanStudent(item?.id, 4);
                    return;
                  }
                  router.push(
                    `/signup/?purchasePackageId=${item?.id}&purchasePackageTypeId=4`
                  );
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default IndividualPricingSection;
