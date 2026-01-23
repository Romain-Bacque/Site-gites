import ResetPassword from "@/app/components/Layout/authentication/ResetPassword";

export const metadata = {
  title:
    "Réinitialisation du mot de passe | Site Gîtes à Erce en Ariège - Réinitialisation sécurisée du mot de passe",
  description:
    "Réinitialisez le mot de passe de votre compte en quelques étapes simples et sécurisées.",
  openGraph: {
    title:
      "Réinitialisation du mot de passe - Site Gîtes à Erce en Ariège | Réinitialisation sécurisée du mot de passe",
    description:
      "Accédez à la page de réinitialisation de mot de passe de votre compte sur le Site Gîtes.",
    type: "website",
    images: [
      {
        url: "/og/gites.jpg",
        width: 1200,
        height: 630,
        alt: "Réinitialisation du mot de passe - Gîtes à Erce en Ariège",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Réinitialisation du mot de passe - Site Gîtes à Erce en Ariège | Réinitialisation sécurisée du mot de passe",
    description:
      "Réinitialisez facilement et en toute sécurité le mot de passe de votre compte Site Gîtes.",
  },
};

const ResetPasswordPage = async () => {
  return <ResetPassword />;
};

export default ResetPasswordPage;
