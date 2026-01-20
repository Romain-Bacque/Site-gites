import AllBookings from "@/app/components/Layout/AllBookings";
import { Booking, bookingsGetRequest } from "@/app/lib/api";
import { Metadata } from "next";

export const revalidate = 30; // ISR: revalidate every 30 seconds

export const metadata: Metadata = {
  title:
    "Gestion des réservations - Administration | Site Gîtes à Erce en Ariège",
  description:
    "Espace administrateur pour gérer l'ensemble des demandes de réservation des clients.",
  openGraph: {
    title:
      "Gestion des réservations - Administration | Site Gîtes à Erce en Ariège",
    description: 
      "Espace administrateur pour gérer l'ensemble des demandes de réservation des clients.",
    type: "website",
    images: [
      {
        url: "/og/bookings-admin.jpg",
        width: 1200,
        height: 630,
        alt: "Interface de gestion des réservations",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Gestion des réservations - Administration | Site Gîtes à Erce en Ariège",
    description:
      "Interface administrateur pour gérer toutes les demandes de réservation des clients.",
  },
};

export default async function BookingsPage() {
  let bookings: Booking[] = [];

  try {
    bookings = await bookingsGetRequest();
  } catch {
    bookings = [];
  }

  return <AllBookings bookings={bookings} />;
}
