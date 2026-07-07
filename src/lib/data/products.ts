import { cacheLife, cacheTag } from "next/cache";
import { getPool } from "@/lib/db";
import type { Product } from "@/lib/types";

/**
 * Fetch all active products with their features and specs.
 * Cached for 1 hour, tagged for on-demand invalidation.
 */
export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const pool = await getPool();

  const productsResult = await pool.request().query(`
    SELECT Id, Slug, Category, Name, Price, CompareAtPrice,
           Rating, ReviewCount, Badge, Blurb, Description,
           IsActive, CreatedAt, UpdatedAt
    FROM dbo.Nomad_Products
    WHERE IsActive = 1
    ORDER BY Id
  `);

  const products: Product[] = [];

  for (const row of productsResult.recordset) {
    const featuresResult = await pool
      .request()
      .input("productId", row.Id)
      .query(
        "SELECT Feature FROM dbo.Nomad_ProductFeatures WHERE ProductId = @productId ORDER BY SortOrder"
      );

    const specsResult = await pool
      .request()
      .input("productId", row.Id)
      .query(
        "SELECT Label, Value FROM dbo.Nomad_ProductSpecs WHERE ProductId = @productId ORDER BY SortOrder"
      );

    products.push({
      id: row.Id,
      slug: row.Slug,
      category: row.Category,
      name: row.Name,
      price: row.Price,
      compareAtPrice: row.CompareAtPrice,
      rating: parseFloat(row.Rating),
      reviewCount: row.ReviewCount,
      badge: row.Badge,
      blurb: row.Blurb,
      description: row.Description,
      features: featuresResult.recordset.map((f: { Feature: string }) => f.Feature),
      specs: specsResult.recordset.map((s: { Label: string; Value: string }) => ({
        label: s.Label,
        value: s.Value,
      })),
      isActive: row.IsActive,
      createdAt: row.CreatedAt,
      updatedAt: row.UpdatedAt,
    });
  }

  return products;
}

/**
 * Fetch a single product by slug with features and specs.
 * Each product gets its own cache tag for granular invalidation.
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  "use cache";
  cacheLife("hours");
  cacheTag(`product:${slug}`);

  const pool = await getPool();

  const result = await pool
    .request()
    .input("slug", slug)
    .query(`
      SELECT Id, Slug, Category, Name, Price, CompareAtPrice,
             Rating, ReviewCount, Badge, Blurb, Description,
             IsActive, CreatedAt, UpdatedAt
      FROM dbo.Nomad_Products
      WHERE Slug = @slug AND IsActive = 1
    `);

  if (result.recordset.length === 0) return null;

  const row = result.recordset[0];

  const featuresResult = await pool
    .request()
    .input("productId", row.Id)
    .query(
      "SELECT Feature FROM dbo.Nomad_ProductFeatures WHERE ProductId = @productId ORDER BY SortOrder"
    );

  const specsResult = await pool
    .request()
    .input("productId", row.Id)
    .query(
      "SELECT Label, Value FROM dbo.Nomad_ProductSpecs WHERE ProductId = @productId ORDER BY SortOrder"
    );

  return {
    id: row.Id,
    slug: row.Slug,
    category: row.Category,
    name: row.Name,
    price: row.Price,
    compareAtPrice: row.CompareAtPrice,
    rating: parseFloat(row.Rating),
    reviewCount: row.ReviewCount,
    badge: row.Badge,
    blurb: row.Blurb,
    description: row.Description,
    features: featuresResult.recordset.map((f: { Feature: string }) => f.Feature),
    specs: specsResult.recordset.map((s: { Label: string; Value: string }) => ({
      label: s.Label,
      value: s.Value,
    })),
    isActive: row.IsActive,
    createdAt: row.CreatedAt,
    updatedAt: row.UpdatedAt,
  };
}

/**
 * Fetch all product slugs for generateStaticParams.
 * Cached for longer since slugs change rarely.
 */
export async function getProductSlugs(): Promise<{ slug: string }[]> {
  "use cache";
  cacheLife("days");
  cacheTag("product-slugs");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Slug FROM dbo.Nomad_Products WHERE IsActive = 1 ORDER BY Id
  `);

  return result.recordset.map((r: { Slug: string }) => ({ slug: r.Slug }));
}
