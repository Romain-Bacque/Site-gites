import { MetadataRoute } from "next";
import { getSheltersWithPicturesRequest } from "@/app/lib/api";
import { ShelterType } from "@/app/components/Layout/Gallery/types";

const SITE_URL = "https://gites-ariege-erce.fr";
const LOCALES = ["fr", "en"];

type DynamicRoute = {
  slug: string[];
};

// Sert à générer les routes dynamiques :
// /[locale]/albums/[id]
// /[locale]/shelters/[id]
async function getDynamicRoutes(): Promise<DynamicRoute[]> {
  try {
    const shelters = await getSheltersWithPicturesRequest();

    return shelters.map((shelter) => {
      const anyShelter = shelter as ShelterType;

      return {
        slug: [anyShelter._id],
      };
    });
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [];
  const dynamicRoutes = await getDynamicRoutes();

  for (const locale of LOCALES) {
    // 🏠 Homepage → /[locale]
    routes.push({
      url: `${SITE_URL}/${locale}`,
      lastModified: new Date(),
      priority: 1.0,
    });

    // 🖼️ Albums racine → /[locale]/albums
    routes.push({
      url: `${SITE_URL}/${locale}/albums`,
      lastModified: new Date(),
      priority: 0.9,
    });

    // 🏡 Shelters racine → /[locale]/shelters
    routes.push({
      url: `${SITE_URL}/${locale}/shelters`,
      lastModified: new Date(),
      priority: 0.9,
    });

    // 📸 Albums dynamiques → /[locale]/albums/[id]
    dynamicRoutes.forEach((route) => {
      routes.push({
        url: `${SITE_URL}/${locale}/albums/${route.slug.join("/")}`,
        lastModified: new Date(),
        priority: 0.8,
      });
    });

    // 🏡 Shelters dynamiques → /[locale]/shelters/[id]
    dynamicRoutes.forEach((route) => {
      routes.push({
        url: `${SITE_URL}/${locale}/shelters/${route.slug.join("/")}`,
        lastModified: new Date(),
        priority: 0.8,
      });
    });
  }

  return routes;
}
