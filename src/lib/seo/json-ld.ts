import { siteConfig } from "@/config/site";
import type { Product } from "@/lib/types";

/**
 * Centralized JSON-LD structured data generators.
 *
 * Google uses structured data for:
 * - Rich results (stars, price, FAQ accordions in SERPs)
 * - Knowledge Graph
 * - Product carousels
 *
 * Every schema here follows https://schema.org and Google's
 * structured data guidelines.
 */

// ─── Organization (sitewide, injected in root layout) ────────────

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: "hello@nomad-gear.example",
      availableLanguage: ["English", "Hindi"],
    },
    sameAs: [
      `https://twitter.com/${siteConfig.twitterHandle.replace("@", "")}`,
    ],
  };
}

// ─── WebSite (for sitelinks search box) ──────────────────────────

export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: { "@id": `${siteConfig.url}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

// ─── Product (individual product page) ───────────────────────────

export function getProductSchema(product: Product, categoryName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteConfig.url}/shop/${product.category}/${product.slug}#product`,
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    category: categoryName
      ? `Electronics > ${categoryName}`
      : getCategoryLabel(product.category),
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `${siteConfig.url}/shop/${product.category}/${product.slug}`,
      seller: { "@id": `${siteConfig.url}/#organization` },
      priceValidUntil: "2027-12-31",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: product.price >= 1999 ? "0" : "99",
          currency: "INR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 0,
            maxValue: 1,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 2,
            maxValue: 6,
            unitCode: "DAY",
          },
        },
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "IN",
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "IN",
        returnPolicyCategory:
          "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating.toString(),
      bestRating: "5",
      reviewCount: product.reviewCount.toString(),
    },
  };
}

// ─── BreadcrumbList (product page navigation) ────────────────────

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── ItemList (shop page — product carousel in SERPs) ────────────

export function getItemListSchema(products: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} Products`,
    numberOfItems: products.length,
    itemListElement: products.map((product, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${siteConfig.url}/shop/${product.category}/${product.slug}`,
      name: product.name,
    })),
  };
}

// ─── FAQPage (FAQ page — rich results in Google!) ────────────────

export function getFAQPageSchema(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// ─── LocalBusiness (contact page) ────────────────────────────────

export function getLocalBusinessSchema(contactInfo: {
  email: string;
  phone: string;
  address: string;
  hours: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    url: siteConfig.url,
    email: contactInfo.email,
    telephone: contactInfo.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Sector 62",
      addressLocality: "Noida",
      addressRegion: "Uttar Pradesh",
      postalCode: "201301",
      addressCountry: "IN",
    },
    openingHours: "Mo-Sa 10:00-18:00",
  };
}

// ─── CollectionPage (shop page — supports category filtering) ────

export function getCollectionPageSchema(
  products: Product[],
  options?: { categoryName?: string; categorySlug?: string }
) {
  const isFiltered = options?.categorySlug;
  const pageName = isFiltered
    ? `Shop ${options.categoryName} — ${siteConfig.name}`
    : `Shop — ${siteConfig.name}`;
  const pageUrl = isFiltered
    ? `${siteConfig.url}/shop/${options.categorySlug}`
    : `${siteConfig.url}/shop`;
  const pageId = isFiltered
    ? `${siteConfig.url}/shop/${options.categorySlug}#collection`
    : `${siteConfig.url}/shop#collection`;
  const pageDescription = isFiltered
    ? `Browse all ${options.categoryName?.toLowerCase()} from ${siteConfig.name}.`
    : `Every product ${siteConfig.name} makes, on one page.`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageId,
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    mainEntity: getItemListSchema(products),
  };
}

// ─── WebPage (homepage structured data) ──────────────────────────

export function getWebPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteConfig.url}/#webpage`,
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    isPartOf: { "@id": `${siteConfig.url}/#website` },
    about: { "@id": `${siteConfig.url}/#organization` },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/og-image.png`,
    },
  };
}

// ─── Helper ──────────────────────────────────────────────────────

function getCategoryLabel(category: string): string {
  const map: Record<string, string> = {
    charger: "Electronics > Chargers",
    cable: "Electronics > Cables",
    "power-bank": "Electronics > Power Banks",
    kit: "Electronics > Travel Kits",
  };
  return map[category] ?? "Electronics";
}
