import Auth from "@/app/components/Layout/authentication/Auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentification - Site Gîtes",
  description:
    "Bienvenue sur le site des gîtes à Erce en Ariège (09), au cœur du Couserans. Gîtes tout confort, nature et randonnées.",
  openGraph: {
    title: "Authentification - Site Gîtes",
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
    title: "Authentification - Site Gîtes",
    description: "Gîtes tout confort à Erce en Ariège, au cœur du Couserans",
  },
};

export const revalidate = 3600; // ISR (1h)

export default async function Page() {
  return <Auth />;
}
