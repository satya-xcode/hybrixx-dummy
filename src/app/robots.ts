import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt — controls search engine crawling.
 * Critical for SEO: tells Google which pages to index and
 * where to find the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/cart", "/api/", "/dashboard"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
