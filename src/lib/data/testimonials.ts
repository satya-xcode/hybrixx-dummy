import { cacheLife, cacheTag } from "next/cache";
import { getPool } from "@/lib/db";
import type { Testimonial } from "@/lib/types";

/**
 * Fetch all active testimonials.
 * Cached for 1 day — testimonials rarely change.
 */
export async function getTestimonials(): Promise<Testimonial[]> {
  "use cache";
  cacheLife("days");
  cacheTag("testimonials");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Name, Role, Quote, Rating, IsActive
    FROM dbo.Nomad_Testimonials
    WHERE IsActive = 1
    ORDER BY Id
  `);

  return result.recordset.map(
    (row: {
      Id: number;
      Name: string;
      Role: string;
      Quote: string;
      Rating: number;
      IsActive: boolean;
    }) => ({
      id: row.Id,
      name: row.Name,
      role: row.Role,
      quote: row.Quote,
      rating: row.Rating,
      isActive: row.IsActive,
    })
  );
}
