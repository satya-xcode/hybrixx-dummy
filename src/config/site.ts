/**
 * Static site configuration — nav links, brand identity, SEO.
 *
 * NOTE: Product data, FAQs, testimonials, and contact info have been moved
 * to the MSSQL database (MES_2026, Nomad_* tables) and are fetched via
 * the data layer in `src/lib/data/`.
 */

export const siteConfig = {
  name: "Nomad",
  tagline: "Gear that keeps up with you",
  description:
    "A dummy D2C storefront demo — GaN chargers, cables & everyday carry, built to show off a reusable, animated component system.",
  /**
   * Placeholder domain — this is a demo project (see README). Replace with
   * the real production domain before going live; every metadataBase,
   * canonical URL, sitemap entry, and JSON-LD @id in this project reads
   * from this single value.
   */
  url: "https://nomad-gear.example",
  keywords: [
    "GaN charger",
    "USB-C fast charger",
    "braided USB-C cable",
    "portable power bank",
    "D2C electronics India",
    "travel charging kit",
  ],
  ogImageAlt: "Nomad — Gear that keeps up with you",
  twitterHandle: "@nomad_gear",
  nav: [
    { label: "Shop", href: "/shop" },
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};
