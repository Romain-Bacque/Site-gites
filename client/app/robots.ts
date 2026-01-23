import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*", // Apply to all web crawlers (e.g., Googlebot, Bingbot, etc.)
      allow: "/", // Allow all crawlers to access all pages
      disallow: [
        // fr
        "/fr/bookings",
        "/fr/login",
        "/fr/forgot-password",
        "/fr/reset-password",
        "/fr/email-confirmation",

        // en
        "/en/bookings",
        "/en/login",
        "/en/forgot-password",
        "/en/reset-password",
        "/en/email-confirmation",
      ],
    },
    sitemap:
      `${process.env.NEXT_PUBLIC_BASE_URL}/sitemap.xml` ||
      "https://gites-ariege-erce.fr/sitemap.xml",
  };
}
