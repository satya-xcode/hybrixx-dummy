import { cacheLife, cacheTag } from "next/cache";
import { getPool } from "@/lib/db";

/**
 * Fetch site settings from the database.
 * Cached with max lifetime — settings almost never change.
 */

export async function getSiteSetting<T>(key: string): Promise<T | null> {
  "use cache";
  cacheLife("max");
  cacheTag("site-settings", `setting:${key}`);

  const pool = await getPool();
  const result = await pool
    .request()
    .input("key", key)
    .query(
      "SELECT SettingValue FROM dbo.Nomad_SiteSettings WHERE SettingKey = @key"
    );

  if (result.recordset.length === 0) return null;

  return JSON.parse(result.recordset[0].SettingValue) as T;
}

export type ContactInfo = {
  email: string;
  phone: string;
  address: string;
  hours: string;
};

export type AboutStat = {
  label: string;
  value: string;
};

export async function getContactInfo(): Promise<ContactInfo> {
  "use cache";
  cacheLife("max");
  cacheTag("site-settings", "setting:contactInfo");

  const info = await getSiteSetting<ContactInfo>("contactInfo");
  return (
    info ?? {
      email: "hello@nomad-gear.example",
      phone: "+91 98765 43210",
      address: "Sector 62, Noida, Uttar Pradesh, India",
      hours: "Mon–Sat, 10am–6pm IST",
    }
  );
}

export async function getAboutStats(): Promise<AboutStat[]> {
  "use cache";
  cacheLife("max");
  cacheTag("site-settings", "setting:aboutStats");

  const stats = await getSiteSetting<AboutStat[]>("aboutStats");
  return (
    stats ?? [
      { label: "Orders shipped", value: "500+" },
      { label: "Average rating", value: "4.8★" },
      { label: "Warranty", value: "1 year" },
      { label: "Dispatch time", value: "2 days" },
    ]
  );
}
