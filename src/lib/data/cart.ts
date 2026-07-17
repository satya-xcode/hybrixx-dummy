import { getPool } from "@/lib/db";
import type { CartItem } from "@/lib/types";

/**
 * Cart data — NOT cached (request-time, user-specific).
 * Wrapped in <Suspense> in components for PPR streaming.
 */

/**
 * Get or create a cart session by its UUID (stored in cookie).
 * Returns the internal session row ID.
 */
export async function getOrCreateCartSession(
  sessionUuid: string
): Promise<number> {
  const pool = await getPool();

  // Try to find existing
  const existing = await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(
      "SELECT Id FROM dbo.Nomad_CartSessions WHERE SessionId = @sessionId"
    );

  if (existing.recordset.length > 0) {
    return existing.recordset[0].Id;
  }

  // Create new
  const result = await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      INSERT INTO dbo.Nomad_CartSessions (SessionId)
      OUTPUT INSERTED.Id
      VALUES (@sessionId)
    `);

  return result.recordset[0].Id;
}

/**
 * Get all cart items for a session, joined with product data.
 */
export async function getCartItems(
  sessionUuid: string
): Promise<CartItem[]> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      SELECT
        ci.Id, ci.SessionId, ci.ProductId, ci.Quantity, ci.AddedAt,
        p.Name AS ProductName, p.Slug AS ProductSlug,
        p.Price AS ProductPrice, p.Category AS ProductCategory,
        p.Badge AS ProductBadge, p.Blurb AS ProductBlurb
      FROM dbo.Nomad_CartItems ci
      INNER JOIN dbo.Nomad_CartSessions cs ON cs.Id = ci.SessionId
      INNER JOIN dbo.Nomad_Products p ON p.Id = ci.ProductId
      WHERE cs.SessionId = @sessionId
      ORDER BY ci.AddedAt DESC
    `);

  return result.recordset.map(
    (row: {
      Id: number;
      SessionId: number;
      ProductId: number;
      Quantity: number;
      AddedAt: Date;
      ProductName: string;
      ProductSlug: string;
      ProductPrice: number;
      ProductCategory: string;
      ProductBadge: string | null;
      ProductBlurb: string;
    }) => ({
      id: row.Id,
      sessionId: row.SessionId,
      productId: row.ProductId,
      quantity: row.Quantity,
      addedAt: row.AddedAt,
      productName: row.ProductName,
      productSlug: row.ProductSlug,
      productPrice: row.ProductPrice,
      productCategory: row.ProductCategory as CartItem["productCategory"],
      productBadge: row.ProductBadge,
      productBlurb: row.ProductBlurb,
    })
  );
}

/**
 * Get total cart item count for a session (for badge display).
 */
export async function getCartCount(sessionUuid: string): Promise<number> {
  const pool = await getPool();

  const result = await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      SELECT COALESCE(SUM(ci.Quantity), 0) AS TotalCount
      FROM dbo.Nomad_CartItems ci
      INNER JOIN dbo.Nomad_CartSessions cs ON cs.Id = ci.SessionId
      WHERE cs.SessionId = @sessionId
    `);

  return result.recordset[0].TotalCount;
}

export type Coupon = {
  id: number;
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  isActive: boolean;
  createdAt: Date;
};

/**
 * Fetch a coupon by its code from the database.
 */
export async function getCouponByCode(code: string): Promise<Coupon | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("code", code)
    .query(`
      SELECT Id, Code, DiscountType, DiscountValue, IsActive, CreatedAt
      FROM dbo.Nomad_Coupons
      WHERE Code = @code
    `);

  if (result.recordset.length === 0) return null;
  const row = result.recordset[0];
  return {
    id: row.Id,
    code: row.Code,
    discountType: row.DiscountType as Coupon["discountType"],
    discountValue: row.DiscountValue,
    isActive: row.IsActive,
    createdAt: row.CreatedAt,
  };
}

/**
 * Fetch the currently applied coupon for a cart session.
 */
export async function getAppliedCouponForSession(
  sessionUuid: string
): Promise<Coupon | null> {
  const pool = await getPool();
  const sessionResult = await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      SELECT AppliedCouponCode
      FROM dbo.Nomad_CartSessions
      WHERE SessionId = @sessionId
    `);

  if (sessionResult.recordset.length === 0) return null;
  const couponCode = sessionResult.recordset[0].AppliedCouponCode;
  if (!couponCode) return null;

  return getCouponByCode(couponCode);
}

/**
 * Associate a coupon code with a cart session.
 */
export async function applyCouponToSession(
  sessionUuid: string,
  code: string
): Promise<{ success: boolean; error?: string }> {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { success: false, error: "Coupon does not exist." };
  }
  if (!coupon.isActive) {
    return { success: false, error: "Coupon is inactive/expired." };
  }

  const pool = await getPool();
  // Ensure session exists
  await getOrCreateCartSession(sessionUuid);

  await pool
    .request()
    .input("sessionId", sessionUuid)
    .input("code", code)
    .query(`
      UPDATE dbo.Nomad_CartSessions
      SET AppliedCouponCode = @code, UpdatedAt = GETDATE()
      WHERE SessionId = @sessionId
    `);

  return { success: true };
}

/**
 * Remove any coupon associated with a cart session.
 */
export async function removeCouponFromSession(
  sessionUuid: string
): Promise<{ success: boolean }> {
  const pool = await getPool();
  await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      UPDATE dbo.Nomad_CartSessions
      SET AppliedCouponCode = NULL, UpdatedAt = GETDATE()
      WHERE SessionId = @sessionId
    `);

  return { success: true };
}
