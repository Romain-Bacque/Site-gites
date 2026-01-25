import Profile from "@/app/components/Layout/authentication/Profile";

export const metadata = {
  title:
    "Profil | Site Gîtes à Erce en Ariège - Modification du mot de passe",
  description:
    "Modifiez le mot de passe de votre compte en toute sécurité.",
  openGraph: {
    title:
      "Profil - Site Gîtes à Erce en Ariège | Modification du mot de passe",
    description:
      "Accédez à la page de modification de mot de passe de votre compte sur le Site Gîtes.",
    type: "website",
    images: [
      {
        url: "/og/gites.jpg",
        width: 1200,
        height: 630,
        alt: "Profil - Gîtes à Erce en Ariège",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Profil - Site Gîtes à Erce en Ariège | Modification du mot de passe",
    description:
      "Modifiez facilement et en toute sécurité le mot de passe de votre compte Site Gîtes.",
  },
};

const ProfilePage = async () => {
  return <Profile />;
};

export default ProfilePage;
