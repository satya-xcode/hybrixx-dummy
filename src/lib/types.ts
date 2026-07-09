/**
 * Shared TypeScript types for the Nomad storefront.
 * These mirror the database schema (Nomad_* tables).
 */

export type ProductCategory = string;

export type Product = {
  id: number;
  slug: string;
  category: ProductCategory;
  name: string;
  price: number;
  compareAtPrice: number | null;
  rating: number;
  reviewCount: number;
  badge: string | null;
  blurb: string;
  description: string;
  features: string[];
  specs: { label: string; value: string }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type FAQ = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isActive: boolean;
};

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  isActive: boolean;
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

export type CartSession = {
  id: number;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CartItem = {
  id: number;
  sessionId: number;
  productId: number;
  quantity: number;
  addedAt: Date;
  // Joined fields (from product)
  productName?: string;
  productSlug?: string;
  productPrice?: number;
  productCategory?: ProductCategory;
  productBadge?: string | null;
  productBlurb?: string;
};

export type SiteSetting = {
  id: number;
  settingKey: string;
  settingValue: string; // JSON
  updatedAt: Date;
};
