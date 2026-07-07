import { cacheLife, cacheTag } from "next/cache";
import { getPool } from "@/lib/db";
import type { FAQ } from "@/lib/types";

/**
 * Fetch all active FAQs, ordered by SortOrder.
 * Cached for 1 day — FAQs rarely change.
 */
export async function getFAQs(): Promise<FAQ[]> {
  "use cache";
  cacheLife("days");
  cacheTag("faqs");

  const pool = await getPool();
  const result = await pool.request().query(`
    SELECT Id, Question, Answer, SortOrder, IsActive
    FROM dbo.Nomad_FAQs
    WHERE IsActive = 1
    ORDER BY SortOrder
  `);

  return result.recordset.map(
    (row: {
      Id: number;
      Question: string;
      Answer: string;
      SortOrder: number;
      IsActive: boolean;
    }) => ({
      id: row.Id,
      question: row.Question,
      answer: row.Answer,
      sortOrder: row.SortOrder,
      isActive: row.IsActive,
    })
  );
}
