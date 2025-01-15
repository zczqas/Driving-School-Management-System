import React from "react";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import { openSans } from "@/themes/typography";

interface FeatureItemProps {
  title: string;
  description: string[];
  imageSrc: string;
  imageAlt: string;
  imageLeft?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  title,
  description,
  imageSrc,
  imageAlt,
  imageLeft = true,
}) => {
  return (
    <Grid item xs={12} sx={{ mb: 7.5 }}>
      <Grid
        container
        spacing={15.375}
        direction={imageLeft ? "row" : "row-reverse"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Grid item xs={12} md={6}>
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={650}
            height={433}
            layout="responsive"
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: openSans.style.fontFamily,
              fontSize: "28px",
              fontWeight: 600,
              mb: "40px",
              lineHeight: "normal",
              letterSpacing: "-0.28px",
            }}
          >
            {title}
          </Typography>
          {description?.map((paragraph, index) => (
            <Typography
              key={index}
              sx={{
                fontFamily: openSans.style.fontFamily,
                fontSize: "20px",
                color: "#4F5B67",
                mb: "20px",
                lineHeight: "normal",
              }}
            >
              {paragraph}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default FeatureItem;