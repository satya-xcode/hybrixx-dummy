import type { MetadataRoute } from "next";

/**
 * robots.txt — controls search engine crawling.
 * Critical for SEO: tells Google which pages to index.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/api/"],
      },
    ],
    sitemap: "https://nomad-gear.example/sitemap.xml",
  };
}
