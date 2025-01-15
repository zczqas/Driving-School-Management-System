import React from "react";
import { Box, Typography, Grid, Link as MuiLink, Divider } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { nunito, openSans } from "@/themes/typography";
import { constants } from "@/utils/constants";

const popularCategories = [
  { id: 1, title: "Register / Sign Up Now!", link: "/register" },
  { id: 2, title: "Homepage", link: "/" },
  { id: 3, title: "Behind The Wheel", link: "/behind-the-wheel" },
  { id: 4, title: "Online Drivers Ed", link: "/drivers-ed" },
  { id: 5, title: "Free DMV Practice Test", link: "/practice-test" },
  { id: 6, title: "Contact Us", link: "/contact" },
];

const otherLinks = [
  { id: 1, title: "About Us", link: "/about" },
  { id: 2, title: "Blog", link: "/blog" },
  { id: 3, title: "Our Cars", link: "/our-cars" },
  { id: 4, title: "Our Instructors", link: "/instructors" },
  { id: 5, title: "Sitemap", link: "/sitemap" },
  { id: 6, title: "Testimonials", link: "/testimonials" },
  { id: 7, title: "Employment", link: "/employment" },
  { id: 8, title: "Terms And Conditions", link: "/terms" },
];

const socialLinks = [
  { name: "facebook", url: "https://facebook.com/safetyfirst" },
  { name: "twitter", url: "https://twitter.com/safetyfirst" },
  { name: "linkedin", url: "https://linkedin.com/company/safetyfirst" },
  { name: "instagram", url: "https://instagram.com/safetyfirst" },
];

const Footer = ({ tenantData }: { tenantData: any }) => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#FAFBFF",
        py: 6,
        px: constants.paddingContainerX,
        fontFamily: openSans.style.fontFamily,
      }}
    >
      <Box sx={{ maxWidth: "1500px", mx: "auto" }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 2 }}>
              <Image
                src={tenantData?.logo || "/assets/landing/sfds/logo.webp"}
                alt="Safety First Driving School"
                width={133}
                height={80}
                quality={100}
              />
            </Box>
            <Typography variant="body2" sx={{ mb: "36px", maxWidth: "256px" }}>
              Safety First Driving School offers expert, behind-the-wheel
              training for teens, adults, and seniors.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: "36px" }}>
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginRight: "16px" }}
                >
                  <Image
                    src={`/assets/landing/icons/${social.name}.svg`}
                    alt={`${social.name} icon`}
                    width={26}
                    height={26}
                  />
                </Link>
              ))}
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Image
                src="/assets/landing/icons/mail.svg"
                alt="Email icon"
                width={22}
                height={22}
                style={{ marginRight: "8px" }}
              />
              <Typography variant="body2" sx={{ lineHeight: "157.4%" }}>
                info@safetyfirstds.com
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Image
                src="/assets/landing/icons/phone.svg"
                alt="Phone icon"
                width={22}
                height={22}
                style={{ marginRight: "8px" }}
              />
              <Box>
                <Typography variant="body2">(805) 374-2393</Typography>
                <Typography variant="body2">(818) 865-9455</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Popular Categories
            </Typography>
            <Box sx={{ width: "180px", py: "20px" }}>
              <Divider />
            </Box>

            {popularCategories.map((item) => (
              <Typography key={item.id} component="div" sx={{ mb: 1 }}>
                <Link
                  href={item.link}
                  style={{
                    color: "#1E1E1E",
                    textDecoration: "none",
                    textTransform: "capitalize",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontFamily: openSans.style.fontFamily,
                  }}
                >
                  {item.title}
                </Link>
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Other Links
            </Typography>
            <Box sx={{ width: "180px", py: "20px" }}>
              <Divider />
            </Box>
            {otherLinks.map((item) => (
              <Typography key={item.id} component="div" sx={{ mb: 1 }}>
                <Link
                  href={item.link}
                  style={{
                    color: "#1E1E1E",
                    textDecoration: "none",
                    textTransform: "capitalize",
                    lineHeight: "20px",
                    fontSize: "15px",
                    fontFamily: openSans.style.fontFamily,
                  }}
                >
                  {item.title}
                </Link>
              </Typography>
            ))}
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ width: "180px", py: "20px" }}>
              <Divider />
            </Box>
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
              SAFETY FIRST DRIVING SCHOOL
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              3055 E Thousand Oaks Bl,
              <br />
              Westlake Village, CA 91362
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Mon - Fri 9:00 AM - 6:00 PM
              <br />
              Saturday 10:00 AM - 2:00 PM
            </Typography>
          </Grid>
        </Grid>

        <Typography
          sx={{ mt: 4, textAlign: "left", fontFamily: nunito.style.fontFamily }}
        >
          Copyright © 2024 | Safety First Driving School
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
