"use server";

import { cookies } from "next/headers";
import { updateTag } from "next/cache";
import { getPool } from "@/lib/db";
import { getOrCreateCartSession } from "@/lib/data/cart";

/**
 * Get the cart session UUID from cookie, or generate a new one.
 */
async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("cart_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
  }

  return sessionId;
}

/**
 * Add a product to the cart. If it already exists, increment quantity.
 */
export async function addToCart(productId: number) {
  const sessionUuid = await getSessionId();
  const sessionRowId = await getOrCreateCartSession(sessionUuid);
  const pool = await getPool();

  // Check if product already in cart
  const existing = await pool
    .request()
    .input("sessionId", sessionRowId)
    .input("productId", productId)
    .query(`
      SELECT Id, Quantity FROM dbo.Nomad_CartItems
      WHERE SessionId = @sessionId AND ProductId = @productId
    `);

  if (existing.recordset.length > 0) {
    // Increment quantity
    await pool
      .request()
      .input("id", existing.recordset[0].Id)
      .input("qty", existing.recordset[0].Quantity + 1)
      .query("UPDATE dbo.Nomad_CartItems SET Quantity = @qty WHERE Id = @id");
  } else {
    // Insert new item
    await pool
      .request()
      .input("sessionId", sessionRowId)
      .input("productId", productId)
      .query(`
        INSERT INTO dbo.Nomad_CartItems (SessionId, ProductId, Quantity)
        VALUES (@sessionId, @productId, 1)
      `);
  }

  // Update session timestamp
  await pool
    .request()
    .input("id", sessionRowId)
    .query(
      "UPDATE dbo.Nomad_CartSessions SET UpdatedAt = GETDATE() WHERE Id = @id"
    );
}

/**
 * Update the quantity of a cart item.
 */
export async function updateCartQuantity(itemId: number, quantity: number) {
  const pool = await getPool();

  if (quantity <= 0) {
    await pool
      .request()
      .input("id", itemId)
      .query("DELETE FROM dbo.Nomad_CartItems WHERE Id = @id");
  } else {
    await pool
      .request()
      .input("id", itemId)
      .input("qty", quantity)
      .query(
        "UPDATE dbo.Nomad_CartItems SET Quantity = @qty WHERE Id = @id"
      );
  }
}

/**
 * Remove an item from the cart.
 */
export async function removeFromCart(itemId: number) {
  const pool = await getPool();
  await pool
    .request()
    .input("id", itemId)
    .query("DELETE FROM dbo.Nomad_CartItems WHERE Id = @id");
}

/**
 * Clear the entire cart for the current session.
 */
export async function clearCart() {
  const sessionUuid = await getSessionId();
  const pool = await getPool();

  await pool
    .request()
    .input("sessionId", sessionUuid)
    .query(`
      DELETE ci FROM dbo.Nomad_CartItems ci
      INNER JOIN dbo.Nomad_CartSessions cs ON cs.Id = ci.SessionId
      WHERE cs.SessionId = @sessionId
    `);
}
