import { StyledTableHead, StyledTableRow } from "@/components/CustomTable";
import { useAppDispatch, useAppSelector } from "@/hooks";
import IRootState from "@/store/interface";

import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

interface Props {}

const BlogsView = ({}: Props) => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { blogsData, blogsDataLoading } = useAppSelector(
    (state: IRootState) => state.blogs
  );

  const sampleBlogsData = {
    total: 1,
    blogs: [
      {
        title:
          "Take Driver Training Courses Online To Fulfill California State Requirement for Drivers Education",
        description:
          "Discover the convenience of online driving courses with Safety First Driving School. Learn at your own pace, anywhere, anytime, and prepare for DMV exams with ease. Our comprehensive, easy-to-follow training enhances road safety and driving skills for learners of all ages. Join over 25 years of trusted expertise in creating confident, capable drivers.",
        content:
          '<div><style type="text/css">.point-text li { font-family: Helvetica Neue, Helvetica, Arial, sans-serif; font-size: 12px; }</style><div class="yext-post-embed-message" style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px">Going to a classroom, daily, without failing in attendance is too old school. Moreover, it\'s hard to find time in our busy lives to go all the way to a driving school to learn and understand how to drive better. Thanks to the technological reforms happening at a quickened pace, you can now take driver training courses online at the comfort of your home, in your comfy bean bag, with your freshly prepared cup of coffee, at any time throughout the day.</div><h2 class="inner-title">Why should you take a driving course?</h2><div class="yext-post-embed-message" style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px">If you are 16 to 17 1/2 years old you are required to take Driver\'s Education in order to get your permit. Even after the age of 18 you will be required to take a written test to get your permit. This course helps people of any age to prepare for the written test at the DMV. Did you know that reports suggest that more than 32,000 people die every year in car accidents? In fact, in 2013, it was found that 3,000 people died in California, alone, due to car crashes. As per the U.S Department of Transportation, driving courses are important to avert accidents by envisioning unsafe circumstances and altering your driving practices. The essential goal of these courses is to enhance your capacity to deal with unfriendly street conditions, climatic conditions, and manage the activities of different drivers on the road.</div><h2 class="inner-title">What to expect from a comprehensive driving course?</h2><strong>Should you choose online driver\'s education these are the things that you can expect from the course:</strong><ul class="point-text"><li>10 chapters and a final exam</li><li>Easy format - Simple to understand</li><li>Thorough information that you will need</li><li>Unlimited DMV practice tests</li><li>No classroom attendance required</li><li>Start and stop the course anytime you want</li></ul><h2 class="inner-title">Why choose Safety First Driving School?</h2><div class="yext-post-embed-message" style="font-family:Helvetica Neue, Helvetica, Arial, sans-serif;font-size:12px">At Safety First, our only objective is to educate and train safe, capable and confident drivers with all the skills necessary to safely use a car in today\'\\\'s road system and successfully pass DMV examinations. There isn\'\\\'t a driver we can\'\\\'t improve. Our online drivers training course consists of ten easy-to-follow sections that build your knowledge from fundamentals of driving to advanced rules of the road. Moreover, Safety First Driving School is licensed by the California Department of Motor Vehicles (license #E4732). We are also Bonded and Insured. We have been in business for over 25 years. With many instructors that have been with the company for 10 plus years.</div></div>',
        meta_title:
          "Learn to Drive Online | Comprehensive Driving Courses at Safety First Driving School",
        meta_description:
          "Take online driving courses with Safety First Driving School from the comfort of your home. Prepare for DMV exams with our comprehensive, easy-to-follow training. Licensed and trusted for over 25 years.",
        keywords:
          "online driving courses, DMV practice tests, driver's education, Safety First Driving School, learn to drive online, comprehensive driver training, safe driving courses, California DMV-approved courses, online driver's training",
        category_id: 1,
        driving_school_id: 1,
        id: 123,
        created_at: "2024-12-06T10:00:00Z",
        updated_at: "2024-12-06T10:00:00Z",
        is_active: true,
        is_deleted: false,
        blog_images: [
          {
            url: "https://images.unsplash.com/photo-1694344500122-7738f8c104a6?q=80&w=2070&auto=format&fit=crop",
            type: "image/webp",
          },
        ],
        category: {
          id: 1,
          name: "Driving Courses",
        },
      },
    ],
  };

  return (
    <Fragment>
      <Box sx={{ overflow: "auto", zoom: { xs: 0.85, lg: 0.9 } }}>
        <Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
          <TableContainer
            sx={{ border: "1px solid #EAECEE", borderRadius: "8px" }}
            component={Paper}
          >
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
              <StyledTableHead>
                <StyledTableRow>
                  <TableCell>NO.</TableCell>
                  <TableCell align="center">Image</TableCell>
                  <TableCell align="center">Title</TableCell>
                  <TableCell align="center">Category</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </StyledTableRow>
              </StyledTableHead>
              <TableBody>
                {sampleBlogsData?.blogs?.length > 0 ? (
                  sampleBlogsData?.blogs?.map((row: any, index: number) => (
                    <Fragment key={index}>
                      <StyledTableRow>
                        <TableCell component="th" scope="row">
                          {index + 1}
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            minWidth: 350,
                          }}
                        >
                            <Typography>
                                <Image
                                    src={row.blog_images[0].url}
                                    alt="blog"
                                    width={100}
                                    height={100}
                                />
                            </Typography>
                        </TableCell>

                        <TableCell
                          align="center"
                          sx={{
                            minWidth: 350,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <IconButton
                              sx={{
                                padding: "6px 8px", // Adjust padding for rectangular shape
                                backgroundColor: "#F37736",
                                "&:hover": {
                                  backgroundColor: "#EB5B00",
                                },
                                "&:disabled": {
                                  backgroundColor: "#f377368f",
                                },
                                mr: 1,
                                borderRadius: "4px",
                              }}
                              disabled={row.scheduled_lesson > 0}
                              //   onClick={() => handleOpenDialog(row)}
                            >
                              <Image
                                src="/assets/icons/credit-card.svg"
                                alt="eye"
                                height={16}
                                width={16}
                                style={{ marginRight: "8px" }}
                              />
                              <span
                                style={{
                                  fontWeight: "bold",
                                  fontSize: "0.875rem",
                                  color: "#fff",
                                }}
                              >
                                Edit Blog
                              </span>
                            </IconButton>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    </Fragment>
                  ))
                ) : (
                  <StyledTableRow>
                    <TableCell
                      component="th"
                      scope="row"
                      colSpan={12}
                      align="center"
                    >
                      No Blogs found! Please add some blogs.
                    </TableCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Fragment>
  );
};

export default BlogsView;
