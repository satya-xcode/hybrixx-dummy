"use server";

import { getPool, sql } from "@/lib/db";

export type NewsletterState = {
  success: boolean;
  error?: string;
  message?: string;
};

/**
 * Subscribe an email to the newsletter.
 * UPSERT — if already subscribed, returns success with a message.
 */
export async function subscribe(
  _prevState: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const email = formData.get("email")?.toString().trim();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const pool = await getPool();

    // Check if already subscribed
    const existing = await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(
        "SELECT Id FROM dbo.Nomad_NewsletterSubscribers WHERE Email = @email"
      );

    if (existing.recordset.length > 0) {
      return {
        success: true,
        message: "You're already subscribed! 🎉",
      };
    }

    await pool
      .request()
      .input("email", sql.NVarChar, email)
      .query(`
        INSERT INTO dbo.Nomad_NewsletterSubscribers (Email)
        VALUES (@email)
      `);

    return {
      success: true,
      message: "Welcome aboard! Check your inbox for 10% off. 🎉",
    };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
