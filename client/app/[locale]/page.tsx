import { Metadata } from "next";
import Home from "../components/Layout/Home";
import { getShelters } from "../lib/api";
import { HomePageProps } from "../components/Layout/Home/types";

export const metadata: Metadata = {
  title: "Accueil - Site Gîtes",
  description:
    "Bienvenue sur le site des gîtes à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature et randonnées.",
  openGraph: {
    title: "Accueil - Site Gîtes",
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
    title: "Accueil - Site Gîtes",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
  },
};

export const revalidate = 30; // Revalidate this page every 30 seconds

export default async function Page() {
  let shelters: HomePageProps["shelters"] = [];

  try {
    shelters = await getShelters();
  } catch {
    shelters = [];
  }

  return <Home shelters={shelters} />;
}
