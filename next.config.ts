import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * DYNAMIC SERVER — Node.js server required.
   * Removed `output: "export"` to enable:
   * - Server Actions (cart, contact, newsletter mutations)
   * - MSSQL database access from Server Components
   * - Cache Components (PPR + `"use cache"` directive)
   * - `next/image` optimization API
   */
  cacheComponents: true,
};

export default nextConfig;
