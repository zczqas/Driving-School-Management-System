import Head from "next/head";

const EmploymentSEOHead = () => {
  return (
    <Head>
      <title>
        Employment Opportunities | Safety First Driving School | Join Our Team
      </title>
      <meta
        name="description"
        content="Explore exciting career opportunities at Safety First Driving School. Join our team of dedicated professionals and make a difference in driver education. Apply now for rewarding positions in driving instruction and administration."
      />
      <meta
        name="keywords"
        content="employment, job opportunities, driving instructor jobs, Safety First Driving School, careers in driver education"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Employment Opportunities | Safety First Driving School | Join Our Team"
      />
      <meta
        property="og:description"
        content="Explore exciting career opportunities at Safety First Driving School. Join our team of dedicated professionals and make a difference in driver education. Apply now for rewarding positions in driving instruction and administration."
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/drivers-ed-banner.webp"
      />
      <meta
        property="og:url"
        content="https://sfds.usualsmart.com/employment"
      />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Employment Opportunities | Safety First Driving School | Join Our Team"
      />
      <meta
        name="twitter:description"
        content="Explore exciting career opportunities at Safety First Driving School. Join our team of dedicated professionals and make a difference in driver education. Apply now for rewarding positions in driving instruction and administration."
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
      <link rel="canonical" href="https://sfds.usualsmart.com/employment" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default EmploymentSEOHead;