import Head from "next/head";

const BlogSEOHead = () => {
  return (
    <Head>
      <title>
        {`Blog | Safety First Driving School | Essential Driving Skills for Teens`}
      </title>
      <meta
        name="description"
        content="Empowering teens with essential driving skills and confidence. Read our blog for tips on driver training, safety, and more."
      />
      <meta
        name="keywords"
        content="teen driving, driver training, driving skills, safety tips, driver education, Safety First Driving School"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Blog | Safety First Driving School | Essential Driving Skills for Teens"
      />
      <meta
        property="og:description"
        content="Empowering teens with essential driving skills and confidence. Read our blog for tips on driver training, safety, and more."
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/blog/teen-driving-banner.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com/blog" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Blog | Safety First Driving School | Essential Driving Skills for Teens"
      />
      <meta
        name="twitter:description"
        content="Empowering teens with essential driving skills and confidence. Read our blog for tips on driver training, safety, and more."
      />
      <meta
        name="twitter:image"
        content="https://sfds.usualsmart.com/assets/blog/teen-driving-banner.webp"
      />

      {/* Viewport and Charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://sfds.usualsmart.com/blog" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default BlogSEOHead;