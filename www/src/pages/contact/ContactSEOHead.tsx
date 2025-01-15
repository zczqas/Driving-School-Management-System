import Head from "next/head";

const ContactSEOHead = () => {
  return (
    <Head>
      <title>
        Contact Us | Safety First Driving School | Get in Touch
      </title>
      <meta
        name="description"
        content="Contact Safety First Driving School for inquiries about our driving lessons, scheduling, or any questions you may have. We're here to help you start your journey to becoming a safe driver!"
      />
      <meta
        name="keywords"
        content="contact driving school, driving lesson inquiries, Safety First Driving School contact, get in touch, driving instruction contact"
      />
      <meta name="author" content="Safety First Driving School" />

      {/* Open Graph / Facebook */}
      <meta
        property="og:title"
        content="Contact Us | Safety First Driving School | Get in Touch"
      />
      <meta
        property="og:description"
        content="Contact Safety First Driving School for inquiries about our driving lessons, scheduling, or any questions you may have. We're here to help you start your journey to becoming a safe driver!"
      />
      <meta
        property="og:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/contact-banner.webp"
      />
      <meta property="og:url" content="https://sfds.usualsmart.com/contact" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="Contact Us | Safety First Driving School | Get in Touch"
      />
      <meta
        name="twitter:description"
        content="Contact Safety First Driving School for inquiries about our driving lessons, scheduling, or any questions you may have. We're here to help you start your journey to becoming a safe driver!"
      />
      <meta
        name="twitter:image"
        content="https://sfds.usualsmart.com/assets/landing/sfds/contact-banner.webp"
      />

      {/* Viewport and Charset */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta charSet="UTF-8" />

      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />

      {/* Canonical URL */}
      <link rel="canonical" href="https://sfds.usualsmart.com/contact" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
    </Head>
  );
};

export default ContactSEOHead;