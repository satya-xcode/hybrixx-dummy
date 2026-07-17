import { cacheLife, cacheTag } from "next/cache";
import { getPool } from "@/lib/db";

export type DashboardStats = {
  totalProducts: number;
  totalCarts: number;
  totalRevenue: number;
  unreadContacts: number;
  newsletterSubscribers: number;
};

export type ContactSubmission = {
  id: number;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
};

export type NewsletterSubscriber = {
  id: number;
  email: string;
  createdAt: Date;
};

/**
 * Get aggregate statistics for the dashboard.
 * Cached for 1 minute for near-real-time updates.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  "use cache";
  cacheLife("seconds");
  cacheTag("dashboard-stats")
  const pool = await getPool();

  const productsCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_Products"
  );

  const cartsCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_CartSessions"
  );

  const revenueResult = await pool.request().query(`
    SELECT COALESCE(SUM(ci.Quantity * p.Price), 0) AS TotalRevenue 
    FROM dbo.Nomad_CartItems ci 
    INNER JOIN dbo.Nomad_Products p ON ci.ProductId = p.Id
  `);

  const unreadCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_ContactSubmissions WHERE IsRead = 0"
  );

  const newsletterCount = await pool.request().query(
    "SELECT COUNT(*) AS cnt FROM dbo.Nomad_NewsletterSubscribers"
  );

  return {
    totalProducts: productsCount.recordset[0].cnt,
    totalCarts: cartsCount.recordset[0].cnt,
    totalRevenue: revenueResult.recordset[0].TotalRevenue,
    unreadContacts: unreadCount.recordset[0].cnt,
    newsletterSubscribers: newsletterCount.recordset[0].cnt,
  };
}

/**
 * Get recent contact form submissions.
 */
export async function getRecentContacts(limit = 5): Promise<ContactSubmission[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag("contacts");

  const pool = await getPool();
  const result = await pool.request()
    .input("limit", limit)
    .query(`
      SELECT TOP (@limit) Id, Name, Email, Message, IsRead, CreatedAt
      FROM dbo.Nomad_ContactSubmissions
      ORDER BY CreatedAt DESC
    `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    name: row.Name,
    email: row.Email,
    message: row.Message,
    isRead: row.IsRead,
    createdAt: row.CreatedAt,
  }));
}

/**
 * Get all contact submissions.
 */
export async function getContactSubmissions(): Promise<ContactSubmission[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag("contacts");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Name, Email, Message, IsRead, CreatedAt
    FROM dbo.Nomad_ContactSubmissions
    ORDER BY CreatedAt DESC
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    name: row.Name,
    email: row.Email,
    message: row.Message,
    isRead: row.IsRead,
    createdAt: row.CreatedAt,
  }));
}

/**
 * Get all newsletter subscribers.
 */
export async function getNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag("newsletter");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Email, CreatedAt
    FROM dbo.Nomad_NewsletterSubscribers
    ORDER BY CreatedAt DESC
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    email: row.Email,
    createdAt: row.CreatedAt,
  }));
}

/**
 * Fetch all products (active + inactive) for admin management.
 */
export async function getAllProducts() {
  "use cache";
  cacheLife("hours");
  cacheTag("products");

  const pool = await getPool();
  const productsResult = await pool.request().query(`
    SELECT Id, Slug, Category, Name, Price, CompareAtPrice,
           Rating, ReviewCount, Badge, Blurb, Description,
           IsActive, CreatedAt, UpdatedAt
    FROM dbo.Nomad_Products
    ORDER BY Id
  `);

  const products: any[] = [];

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
 * Fetch all FAQs (active + inactive) for admin management.
 */
export async function getAllFAQs() {
  "use cache";
  cacheLife("days");
  cacheTag("faqs");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Question, Answer, SortOrder, IsActive
    FROM dbo.Nomad_FAQs
    ORDER BY SortOrder
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    question: row.Question,
    answer: row.Answer,
    sortOrder: row.SortOrder,
    isActive: row.IsActive,
  }));
}

/**
 * Fetch all testimonials (active + inactive) for admin management.
 */
export async function getAllTestimonials() {
  "use cache";
  cacheLife("days");
  cacheTag("testimonials");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Name, Role, Quote, Rating, IsActive
    FROM dbo.Nomad_Testimonials
    ORDER BY Id
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    name: row.Name,
    role: row.Role,
    quote: row.Quote,
    rating: row.Rating,
    isActive: row.IsActive,
  }));
}

export type Category = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

/**
 * Fetch all categories (active + inactive) for admin management.
 */
export async function getAllCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Slug, Name, Description, SortOrder, IsActive
    FROM dbo.Nomad_Categories
    ORDER BY SortOrder
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    slug: row.Slug,
    name: row.Name,
    description: row.Description,
    sortOrder: row.SortOrder,
    isActive: row.IsActive,
  }));
}

/**
 * Fetch active categories for dropdown select.
 */
export async function getActiveCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("days");
  cacheTag("categories");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Slug, Name, Description, SortOrder, IsActive
    FROM dbo.Nomad_Categories
    WHERE IsActive = 1
    ORDER BY SortOrder
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    slug: row.Slug,
    name: row.Name,
    description: row.Description,
    sortOrder: row.SortOrder,
    isActive: row.IsActive,
  }));
}

export type CouponDetail = {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  isActive: boolean;
  createdAt: Date;
};

/**
 * Fetch all coupons for dashboard management.
 */
export async function getAllCoupons(): Promise<CouponDetail[]> {
  "use cache";
  cacheLife("seconds");
  cacheTag("coupons");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Code, DiscountType, DiscountValue, IsActive, CreatedAt
    FROM dbo.Nomad_Coupons
    ORDER BY CreatedAt DESC
  `);

  return result.recordset.map((row: any) => ({
    id: row.Id,
    code: row.Code,
    discountType: row.DiscountType as CouponDetail["discountType"],
    discountValue: row.DiscountValue,
    isActive: row.IsActive,
    createdAt: row.CreatedAt,
  }));
}

