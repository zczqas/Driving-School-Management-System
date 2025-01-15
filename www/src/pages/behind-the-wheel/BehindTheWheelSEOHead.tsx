import Head from "next/head";

const BehindTheWheelSEOHead = () => {
  return (
    <Head>
      <title>
        Behind the Wheel Training | Safety First Driving School | Hands-On Driving Experience
      </title>
      <meta
        name="description"
        content="Get hands-on driving experience with our behind the wheel training at Safety First Driving School. Practice essential driving skills, traffic navigation, and safety techniques. Start your journey to becoming a confident driver today!"
      />
      <meta
        name="keywords"
        content="behind the wheel, driving practice, hands-on driving, driving instruction, Safety First Driving School, teen driver training"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Behind the Wheel Training | Safety First Driving School | Hands-On Driving Experience"
      />
      <meta
        property="og:description"
        content="Get hands-on driving experience with our behind the wheel training at Safety First Driving School. Practice essential driving skills, traffic navigation, and safety techniques. Start your journey to becoming a confident driver today!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/drivers-ed-banner.webp"
      />
      <meta
        property="og:url"
        content="https://sfds.usualsmart.com/behind-the-wheel"
      />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Behind the Wheel Training | Safety First Driving School | Hands-On Driving Experience"
      />
      <meta
        name="twitter:description"
        content="Get hands-on driving experience with our behind the wheel training at Safety First Driving School. Practice essential driving skills, traffic navigation, and safety techniques. Start your journey to becoming a confident driver today!"
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
      <link rel="canonical" href="https://sfds.usualsmart.com/behind-the-wheel" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default BehindTheWheelSEOHead;