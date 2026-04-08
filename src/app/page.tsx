import type { Metadata } from "next";

import { LandingPage } from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Nath Energy & Infrastructure | Trusted EPC Partner for Infrastructure & Solar Projects",
  description:
    "Nath Energy & Infrastructure delivers EPC services for roads, drainage, civil infrastructure, rooftop solar, and utility-scale solar projects across India.",
  keywords: [
    "EPC contractor India",
    "road construction company",
    "drainage and sewage infrastructure",
    "commercial rooftop solar EPC",
    "ground mounted solar EPC",
    "government tender execution",
    "industrial infrastructure contractor",
  ],
  openGraph: {
    title: "Nath Energy & Infrastructure",
    description:
      "Building Strong Infrastructure. Powering a Sustainable Future.",
    type: "website",
  },
};

const organizationSchema = {
  "@type": "Organization",
  name: "Nath Energy & Infrastructure",
  description:
    "EPC contractor for roads, drainage systems, civil infrastructure, and commercial solar projects in India.",
  telephone: "+91-60265-14250",
  email: "nathenergyinfrastructure@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "S.K Road",
    addressLocality: "Silchar",
    addressRegion: "Assam",
    postalCode: "788110",
    addressCountry: "IN",
  },
  areaServed: "India",
  sameAs: [
    "https://www.linkedin.com/",
    "https://wa.me/916026514250",
  ],
};

const serviceSchema = {
  "@type": "Service",
  serviceType: "Infrastructure and Solar EPC Services",
  provider: {
    "@type": "Organization",
    name: "Nath Energy & Infrastructure",
  },
  areaServed: "India",
  audience: {
    "@type": "BusinessAudience",
    audienceType:
      "Government departments, municipalities, infrastructure developers, factories, industries, institutions, and landowners",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [organizationSchema, serviceSchema],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <LandingPage />
    </>
  );
}
