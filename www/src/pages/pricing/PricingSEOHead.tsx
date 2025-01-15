import Head from "next/head";

const PricingSEOHead = () => {
  return (
    <Head>
      <title>
        Pricing | Safety First Driving School | Affordable Driving Lessons
      </title>
      <meta
        name="description"
        content="View our competitive pricing for driving lessons at Safety First Driving School. Affordable packages for new drivers, refresher courses, and more. Book your lessons today!"
      />
      <meta
        name="keywords"
        content="driving school pricing, affordable driving lessons, driving course costs, learn to drive prices, driving instruction fees, Safety First Driving School rates"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Pricing | Safety First Driving School | Affordable Driving Lessons"
      />
      <meta
        property="og:description"
        content="View our competitive pricing for driving lessons at Safety First Driving School. Affordable packages for new drivers, refresher courses, and more. Book your lessons today!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/pricing-banner.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com/pricing" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Pricing | Safety First Driving School | Affordable Driving Lessons"
      />
      <meta
        name="twitter:description"
        content="View our competitive pricing for driving lessons at Safety First Driving School. Affordable packages for new drivers, refresher courses, and more. Book your lessons today!"
      />
      <meta
        name="twitter:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/pricing-banner.webp"
      />

      {/* Viewport and Charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://sfds.usualsmart.com/pricing" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default PricingSEOHead;
