import React from 'react';
import Head from 'expo-router/head';

// Per-route metadata for the static export. Wraps expo-router/head so every page
// ships a unique title, description, canonical, and Open Graph / Twitter card in
// its static HTML source (before JavaScript runs). Pass JSON-LD as children on
// the pages that need it (home, contact).

export const SITE_URL = 'https://www.saferideafrica.com';
const DEFAULT_IMAGE = `${SITE_URL}/DSC_2116.webp`;

// DrivingSchool structured data. Rendered inside PageHead as a raw <script> on
// the home and contact pages only. Pass it as a child:
//   <PageHead ...><script type="application/ld+json">{DRIVING_SCHOOL_JSONLD}</script></PageHead>
export const DRIVING_SCHOOL_JSONLD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'DrivingSchool',
  name: 'Safe Ride Africa Driving School',
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.png`,
  description:
    'NTSA-certified driving school operating branches across Nairobi, Kenya. 98% first-try pass rate.',
  telephone: '+254746097033',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+254706614662',
    contactType: 'customer service',
  },
  email: 'saferideafrica777@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Buru Buru',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  geo: { '@type': 'GeoCoordinates', latitude: -1.2826, longitude: 36.874 },
  openingHours: 'Mo-Sa 07:00-18:00',
  sameAs: ['https://facebook.com/safrideafrica'],
});

export interface PageHeadProps {
  title: string;
  description: string;
  // Path for canonical + og:url, e.g. '/about'. Defaults to the home page.
  path?: string;
  image?: string;
  children?: React.ReactNode;
}

export function PageHead({
  title,
  description,
  path = '/',
  image = DEFAULT_IMAGE,
  children,
}: PageHeadProps) {
  const url = `${SITE_URL}${path}`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Safe Ride Africa" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_KE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {children}
    </Head>
  );
}

export default PageHead;
