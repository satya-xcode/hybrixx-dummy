import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * STATIC EXPORT — produces a pure static `out/` folder (HTML/CSS/JS only).
   * Deployable to any static host (Nginx, S3, Cloudflare Pages, Vercel static).
   *
   * Constraints this imposes (by design, since the site is 100% static):
   * - No Server Actions, no dynamic API routes (`app/api/*` won't work).
   * - `next/image` optimization API is disabled → `images.unoptimized: true`
   *   below serves images as-is. For a real product catalog, pre-optimize
   *   images at build time or serve them via a CDN/image service instead.
   * - Every route must be statically resolvable at build time
   *   (no `dynamic = "force-dynamic"`, no uncached `fetch` inside RSCs).
   */
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
