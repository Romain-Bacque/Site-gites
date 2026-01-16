import ForgotPassword from "@/app/components/Layout/authentication/ForgotPassword";

export const metadata = {
  title: "Mot de passe oublié",
  description:
    "Réinitialisez le mot de passe de votre compte en quelques étapes simples et sécurisées.",
  openGraph: {
    title: "Mot de passe oublié - Site Gîtes",
    description:
      "Accédez à la page de réinitialisation de mot de passe de votre compte sur le Site Gîtes.",
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
    title: "Mot de passe oublié - Site Gîtes",
    description:
      "Réinitialisez facilement et en toute sécurité le mot de passe de votre compte Site Gîtes.",
  },
};

const ForgotPasswordPage = async () => {  
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
