import Shelters from "@/app/components/Layout/Shelters";
import {
  getSheltersWithPicturesRequest,
  ShelterWithPictures,
} from "@/app/lib/api";
import { Metadata } from "next";

export const revalidate = 60;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "@id":
    (process.env.NEXT_PUBLIC_BASE_URL || "https://gites-ariege-erce.fr") +
    "/#lodging",
  name: "Gîtes à Erce en Ariège au cœur du Couserans",
  url: process.env.NEXT_PUBLIC_BASE_URL || "https://gites-ariege-erce.fr",
  description:
    "Découvrez nos gîtes tout confort à Erce en Ariège (09), au cœur du Couserans. Profitez de la nature, des randonnées et du calme pour des vacances inoubliables.",
  image: [
    `${process.env.NEXT_PUBLIC_BASE_URL || "https://gites-ariege-erce.fr"}/og/gites.jpg`,
  ],
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Erce",
    addressLocality: "Erce",
    addressRegion: "Occitanie",
    postalCode: "09140",
    addressCountry: "FR",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 42.86,
    longitude: 1.03,
  },
  amenityFeature: [
    {
      "@type": "LocationFeatureSpecification",
      name: "Parking gratuit",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Animaux acceptés sous accord",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Wi-Fi gratuit",
      value: true,
    },
    {
      "@type": "LocationFeatureSpecification",
      name: "Capacité maximale",
      value: "4 personnes",
    },
  ],
};

export const metadata: Metadata = {
  title:
    "Détails des gîtes - Site Gîtes à Erce en Ariège | Location de vacances tout confort",
  description:
    "Découvrez ces gîtes tout confort à Erce en Ariège (09), au cœur du Couserans. Nature, randonnées et calme.",
  openGraph: {
    title:
      "Détails des gîtes - Site Gîtes à Erce en Ariège | Location de vacances tout confort",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL || "https://gites-ariege-erce.fr"}/og/gites.jpg`,
        width: 1200,
        height: 630,
        alt: "Gîtes à Erce en Ariège | Location de vacances tout confort",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Détails des gîtes - Site Gîtes à Erce en Ariège | Location de vacances tout confort",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
  },
  other: {
    "application/ld+json": JSON.stringify(jsonLd),
  },
};

export default async function SheltersPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  let shelters: ShelterWithPictures[] = [];
  const shelterId = params.slug?.[0];

  try {
    shelters = await getSheltersWithPicturesRequest();
  } catch {
    shelters = [];
  }

  return <Shelters shelters={shelters} shelterId={shelterId} />;
}
