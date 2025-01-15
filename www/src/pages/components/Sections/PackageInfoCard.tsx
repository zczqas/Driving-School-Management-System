import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  keyframes,
} from "@mui/material";
import Image from "next/image";
import { dmSans, openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";
import { ArrowRightAlt } from "@mui/icons-material";
import { useRouter } from "next/router";

interface PackageInfoProps {
  title: string;
  desc: string;
  duration: string;
  selectLink: string;
  learnMoreLink: string;
}

const PackageInfoCard: React.FC<PackageInfoProps> = ({
  title,
  desc,
  duration,
  selectLink,
  learnMoreLink,
}) => {
  const router = useRouter();
  return (
    <Card
      sx={{
        maxWidth: 330,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: "10px",
        boxShadow: "-4px 4px 30px 0px rgba(0, 0, 0, 0.04)",
      }}
    >
      <CardContent
        sx={{
          p: "32px",
        }}
      >
        <Box sx={{ mb: "11px" }}>
          <Image
            src="/assets/landing/start-ills.svg"
            alt="card-star-bullet-icon"
            width={23}
            height={23}
          />
        </Box>
        <Typography
          variant="h6"
          sx={{
            mb: "11px",
            fontFamily: openSans.style.fontFamily,
            color: "#000",
            fontSize: "20px",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontFamily: openSans.style.fontFamily,
            fontSize: "14px",
            lineHeight: "130%",
            color: "#817575",
          }}
        >
          {desc}
        </Typography>
      </CardContent>
      <CardActions
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          p: "32px",
        }}
      >
        <Typography
          component={"h3"}
          sx={{
            color: "#000",
            fontFamily: openSans.style.fontFamily,
            fontSize: "40px",
            fontStyle: "normal",
            fontWeight: "700",
            lineHeight: "normal",
            textAlign: "left",
            pl: 2,
            mb: "18px",
          }}
        >
          {duration}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          href={selectLink}
          sx={{
            mb: 1,
            py: "15px",
            borderRadius: "5px",
            backgroundColor: constants.color.primary.main,
            fontSize: "14px",
            fontFamily: openSans.style.fontFamily,
            fontWeight: 600,
            position: "relative",
            overflow: "hidden",
            "& .MuiButton-endIcon": {
              transition: "transform 0.3s ease-in-out",
            },
            "&:hover .MuiButton-endIcon": {
              animation: `${slideRight} 1s ease-in-out infinite`,
            },
          }}
          endIcon={<ArrowRightAlt />}
          onClick={() => {
            router.push("/login");
          }}
        >
          Select Plan
        </Button>
        <Button
          variant="text"
          fullWidth
          href={learnMoreLink}
          sx={{
            fontFamily: dmSans.style.fontFamily,
            fontWeight: 500,
            fontSize: "14px",
            color: constants.color.text.primary,
          }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default PackageInfoCard;

const slideRight = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(5px);
  }
  100% {
    transform: translateX(0);
  }
`;
