import { CustomInput, CustomLabel } from "@/components/CustomInput";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { Form, Formik } from "formik";
import moment from "moment";
import React, { useState } from "react";
import * as Yup from "yup";
import { useRouter } from "next/router";

import formatPhoneNumber from "@/utils/formatPhoneNumber";
import CustomDropzone from "@/components/CustomDropZone";
import { useAppDispatch, useAppSelector } from "@/hooks";
import {
  fetchBasicConfiguration,
  updateBasicConfiguration,
  updateDrivingSchoolLogo,
} from "@/store/configuration/configuration.action";
import IRootState from "@/store/interface";
import { BasicConfiguration } from "@/store/configuration/configuration.action"; // Make sure to export this interface from the action file

const BasicSchoolSettings = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const { id } = router.query;
  const isEdit = !!id;

  const dispatch = useAppDispatch();
  const [logo, setLogo] = useState<File | null>(null);

  const handleLogoDrop = (acceptedFiles: File[]) => {
    setLogo(acceptedFiles[0]);
  };

  const handleLogoSubmit = () => {
    // Upload the logo
    if (logo) {
      dispatch(updateDrivingSchoolLogo(id, logo, () => {}));
    }
  };

  React.useEffect(() => {
    dispatch(fetchBasicConfiguration(id));
  }, []);

  const { drivingSchoolById, drivingSchoolByIdLoading } = useAppSelector(
    (state: IRootState) => state.drivingSchoolConfig
  );

  const handleBack = () => {
    router.push("/manage/school-configuration");
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={drivingSchoolByIdLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Box
        sx={{
          padding: (theme) => theme.spacing(4),
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography
            variant="h4"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "normal",
              pt: "13px",
            }}
            color="secondary"
          >
            Driving School Basic Details
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              letterSpacing: "0.24px",
            }}
          >
            Please fill in the following details to update details of {""}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
          <Divider
            sx={{
              flexGrow: 1,
            }}
            orientation="horizontal"
          />
        </Box>

        <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
          <Tab label="Basic Info" />
          <Tab label="Contact & Social" />
          <Tab label="Appearance" />
          <Tab label="Additional Info" />
        </Tabs>

        <Formik
          initialValues={{
            name: "",
            description: "",
            address: "",
            phone: "",
            email: "",
            website: "",
            domain: "",
            primary_color: "",
            secondary_color: "",
            secondary_contact_phone: "",
            social_media: {
              facebook: "",
              twitter: "",
              linkedin: "",
              instagram: "",
            },
            license_number: "",
            location_coordinates: {
              latitude: "",
              longitude: "",
            },
            banner_text: "",
            title_text: "",
            operating_hours: "",
            established_year: "",
            footer_banner_text: "",
            hero_text: "",
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string(),
            phone: Yup.string(),
            address: Yup.string(),
            email: Yup.string(),
            description: Yup.string(),
            website: Yup.string(),
            domain: Yup.string(),
            primary_color: Yup.string(),
            secondary_color: Yup.string(),
            secondary_contact_phone: Yup.string(),
            social_media: Yup.object().shape({
              facebook: Yup.string(),
              twitter: Yup.string(),
              linkedin: Yup.string(),
              instagram: Yup.string(),
            }),
            license_number: Yup.string(),
            location_coordinates: Yup.object().shape({
              latitude: Yup.number(),
              longitude: Yup.number(),
            }),
            banner_text: Yup.string(),
            title_text: Yup.string(),
            operating_hours: Yup.string(),
            established_year: Yup.number(),
            footer_banner_text: Yup.string(),
            hero_text: Yup.string(),
          })}
          onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
            try {
              // if (isEdit) {
              // Map form values to BasicConfiguration structure
              const basicConfig: any = {
                name: values.name ?? '',
                description: values.description ?? '',
                address: values.address ?? '',
                phone: values.phone ?? '',
                secondary_phone: values.secondary_contact_phone ?? '',
                email: values.email ?? '',
                website: values.website ?? '',
                domain: values.domain ?? '',
                primary_color: values.primary_color ?? '',
                secondary_color: values.secondary_color ?? '',
                license_number: values.license_number ?? '',
                latitude: values.location_coordinates?.latitude ? parseFloat(values.location_coordinates.latitude) : null,
                longitude: values.location_coordinates?.longitude ? parseFloat(values.location_coordinates.longitude) : null,
                banner: values.banner_text ?? '',
                title: values.title_text ?? '',
                operating_hours: values.operating_hours ?? '',
                established_year: values.established_year ? parseInt(values.established_year) : null,
                footer_banner: values.footer_banner_text ?? '',
                hero_text: values.hero_text ?? '',
                facebook_url: values.social_media?.facebook ?? '',
                twitter_url: values.social_media?.twitter ?? '',
                instagram_url: values.social_media?.instagram ?? '',
                linkedin_url: values.social_media?.linkedin ?? '',
              };

              // Update the driving school
              if(isEdit) {
                await dispatch(
                  updateBasicConfiguration(id, basicConfig, () => {})
                );
              } else {
                // Handle the case when it's not an edit (if needed)
                
              }
            } catch (error) {
              // setSubmitting(false);
              // You might want to handle the error here, e.g., set an error message
            }
          }}
        >
          {({
            touched,
            errors,
            values,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            handleChange,
            resetForm,
          }) => {
            const handlePhoneNumberChange = (event: any) => {
              // Remove all non-numeric characters
              const cleaned = event.target.value.replace(/\D/g, "");

              // Limit the input to 10 digits
              if (cleaned.length <= 10) {
                const formattedPhoneNumber = formatPhoneNumber(cleaned);
                setFieldValue("phone", formattedPhoneNumber);
              }
            };

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (isEdit && drivingSchoolById) {
                setFieldValue("name", drivingSchoolById.name || "");
                setFieldValue("email", drivingSchoolById.email || "");
                setFieldValue("phone", drivingSchoolById.phone || "");
                setFieldValue("address", drivingSchoolById.address || "");
                setFieldValue("website", drivingSchoolById.website || "");
                setFieldValue("description", drivingSchoolById.description || "");
                setFieldValue("domain", drivingSchoolById.domain || "");
                setFieldValue("primary_color", drivingSchoolById.primary_color || "");
                setFieldValue("secondary_color", drivingSchoolById.secondary_color || "");
                setFieldValue("secondary_contact_phone", drivingSchoolById.secondary_phone || "");
                setFieldValue("license_number", drivingSchoolById.license_number || "");
                setFieldValue("location_coordinates", {
                  latitude: drivingSchoolById.latitude || "",
                  longitude: drivingSchoolById.longitude || ""
                });
                setFieldValue("banner_text", drivingSchoolById.banner || "");
                setFieldValue("title_text", drivingSchoolById.title || "");
                setFieldValue("operating_hours", drivingSchoolById.operating_hours || "");
                setFieldValue("established_year", drivingSchoolById.established_year || "");
                setFieldValue("footer_banner_text", drivingSchoolById.footer_banner || "");
                setFieldValue("hero_text", drivingSchoolById.hero_text || "");
                
                // Set social media values
                setFieldValue("social_media", {
                  facebook: drivingSchoolById.driving_school_urls?.facebook_url || "",
                  twitter: drivingSchoolById.driving_school_urls?.twitter_url || "",
                  instagram: drivingSchoolById.driving_school_urls?.instagram_url || "",
                  linkedin: drivingSchoolById.driving_school_urls?.linkedin_url || ""
                });
              }
            }, [drivingSchoolById, isEdit, setFieldValue]);

            // eslint-disable-next-line react-hooks/rules-of-hooks
            React.useEffect(() => {
              if (!isEdit) {
                resetForm();
              }
            }, [isEdit]);

            return (
              <Form>
                {activeTab === 0 && (
                  <Box>
                    {/* Basic Info Tab */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.name && errors.name)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="name-driving-school">
                            Name *
                          </CustomLabel>
                          <CustomInput
                            id="name-driving-school"
                            type="text"
                            value={values.name}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter the name of the driving school"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.email && errors.email)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="email-signup">
                            Email *
                          </CustomLabel>
                          <CustomInput
                            id="email-signup"
                            type="email"
                            value={values.email}
                            name="email"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter contact email"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.phone && errors.phone)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="phoneNumber-signup">
                            Phone Number *
                          </CustomLabel>
                          <CustomInput
                            id="phoneNumber-signup"
                            type="text"
                            value={values.phone}
                            name="phone"
                            onBlur={handleBlur}
                            onChange={handlePhoneNumberChange}
                            inputProps={{}}
                            placeholder="123-456-7890"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.address && errors.address)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="address">
                            Address *
                          </CustomLabel>
                          <CustomInput
                            id="address"
                            value={values.address}
                            name="address"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter your address"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.website && errors.website)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="website">
                            Website *
                          </CustomLabel>
                          <CustomInput
                            id="website"
                            value={values.website}
                            name="website"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://"
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.domain && errors.domain)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="domain">
                            Domain *
                          </CustomLabel>
                          <CustomInput
                            id="domain"
                            value={values.domain}
                            name="domain"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter your domain"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box>
                    {/* Contact & Social Tab */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.secondary_contact_phone &&
                              errors.secondary_contact_phone
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="secondary_contact_phone">
                            Secondary Contact Phone
                          </CustomLabel>
                          <CustomInput
                            id="secondary_contact_phone"
                            type="text"
                            value={values.secondary_contact_phone}
                            name="secondary_contact_phone"
                            onBlur={handleBlur}
                            onChange={handlePhoneNumberChange}
                            inputProps={{}}
                            placeholder="123-456-7890"
                          />
                        </FormControl>
                      </Grid>

                      {/* Social Media Links */}
                      <Grid item xs={12}>
                        <Typography variant="h6">Social Media Links</Typography>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.social_media?.facebook &&
                              errors.social_media?.facebook
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="social_media.facebook">
                            Facebook
                          </CustomLabel>
                          <CustomInput
                            id="social_media.facebook"
                            type="url"
                            value={values.social_media?.facebook || ""}
                            name="social_media.facebook"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://facebook.com/..."
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.social_media?.twitter &&
                              errors.social_media?.twitter
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="social_media.twitter">
                            X (Twitter)
                          </CustomLabel>
                          <CustomInput
                            id="social_media.twitter"
                            type="url"
                            value={values.social_media?.twitter || ""}
                            name="social_media.twitter"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://twitter.com/..."
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.social_media?.linkedin &&
                              errors.social_media?.linkedin
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="social_media.linkedin">
                            LinkedIn
                          </CustomLabel>
                          <CustomInput
                            id="social_media.linkedin"
                            type="url"
                            value={values.social_media?.linkedin || ""}
                            name="social_media.linkedin"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://linkedin.com/..."
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.social_media?.instagram &&
                              errors.social_media?.instagram
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="social_media.instagram">
                            Instagram
                          </CustomLabel>
                          <CustomInput
                            id="social_media.instagram"
                            type="url"
                            value={values.social_media?.instagram || ""}
                            name="social_media.instagram"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://instagram.com/..."
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box>
                    {/* Appearance Tab */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.primary_color && errors.primary_color
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="primary_color">
                            Primary Color *
                          </CustomLabel>
                          <CustomInput
                            id="primary_color"
                            type="text"
                            value={values.primary_color}
                            name="primary_color"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                          />
                          {/* <CustomInput
                            id="primary_color"
                            type="color"
                            value={values.primary_color}
                            name="primary_color"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                          /> */}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.secondary_color && errors.secondary_color
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="secondary_color">
                            Secondary Color *
                          </CustomLabel>
                          <CustomInput
                            id="secondary_color"
                            type="text"
                            value={values.secondary_color}
                            name="secondary_color"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                          />
                          {/* <CustomInput
                            id="secondary_color"
                            type="color"
                            value={values.secondary_color}
                            name="secondary_color"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                          /> */}
                        </FormControl>
                      </Grid>

                      {/* Logo Upload Component */}
                      <Grid item xs={12}>
                        <Typography variant="h6">
                          Driving School Logo
                        </Typography>
                        <Box sx={{ height: "200px", mb: 2 }}>
                          <CustomDropzone
                            onDrop={handleLogoDrop}
                            previousLogoUrl={
                              drivingSchoolById?.driving_school_urls?.logo_url
                            }
                          />
                          {logo && (
                            <Typography
                              variant="body1"
                              textAlign="center"
                              sx={{ fontWeight: "800" }}
                            >
                              <Typography component="span">
                                File name:{" "}
                              </Typography>
                              {logo.name}
                            </Typography>
                          )}
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleLogoSubmit}
                          sx={{ mt: 2 }}
                        >
                          Upload Logo
                        </Button>
                      </Grid>

                      {/* <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.hero_image && errors.hero_image
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="hero_image">
                            Hero Image URL
                          </CustomLabel>
                          <CustomInput
                            id="hero_image"
                            type="url"
                            value={values.hero_image}
                            name="hero_image"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="https://example.com/hero-image.jpg"
                          />
                        </FormControl>
                      </Grid> */}
                    </Grid>
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box>
                    {/* Additional Info Tab */}
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.license_number && errors.license_number
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="license_number">
                            License Number
                          </CustomLabel>
                          <CustomInput
                            id="license_number"
                            type="text"
                            value={values.license_number}
                            name="license_number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter driving school license number"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.location_coordinates?.latitude &&
                              errors.location_coordinates?.latitude
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel
                            shrink
                            htmlFor="location_coordinates.latitude"
                          >
                            Latitude
                          </CustomLabel>
                          <CustomInput
                            id="location_coordinates.latitude"
                            type="number"
                            value={values.location_coordinates?.latitude || ""}
                            name="location_coordinates.latitude"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="80.123"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={3}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.location_coordinates?.longitude &&
                              errors.location_coordinates?.longitude
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel
                            shrink
                            htmlFor="location_coordinates.longitude"
                          >
                            Longitude
                          </CustomLabel>
                          <CustomInput
                            id="location_coordinates.longitude"
                            type="number"
                            value={values.location_coordinates?.longitude || ""}
                            name="location_coordinates.longitude"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="01.12"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.banner_text && errors.banner_text
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="banner_text">
                            Banner Text
                          </CustomLabel>
                          <CustomInput
                            id="banner_text"
                            type="text"
                            value={values.banner_text}
                            name="banner_text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter banner text"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.title_text && errors.title_text
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="title_text">
                            Title Text
                          </CustomLabel>
                          <CustomInput
                            id="title_text"
                            type="text"
                            value={values.title_text}
                            name="title_text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter title text"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.operating_hours && errors.operating_hours
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="operating_hours">
                            Operating Hours
                          </CustomLabel>
                          <CustomInput
                            id="operating_hours"
                            type="text"
                            value={values.operating_hours}
                            name="operating_hours"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.established_year && errors.established_year
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="established_year">
                            Established Year
                          </CustomLabel>
                          <CustomInput
                            id="established_year"
                            type="number"
                            value={values.established_year}
                            name="established_year"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="YYYY"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(
                            touched.footer_banner_text &&
                              errors.footer_banner_text
                          )}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="footer_banner_text">
                            Footer Banner Text
                          </CustomLabel>
                          <CustomInput
                            id="footer_banner_text"
                            type="text"
                            value={values.footer_banner_text}
                            name="footer_banner_text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter footer banner text"
                          />
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl
                          variant="standard"
                          error={Boolean(touched.hero_text && errors.hero_text)}
                          sx={{ width: "100%" }}
                        >
                          <CustomLabel shrink htmlFor="hero_text">
                            Hero Text
                          </CustomLabel>
                          <CustomInput
                            id="hero_text"
                            type="text"
                            value={values.hero_text}
                            name="hero_text"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            inputProps={{}}
                            placeholder="Enter hero text"
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleBack}
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "330px",
                      width: "100%",
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                    sx={{
                      borderRadius: "100px",
                      padding: "12px 0",
                      textTransform: "none",
                      fontSize: "16px",
                      fontWeight: 700,
                      maxWidth: "330px",
                      width: "100%",
                    }}
                  >
                    {isEdit ? "Save" : "Submit"}
                  </Button>
                </Box>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );
};

export default BasicSchoolSettings;
