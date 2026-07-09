"use server";

import { updateTag } from "next/cache";
import { getPool, sql } from "@/lib/db";

export type ActionState = {
  success: boolean;
  error?: string;
};

// Helper to convert product slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ──────────────────────────────────────────────────────────────────────────
   PRODUCT CRUD ACTIONS
   ────────────────────────────────────────────────────────────────────────── */

export async function createProduct(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const compareAtPriceStr = formData.get("compareAtPrice")?.toString().trim();
  const ratingStr = formData.get("rating")?.toString().trim();
  const reviewCountStr = formData.get("reviewCount")?.toString().trim();
  const badge = formData.get("badge")?.toString().trim() || null;
  const blurb = formData.get("blurb")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const featuresText = formData.get("features")?.toString().trim() || "";
  const specsText = formData.get("specs")?.toString().trim() || "";
  const isActive = formData.get("isActive") === "true";

  if (!name || !category || !priceStr || !blurb || !description) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const price = parseInt(priceStr, 10);
  const compareAtPrice = compareAtPriceStr ? parseInt(compareAtPriceStr, 10) : null;
  const rating = ratingStr ? parseFloat(ratingStr) : 5.0;
  const reviewCount = reviewCountStr ? parseInt(reviewCountStr, 10) : 0;
  const slug = generateSlug(name);

  try {
    const pool = await getPool();

    // Check if slug is unique
    const dupCheck = await pool
      .request()
      .input("slug", slug)
      .query("SELECT Id FROM dbo.Nomad_Products WHERE Slug = @slug");

    if (dupCheck.recordset.length > 0) {
      return { success: false, error: "A product with a similar name already exists." };
    }

    // Insert Product
    const result = await pool
      .request()
      .input("slug", slug)
      .input("category", category)
      .input("name", name)
      .input("price", price)
      .input("compareAtPrice", compareAtPrice)
      .input("rating", rating)
      .input("reviewCount", reviewCount)
      .input("badge", badge)
      .input("blurb", blurb)
      .input("description", description)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        INSERT INTO dbo.Nomad_Products
          (Slug, Category, Name, Price, CompareAtPrice, Rating, ReviewCount, Badge, Blurb, Description, IsActive)
        OUTPUT INSERTED.Id
        VALUES
          (@slug, @category, @name, @price, @compareAtPrice, @rating, @reviewCount, @badge, @blurb, @description, @isActive)
      `);

    const productId = result.recordset[0].Id;

    // Parse and insert features
    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    for (let i = 0; i < features.length; i++) {
      await pool
        .request()
        .input("productId", productId)
        .input("feature", features[i])
        .input("sortOrder", i)
        .query(`
          INSERT INTO dbo.Nomad_ProductFeatures (ProductId, Feature, SortOrder)
          VALUES (@productId, @feature, @sortOrder)
        `);
    }

    // Parse and insert specs (Format "Label: Value")
    const specs = specsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const parts = s.split(":");
        const label = parts[0]?.trim();
        const value = parts.slice(1).join(":")?.trim();
        return { label, value };
      })
      .filter((s) => s.label && s.value);

    for (let i = 0; i < specs.length; i++) {
      await pool
        .request()
        .input("productId", productId)
        .input("label", specs[i].label)
        .input("value", specs[i].value)
        .input("sortOrder", i)
        .query(`
          INSERT INTO dbo.Nomad_ProductSpecs (ProductId, Label, Value, SortOrder)
          VALUES (@productId, @label, @value, @sortOrder)
        `);
    }

    // Cache Invalidation
    updateTag("products");
    updateTag("product-slugs");
    updateTag("dashboard-stats");

    return { success: true };
  } catch (err: any) {
    console.error("Create Product Error:", err);
    return { success: false, error: err.message || "Failed to create product." };
  }
}

export async function updateProduct(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const priceStr = formData.get("price")?.toString().trim();
  const compareAtPriceStr = formData.get("compareAtPrice")?.toString().trim();
  const ratingStr = formData.get("rating")?.toString().trim();
  const reviewCountStr = formData.get("reviewCount")?.toString().trim();
  const badge = formData.get("badge")?.toString().trim() || null;
  const blurb = formData.get("blurb")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const featuresText = formData.get("features")?.toString().trim() || "";
  const specsText = formData.get("specs")?.toString().trim() || "";
  const isActive = formData.get("isActive") === "true";

  if (!name || !category || !priceStr || !blurb || !description) {
    return { success: false, error: "Please fill in all required fields." };
  }

  const price = parseInt(priceStr, 10);
  const compareAtPrice = compareAtPriceStr ? parseInt(compareAtPriceStr, 10) : null;
  const rating = ratingStr ? parseFloat(ratingStr) : 5.0;
  const reviewCount = reviewCountStr ? parseInt(reviewCountStr, 10) : 0;
  const newSlug = generateSlug(name);

  try {
    const pool = await getPool();

    // Get original slug
    const origProduct = await pool
      .request()
      .input("id", id)
      .query("SELECT Slug FROM dbo.Nomad_Products WHERE Id = @id");

    if (origProduct.recordset.length === 0) {
      return { success: false, error: "Product not found." };
    }
    const oldSlug = origProduct.recordset[0].Slug;

    // Check if new slug conflicts with another product
    const dupCheck = await pool
      .request()
      .input("slug", newSlug)
      .input("id", id)
      .query("SELECT Id FROM dbo.Nomad_Products WHERE Slug = @slug AND Id != @id");

    if (dupCheck.recordset.length > 0) {
      return { success: false, error: "Another product already uses this name." };
    }

    // Update main table
    await pool
      .request()
      .input("id", id)
      .input("slug", newSlug)
      .input("category", category)
      .input("name", name)
      .input("price", price)
      .input("compareAtPrice", compareAtPrice)
      .input("rating", rating)
      .input("reviewCount", reviewCount)
      .input("badge", badge)
      .input("blurb", blurb)
      .input("description", description)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        UPDATE dbo.Nomad_Products
        SET Slug = @slug, Category = @category, Name = @name, Price = @price,
            CompareAtPrice = @compareAtPrice, Rating = @rating, ReviewCount = @reviewCount,
            Badge = @badge, Blurb = @blurb, Description = @description, IsActive = @isActive,
            UpdatedAt = GETDATE()
        WHERE Id = @id
      `);

    // Reset and replace features
    await pool
      .request()
      .input("productId", id)
      .query("DELETE FROM dbo.Nomad_ProductFeatures WHERE ProductId = @productId");

    const features = featuresText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    for (let i = 0; i < features.length; i++) {
      await pool
        .request()
        .input("productId", id)
        .input("feature", features[i])
        .input("sortOrder", i)
        .query(`
          INSERT INTO dbo.Nomad_ProductFeatures (ProductId, Feature, SortOrder)
          VALUES (@productId, @feature, @sortOrder)
        `);
    }

    // Reset and replace specs
    await pool
      .request()
      .input("productId", id)
      .query("DELETE FROM dbo.Nomad_ProductSpecs WHERE ProductId = @productId");

    const specs = specsText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const parts = s.split(":");
        const label = parts[0]?.trim();
        const value = parts.slice(1).join(":")?.trim();
        return { label, value };
      })
      .filter((s) => s.label && s.value);

    for (let i = 0; i < specs.length; i++) {
      await pool
        .request()
        .input("productId", id)
        .input("label", specs[i].label)
        .input("value", specs[i].value)
        .input("sortOrder", i)
        .query(`
          INSERT INTO dbo.Nomad_ProductSpecs (ProductId, Label, Value, SortOrder)
          VALUES (@productId, @label, @value, @sortOrder)
        `);
    }

    // Cache Invalidation
    updateTag("products");
    updateTag("product-slugs");
    updateTag("dashboard-stats");
    updateTag(`product:${oldSlug}`);
    if (oldSlug !== newSlug) {
      updateTag(`product:${newSlug}`);
    }

    return { success: true };
  } catch (err: any) {
    console.error("Update Product Error:", err);
    return { success: false, error: err.message || "Failed to update product." };
  }
}

export async function deleteProduct(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();

    // Get original slug
    const origProduct = await pool
      .request()
      .input("id", id)
      .query("SELECT Slug FROM dbo.Nomad_Products WHERE Id = @id");

    if (origProduct.recordset.length === 0) {
      return { success: false, error: "Product not found." };
    }
    const slug = origProduct.recordset[0].Slug;

    // Delete features, specs, and product
    await pool.request().input("id", id).query(`
      DELETE FROM dbo.Nomad_ProductFeatures WHERE ProductId = @id;
      DELETE FROM dbo.Nomad_ProductSpecs WHERE ProductId = @id;
      DELETE FROM dbo.Nomad_Products WHERE Id = @id;
    `);

    // Cache Invalidation
    updateTag("products");
    updateTag("product-slugs");
    updateTag("dashboard-stats");
    updateTag(`product:${slug}`);

    return { success: true };
  } catch (err: any) {
    console.error("Delete Product Error:", err);
    return { success: false, error: err.message || "Failed to delete product." };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   FAQ CRUD ACTIONS
   ────────────────────────────────────────────────────────────────────────── */

export async function createFAQ(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const question = formData.get("question")?.toString().trim();
  const answer = formData.get("answer")?.toString().trim();
  const sortOrderStr = formData.get("sortOrder")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!question || !answer) {
    return { success: false, error: "Question and Answer are required." };
  }

  const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("question", question)
      .input("answer", answer)
      .input("sortOrder", sortOrder)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        INSERT INTO dbo.Nomad_FAQs (Question, Answer, SortOrder, IsActive)
        VALUES (@question, @answer, @sortOrder, @isActive)
      `);

    updateTag("faqs");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create FAQ." };
  }
}

export async function updateFAQ(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const question = formData.get("question")?.toString().trim();
  const answer = formData.get("answer")?.toString().trim();
  const sortOrderStr = formData.get("sortOrder")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!question || !answer) {
    return { success: false, error: "Question and Answer are required." };
  }

  const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .input("question", question)
      .input("answer", answer)
      .input("sortOrder", sortOrder)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        UPDATE dbo.Nomad_FAQs
        SET Question = @question, Answer = @answer, SortOrder = @sortOrder, IsActive = @isActive
        WHERE Id = @id
      `);

    updateTag("faqs");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update FAQ." };
  }
}

export async function deleteFAQ(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM dbo.Nomad_FAQs WHERE Id = @id");

    updateTag("faqs");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete FAQ." };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   TESTIMONIAL CRUD ACTIONS
   ────────────────────────────────────────────────────────────────────────── */

export async function createTestimonial(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const role = formData.get("role")?.toString().trim();
  const quote = formData.get("quote")?.toString().trim();
  const ratingStr = formData.get("rating")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!name || !role || !quote) {
    return { success: false, error: "All fields are required." };
  }

  const rating = ratingStr ? parseInt(ratingStr, 10) : 5;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("name", name)
      .input("role", role)
      .input("quote", quote)
      .input("rating", rating)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        INSERT INTO dbo.Nomad_Testimonials (Name, Role, Quote, Rating, IsActive)
        VALUES (@name, @role, @quote, @rating, @isActive)
      `);

    updateTag("testimonials");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create testimonial." };
  }
}

export async function updateTestimonial(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const role = formData.get("role")?.toString().trim();
  const quote = formData.get("quote")?.toString().trim();
  const ratingStr = formData.get("rating")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!name || !role || !quote) {
    return { success: false, error: "All fields are required." };
  }

  const rating = ratingStr ? parseInt(ratingStr, 10) : 5;

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .input("name", name)
      .input("role", role)
      .input("quote", quote)
      .input("rating", rating)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        UPDATE dbo.Nomad_Testimonials
        SET Name = @name, Role = @role, Quote = @quote, Rating = @rating, IsActive = @isActive
        WHERE Id = @id
      `);

    updateTag("testimonials");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update testimonial." };
  }
}

export async function deleteTestimonial(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM dbo.Nomad_Testimonials WHERE Id = @id");

    updateTag("testimonials");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete testimonial." };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   CONTACT SUBMISSION MANAGEMENT
   ────────────────────────────────────────────────────────────────────────── */

export async function markContactRead(id: number, isRead: boolean): Promise<ActionState> {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .input("isRead", isRead ? 1 : 0)
      .query("UPDATE dbo.Nomad_ContactSubmissions SET IsRead = @isRead WHERE Id = @id");

    updateTag("contacts");
    updateTag("dashboard-stats");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to mark contact as read." };
  }
}

export async function deleteContact(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM dbo.Nomad_ContactSubmissions WHERE Id = @id");

    updateTag("contacts");
    updateTag("dashboard-stats");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete contact submission." };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   NEWSLETTER SUBSCRIBER MANAGEMENT
   ────────────────────────────────────────────────────────────────────────── */

export async function deleteSubscriber(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();
    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM dbo.Nomad_NewsletterSubscribers WHERE Id = @id");

    updateTag("newsletter");
    updateTag("dashboard-stats");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete subscriber." };
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   SITE SETTINGS MANAGEMENT
   ────────────────────────────────────────────────────────────────────────── */

export async function updateSiteSettingAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const type = formData.get("type")?.toString(); // "contactInfo" or "aboutStats"
  
  if (type === "contactInfo") {
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim();
    const address = formData.get("address")?.toString().trim();
    const hours = formData.get("hours")?.toString().trim();

    if (!email || !phone || !address || !hours) {
      return { success: false, error: "All contact fields are required." };
    }

    const contactVal = JSON.stringify({ email, phone, address, hours });

    try {
      const pool = await getPool();
      await pool
        .request()
        .input("key", "contactInfo")
        .input("val", contactVal)
        .query(`
          IF EXISTS (SELECT * FROM dbo.Nomad_SiteSettings WHERE SettingKey = @key)
            UPDATE dbo.Nomad_SiteSettings SET SettingValue = @val, UpdatedAt = GETDATE() WHERE SettingKey = @key
          ELSE
            INSERT INTO dbo.Nomad_SiteSettings (SettingKey, SettingValue) VALUES (@key, @val)
        `);

      updateTag("site-settings");
      updateTag("setting:contactInfo");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update contact settings." };
    }
  }

  if (type === "aboutStats") {
    const labels = formData.getAll("label").map((l) => l.toString().trim());
    const values = formData.getAll("value").map((v) => v.toString().trim());

    const stats = [];
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] && values[i]) {
        stats.push({ label: labels[i], value: values[i] });
      }
    }

    if (stats.length === 0) {
      return { success: false, error: "At least one stat entry is required." };
    }

    const statsVal = JSON.stringify(stats);

    try {
      const pool = await getPool();
      await pool
        .request()
        .input("key", "aboutStats")
        .input("val", statsVal)
        .query(`
          IF EXISTS (SELECT * FROM dbo.Nomad_SiteSettings WHERE SettingKey = @key)
            UPDATE dbo.Nomad_SiteSettings SET SettingValue = @val, UpdatedAt = GETDATE() WHERE SettingKey = @key
          ELSE
            INSERT INTO dbo.Nomad_SiteSettings (SettingKey, SettingValue) VALUES (@key, @val)
        `);

      updateTag("site-settings");
      updateTag("setting:aboutStats");
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to update site statistics." };
    }
  }

  return { success: false, error: "Invalid settings type." };
}

/* ──────────────────────────────────────────────────────────────────────────
   CATEGORY CRUD ACTIONS
   ────────────────────────────────────────────────────────────────────────── */

export async function createCategory(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim() || (name ? generateSlug(name) : "");
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrderStr = formData.get("sortOrder")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!name || !slug) {
    return { success: false, error: "Category Name and Slug are required." };
  }

  const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

  try {
    const pool = await getPool();

    // Check duplicate slug
    const dupCheck = await pool
      .request()
      .input("slug", slug)
      .query("SELECT Id FROM dbo.Nomad_Categories WHERE Slug = @slug");

    if (dupCheck.recordset.length > 0) {
      return { success: false, error: "A category with this slug already exists." };
    }

    await pool
      .request()
      .input("slug", slug)
      .input("name", name)
      .input("description", description)
      .input("sortOrder", sortOrder)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        INSERT INTO dbo.Nomad_Categories (Slug, Name, Description, SortOrder, IsActive)
        VALUES (@slug, @name, @description, @sortOrder, @isActive)
      `);

    updateTag("categories");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create category." };
  }
}

export async function updateCategory(
  id: number,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim() || (name ? generateSlug(name) : "");
  const description = formData.get("description")?.toString().trim() || null;
  const sortOrderStr = formData.get("sortOrder")?.toString().trim();
  const isActive = formData.get("isActive") === "true";

  if (!name || !slug) {
    return { success: false, error: "Category Name and Slug are required." };
  }

  const sortOrder = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

  try {
    const pool = await getPool();

    // Check duplicate slug
    const dupCheck = await pool
      .request()
      .input("slug", slug)
      .input("id", id)
      .query("SELECT Id FROM dbo.Nomad_Categories WHERE Slug = @slug AND Id != @id");

    if (dupCheck.recordset.length > 0) {
      return { success: false, error: "Another category already uses this slug." };
    }

    await pool
      .request()
      .input("id", id)
      .input("slug", slug)
      .input("name", name)
      .input("description", description)
      .input("sortOrder", sortOrder)
      .input("isActive", isActive ? 1 : 0)
      .query(`
        UPDATE dbo.Nomad_Categories
        SET Slug = @slug, Name = @name, Description = @description, SortOrder = @sortOrder, IsActive = @isActive
        WHERE Id = @id
      `);

    updateTag("categories");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update category." };
  }
}

export async function deleteCategory(id: number): Promise<ActionState> {
  try {
    const pool = await getPool();

    // Prevent deletion if category is assigned to products
    const catCheck = await pool
      .request()
      .input("id", id)
      .query(`
        SELECT COUNT(*) AS cnt 
        FROM dbo.Nomad_Products p
        INNER JOIN dbo.Nomad_Categories c ON p.Category = c.Slug
        WHERE c.Id = @id
      `);

    if (catCheck.recordset[0].cnt > 0) {
      return {
        success: false,
        error: `Cannot delete category because it is currently assigned to ${catCheck.recordset[0].cnt} products. Reassign or delete those products first.`,
      };
    }

    await pool
      .request()
      .input("id", id)
      .query("DELETE FROM dbo.Nomad_Categories WHERE Id = @id");

    updateTag("categories");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete category." };
  }
}
