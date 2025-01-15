import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { constants } from "@/utils/constants";
import { openSans } from "@/themes/typography";
import { useRouter } from "next/router";
import { useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";
import { setCookie } from "cookies-next";

interface Feature {
  name: string;
  included: boolean;
}

interface PricingCardProps {
  categoryId: number;
  id: number;
  title: string;
  price: string;
  hours: number;
  features: Feature[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  categoryId,
  id,
  title,
  price,
  hours,
  features,
}) => {
  const router = useRouter();
  const user = useAppSelector(
    (state: IRootState) => state?.auth?.currentUser?.user
  );

  function handleSelectPlanStudent(
    purchasePackageId: string,
    purchasePackageTypeId: string
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

  return (
    <Card
      sx={{
        maxWidth: 300,
        width: "100%",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        borderRadius: "16px",
        fontFamily: openSans.style.fontFamily,
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ paddingX: "40px", pt: "48px" }}>
          <Typography
            variant="h6"
            component="div"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textAlign: "center",
              lineHeight: "normal",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="h4"
            color="primary"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: "#F37636",
              textAlign: "center",
              fontSize: "25px",
            }}
          >
            {price}
          </Typography>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            gutterBottom
            sx={{ textAlign: "center" }}
          >
            lessons
          </Typography>
          <Box sx={{ my: 2, borderTop: "1px solid #E0E0E0" }} />
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              textAlign: "center",
              "& span": {
                fontWeight: 700,
              },
            }}
          >
            <span> {hours}</span> hours package
          </Typography>
          <Box sx={{ my: 2, borderTop: "1px solid #E0E0E0" }} />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              mb: 3,
              backgroundColor: constants.color.primary.main,
              "&:hover": {
                backgroundColor: "#5A52D5",
              },
              textTransform: "none",
              borderRadius: "5px",
              padding: "10px 0",
              fontWeight: 600,
            }}
            onClick={() => {
              if (user?.role.toLowerCase() === "student") {
                handleSelectPlanStudent(id.toString(), categoryId.toString());
                return;
              }
              router.push(
                `/signup/?purchasePackageId=${id}&purchasePackageTypeId=${categoryId}`
              );
            }}
          >
            Select Plan
          </Button>
        </Box>

        <Typography
          variant="body2"
          gutterBottom
          sx={{
            fontWeight: "medium",
            mb: 1,
            textAlign: "center",
            background: "#F5F5F5",
          }}
        >
          All features options
        </Typography>

        <Box sx={{ paddingX: "40px", pb: "30px" }}>
          <List disablePadding>
            {features?.map((feature) => (
              <ListItem key={feature?.name} disablePadding sx={{ mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: "24px" }}>
                  {feature?.included ? (
                    <CheckCircleIcon sx={{ color: "#6C63FF", fontSize: 20 }} />
                  ) : (
                    <CancelIcon sx={{ color: "#E0E0E0", fontSize: 20 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={feature?.name}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: feature?.included ? "#454545" : "#BDBDBD",
                      fontSize: "0.875rem",
                    },
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PricingCard;
