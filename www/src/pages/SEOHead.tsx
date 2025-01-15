import Head from "next/head";

const SEOHead = () => {
  return (
    <Head>
      <title>
        Safety First Driving School | Learn to Drive Safely and Confidently
      </title>
      <meta
        name="description"
        content="Enroll at Safety First Driving School for professional driving lessons. Learn to drive safely and confidently with our experienced instructors. Book your lessons now!"
      />
      <meta
        name="keywords"
        content="driving school, driving lessons, professional driving instructors, safety driving, driving courses, learn to drive, driving school near me, riving school thousand oaks, driving school thousand oaks ca, driving school in thousand oaks, driving schools agoura hills ca, driving schools camarillo ca, online drivers ed, drivers education, permit test, drivers education online, Driving education, driving school, Online drivers ed, driving lessons, practical driving lessons, behind the wheel driving lessons"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Safety First Driving School | Learn to Drive Safely and Confidently"
      />
      <meta
        property="og:description"
        content="Enroll at Safety First Driving School for professional driving lessons. Learn to drive safely and confidently with our experienced instructors. Book your lessons now!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/logo.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Safety First Driving School | Learn to Drive Safely and Confidently"
      />
      <meta
        name="twitter:description"
        content="Enroll at Safety First Driving School for professional driving lessons. Learn to drive safely and confidently with our experienced instructors. Book your lessons now!"
      />
      <meta
        name="twitter:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/logo.webp"
      />

      {/* Viewport and Charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://sfds.usualsmart.com" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default SEOHead;
