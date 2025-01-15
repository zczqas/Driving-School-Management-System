import Head from "next/head";

const TrafficSchoolSEOHead = () => {
  return (
    <Head>
      <title>
        {`Traffic School | Safety First Driving School | Comprehensive Traffic Courses`}
      </title>
      <meta
        name="description"
        content="Enroll in our comprehensive traffic school courses at Safety First Driving School. Learn essential traffic laws, safe driving practices, and improve your driving record. Start your journey to becoming a safer driver today!"
      />
      <meta
        name="keywords"
        content="traffic school, traffic courses, defensive driving, traffic law education, Safety First Driving School, driver improvement"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Traffic School | Safety First Driving School | Comprehensive Traffic Courses"
      />
      <meta
        property="og:description"
        content="Enroll in our comprehensive traffic school courses at Safety First Driving School. Learn essential traffic laws, safe driving practices, and improve your driving record. Start your journey to becoming a safer driver today!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/drivers-ed-banner.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com/traffic-school" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Traffic School | Safety First Driving School | Comprehensive Traffic Courses"
      />
      <meta
        name="twitter:description"
        content="Enroll in our comprehensive traffic school courses at Safety First Driving School. Learn essential traffic laws, safe driving practices, and improve your driving record. Start your journey to becoming a safer driver today!"
      />
      <meta
        name="twitter:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/drivers-ed-banner.webp"
      />

      {/* Viewport and Charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://sfds.usualsmart.com/traffic-school" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default TrafficSchoolSEOHead;