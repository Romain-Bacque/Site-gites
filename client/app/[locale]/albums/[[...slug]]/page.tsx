import { Metadata } from "next";
import Gallery from "@/app/components/Layout/Gallery";
import {
  getSheltersWithPicturesRequest,
  ShelterWithPictures,
} from "@/app/lib/api";

export const revalidate = 3600; // 1h ISR

export const metadata: Metadata = {
  title: "Galerie - Site Gîtes",
  description:
    "Galerie photos des gîtes à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature, randonnées et calme.",
  openGraph: {
    title: "Galerie - Site Gîtes",
    description:
      "Galerie photos des gîtes à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature, randonnées et calme.",
    type: "website",
    images: [
      {
        url: "/og/gites.jpg",
        width: 1200,
        height: 630,
        alt: "Gîtes à Erce en Ariège",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Galerie - Site Gîtes",
    description:
      "Galerie photos des gîtes à Erce en Ariège, au cœur du Couserans",
  },
};

export default async function AlbumsPage({
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

  return <Gallery shelters={shelters} shelterId={shelterId} />;
}
