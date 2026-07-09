import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/data/products";
import { getActiveCategories } from "@/lib/data/dashboard";
import { siteConfig } from "@/config/site";

/**
 * Dynamic sitemap — generates all static pages + dynamic product pages
 * + category filter pages for SEO discoverability.
 *
 * Google uses the sitemap to discover pages faster and understand
 * crawl priority. Category filter URLs ensure Google indexes each
 * filtered view as a unique collection page.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categories] = await Promise.all([
    getProductSlugs(),
    getActiveCategories(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteConfig.url}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteConfig.url}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Category filter pages — each is a unique collection page for Google
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteConfig.url}/shop?category=${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Individual product pages
  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((p) => ({
    url: `${siteConfig.url}/shop/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
