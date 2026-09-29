# Strata

Marketing website for **Strata**, an AI-powered marketing agency. Built with the
Next.js App Router and a Supabase backend for the contact and feedback forms and
the public reviews wall.

> **Content honesty:** this is a brand-new agency, so the site ships with **no
> fabricated clients, testimonials, projects, or performance results.** Sections
> that would normally hold social proof (reviews wall, metrics) use honest empty
> states or capability facts until real, consented client data exists. Keep it
> that way.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS v4** — design tokens live in `app/globals.css` via `@theme`
- **framer-motion** for animation; **three / @react-three/fiber** for the 3D
  constellation in the "how we think" section
- **Supabase** (Postgres + RLS) for inquiries, review submissions, and the
  public reviews feed
- **Vitest** + Testing Library for component tests

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:3000.

### Environment variables

Create `.env.local` with the project's Supabase credentials (both are safe to
expose to the browser — the anon/publishable key is protected by row-level
security):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<publishable-key>
```

Without these the forms surface an honest error state instead of silently
dropping submissions. The Content-Security-Policy `connect-src` is derived from
`NEXT_PUBLIC_SUPABASE_URL` at build time (see `next.config.ts`), so set it before
building.

## Scripts

| Script            | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the dev server (Turbopack)         |
| `npm run build`   | Production build                         |
| `npm run start`   | Serve the production build               |
| `npm run lint`    | ESLint                                   |
| `npm run test`    | Vitest (watch)                           |
| `npm run test:run`| Vitest (single run, used in CI)          |

## Project layout

- `app/` — routes, layout, and error boundaries (`error.tsx`, `global-error.tsx`)
- `components/` — page sections and UI primitives (`components/ui/`)
- `components/3d/` — the three.js constellation and its SVG fallback
- `lib/` — data (`data.ts`), form validation, and the Supabase client
- `supabase/functions/` — Deno edge function for inquiry email alerts (excluded
  from the Next TypeScript build)

## Backend

The database schema, row-level security policies, and the `notify-inquiry` edge
function are managed in Supabase. Only approved, consented reviews are readable
by the anon role, and inquiry rows are insert-only from the client — see the
comments in `components/contact.tsx` and `components/reviews-wall.tsx`.

## Deployment

Deploy on [Vercel](https://vercel.com/new). Set the two `NEXT_PUBLIC_SUPABASE_*`
environment variables in the project settings before the first build, and
redeploy after changing them. CI (`.github/workflows/ci.yml`) runs lint, tests,
and a production build on every push and pull request to `main`.

## Before publishing

- [ ] Replace the placeholder business details in `lib/data.ts` (`SITE`: email,
      phone, location, social links, URL) with real values.
- [ ] Set the Supabase env vars on the host.
- [ ] Configure the `notify-inquiry` edge function secrets to enable inquiry
      email alerts.
