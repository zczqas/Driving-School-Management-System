import React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Link,
} from "@mui/material";
import { openSans } from "@/themes/typography";

interface BlogCardProps {
  image: string;
  author: string;
  date: string;
  time: string;
  title: string;
  content: string;
  readMoreLink: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  image,
  author,
  date,
  time,
  title,
  content,
  readMoreLink,
}) => {
  return (
    <Card sx={{ maxWidth: 500, boxShadow: "none" }}>
      <Box sx={{ position: "relative", width: "100%", height: 300, borderRadius: "20px", overflow: "hidden" }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
      <CardContent sx={{ px: 0 }}>
        <Typography
          variant="body2"
          sx={{ mb: "26px", fontSize: "18px", color: "#4F5B67" }}
        >
          {author} • {date} • {time}
        </Typography>
        <Typography
          variant="h6"
          component="div"
          sx={{
            mb: "26px",
            fontWeight: 600,
            lineHeight: "normal",
            fontFamily: openSans.style.fontFamily,
            letterSpacing: "-0.28px",
            fontSize: "28px",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            mb: 1,
            fontSize: "20px",
            fontFamily: openSans.style.fontFamily,
            lineHeight: "normal",
            color: "#4F5B67",
          }}
        >
          {content}
        </Typography>
        <Link
          href={readMoreLink}
          color="primary"
          sx={{ textDecoration: "none" }}
        >
          Read More....
        </Link>
      </CardContent>
    </Card>
  );
};

export default BlogCard;