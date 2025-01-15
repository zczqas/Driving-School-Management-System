import Head from "next/head";

const DriversEdSEOHead = () => {
  return (
    <Head>
      <title>
        {`Driver's Education | Safety First Driving School | Comprehensive Driving Courses`}
      </title>
      <meta
        name="description"
        content="Enroll in our comprehensive driver's education courses at Safety First Driving School. Learn essential driving skills, traffic laws, and safety practices. Start your journey to becoming a confident driver today!"
      />
      <meta
        name="keywords"
        content="driver's education, driving courses, learn to drive, driving instruction, Safety First Driving School, teen driver education"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Driver's Education | Safety First Driving School | Comprehensive Driving Courses"
      />
      <meta
        property="og:description"
        content="Enroll in our comprehensive driver's education courses at Safety First Driving School. Learn essential driving skills, traffic laws, and safety practices. Start your journey to becoming a confident driver today!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/drivers-ed-banner.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com/drivers-ed" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Driver's Education | Safety First Driving School | Comprehensive Driving Courses"
      />
      <meta
        name="twitter:description"
        content="Enroll in our comprehensive driver's education courses at Safety First Driving School. Learn essential driving skills, traffic laws, and safety practices. Start your journey to becoming a confident driver today!"
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
      <link rel="canonical" href="https://sfds.usualsmart.com/drivers-ed" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default DriversEdSEOHead;