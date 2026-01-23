import EmailConfirm from "@/app/components/Layout/authentication/EmailConfirm";

export const metadata = {
  title:
    "Confirmation de l'email | Site Gîtes à Erce en Ariège - Confirmation sécurisée de l'email",
  description:
    "Confirmez l'email de votre compte en quelques étapes simples et sécurisées.",
  openGraph: {
    title:
      "Confirmation de l'email - Site Gîtes à Erce en Ariège | Confirmation sécurisée de l'email",
    description:
      "Accédez à la page de confirmation de l'email de votre compte.",
    type: "website",
    images: [
      {
        url: "/og/gites.jpg",
        width: 1200,
        height: 630,
        alt: "Confirmation de l'email - Gîtes à Erce en Ariège",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Confirmation de l'email - Site Gîtes à Erce en Ariège | Confirmation sécurisée de l'email",
    description:
      "Confirmez facilement et en toute sécurité l'email de votre compte.",
  },
};

const EmailConfirmationPage = async () => {
  return <EmailConfirm />;
};

export default EmailConfirmationPage;