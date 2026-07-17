"use server";

import { updateTag } from "next/cache";
import { getPool, sql } from "@/lib/db";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

/**
 * Submit a contact form message to the database.
 */
export async function submitContact(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const message = formData.get("message")?.toString().trim();

  // Validate
  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const pool = await getPool();
    await pool
      .request()
      .input("name", sql.NVarChar, name)
      .input("email", sql.NVarChar, email)
      .input("message", sql.NVarChar, message)
      .query(`
        INSERT INTO dbo.Nomad_ContactSubmissions (Name, Email, Message)
        VALUES (@name, @email, @message)
      `);

    // Invalidate dashboard cache immediately
    updateTag("contacts");
    updateTag("dashboard-stats");

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    };
  }
}
