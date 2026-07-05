# Nomad — D2C Demo Storefront

A dummy D2C storefront built to demonstrate a **reusable, single-source-of-truth**
component architecture with **Lenis** smooth scroll + **Motion** scroll-reveal
animations, on **Next.js 16 (App Router) + React 19 + Tailwind CSS v4 + TypeScript
strict + shadcn/ui-style components**, exported as a **fully static site**.

---

## Quick start

```bash
npm install
npm run dev       # http://localhost:3000
```

```bash
npm run build     # generates a static `out/` folder (deploy anywhere)
```

> Note: `next/font/google` needs internet access at build time (fetches Geist
> from Google Fonts once, then self-hosts it). This is normal — Next.js
> downloads and self-serves the font; your production site makes zero
> requests to Google at runtime.

---

## Why this setup

**`create-next-app` first, `shadcn init` second** — not `shadcn init -t next`.
`create-next-app` is maintained directly by Vercel and always tracks the
current Next.js release's official flags (Turbopack, App Router, `src/`
directory, TS strict, import alias). Running it explicitly gives full control
over every flag instead of accepting a bundled scaffold's defaults. `shadcn
init` then detects the existing project and layers itself on top — best of
both.

This project was scaffolded with:
```bash
npx create-next-app@latest my-app --typescript --tailwind --eslint --app \
  --src-dir --import-alias "@/*" --use-npm --turbopack
cd my-app
npx shadcn@latest init -d
npx shadcn@latest add button card badge
npm install motion lenis
```

---

## Architecture — single source of truth

```
src/
├── app/
│   ├── globals.css        <- ALL design tokens live here (colors, type, spacing, motion)
│   ├── layout.tsx         <- fonts + SmoothScrollProvider wrap the whole app
│   └── page.tsx            <- homepage = composition of section components
│
├── config/
│   └── site.ts             <- nav links, product data, testimonials: edit data here, not JSX
│
├── components/
│   ├── ui/                 <- shadcn-style primitives (Button, Card, Badge, Typography)
│   ├── layout/
│   │   └── primitives.tsx  <- Container / Section / Stack / Flex / Grid: ALL spacing goes through these
│   ├── motion/
│   │   └── scroll-reveal.tsx  <- the ONE place scroll-in animation timing/easing is defined
│   ├── providers/
│   │   └── smooth-scroll-provider.tsx  <- Lenis config lives here, nowhere else
│   └── sections/            <- page sections (Navbar, Hero, ProductGrid, ...): compose primitives, never raw divs
```

### Why this matters
- Change a color once -> edit `globals.css`, every button/card/badge updates.
- Change scroll-reveal feel once -> edit `scroll-reveal.tsx`, every section updates.
- Change Lenis smoothness once -> edit `smooth-scroll-provider.tsx`, whole site updates.
- Add a product -> edit `config/site.ts`, no JSX touched.
- Sections never hardcode `px-4 py-12 max-w-7xl` etc. They use `<Container>` /
  `<Section>` / `<Stack>` so resizing the whole site's rhythm is a two-file
  change, not a find-and-replace across 20 components.

---

## Color system (D2C rationale)

| Token | Value | Use |
|---|---|---|
| `--background` | warm off-white `#FAF8F5` | page background, softer than pure white |
| `--foreground` | warm near-black `#16130F` | body text, easier on the eyes than `#000` |
| `--primary` | coral `#FF5A3C` | CTAs, links: energetic without feeling alarmist like pure red |
| `--accent` | forest green `#1F7A5C` | trust badges, stock/success states |
| `--warning` | muted gold `#D4A017` | star ratings |

Swap only these hex values in `globals.css` to re-skin the entire storefront,
no component has a hardcoded color.

Fluid typography (`--text-hero` through `--text-h3`) uses `clamp()` so
headings scale smoothly across breakpoints without manual `sm:`/`lg:`
font-size overrides.

---

## Scroll animation stack

- **Lenis** (`lenis/react`, `root` mode): smooth momentum scroll on the native
  document. Doesn't break `position: sticky` (the navbar) or
  `IntersectionObserver` (Motion's `whileInView`).
- **Motion** (`motion/react`): `<ScrollReveal>` / `<ScrollRevealItem>` wrap
  section content and fade/slide it in once, on scroll, with a single shared
  easing curve (`--ease-liquid`).

To add a new animated section: wrap it in `<ScrollReveal>` (or `<ScrollReveal
stagger>` with `<ScrollRevealItem>` children for a staggered grid). No new
animation code needed.

---

## Static export notes

`next.config.ts` sets `output: "export"`. This means:
- No Server Actions or `app/api/*` routes.
- `next/image` runs `unoptimized`: pre-optimize images at build time for a
  real catalog, or swap in a CDN image service.
- Every page must be resolvable at build time (no `force-dynamic`, no
  uncached `fetch` in Server Components).

Deploy the generated `out/` folder to any static host: Nginx, S3 +
CloudFront, Cloudflare Pages, GitHub Pages, or Vercel's static hosting.
