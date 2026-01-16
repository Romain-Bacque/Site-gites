import Shelters from "@/app/components/Layout/Shelters";
import {
  getSheltersWithPicturesRequest,
  ShelterWithPictures,
} from "@/app/lib/api";
import { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Détails des gîtes",
  description:
    "Découvrez ces gîtes tout confort à Erce en Ariège (09), au cœur du Couserans. Nature, randonnées et calme.",
  openGraph: {
    title: "Détails des gîtes - Site Gîtes",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
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
    title: "Détails des gîtes - Site Gîtes",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
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
