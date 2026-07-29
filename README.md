# Mal — Pakistan Waitlist

Landing page + signup flow to gauge interest in Mal (lending product) before launching in Pakistan. One Next.js repo, frontend and backend together, deployed on Vercel with Supabase as the database.

Live: https://mal.azmisal.in

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind v4 (no config file — theme lives in `globals.css` via `@theme`)
- Zod for validation, shared between the client form and the API route
- Supabase (Postgres) for storage

Went with Next.js mainly for the SEO requirement — SSR/static generation means the title, meta tags, and JSON-LD are actually in the HTML crawlers see, not injected client-side after the fact. Also meant the API route could live in the same repo without spinning up a second Express server.

## Getting started

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev
```

Runs on http://localhost:3000.

## Environment variables

| Variable | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase → Project Overview → Copy the Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → Legacy anon, service_role API keys(Tab) → Copy the secret, **secret**. Server-only — do not add a `NEXT_PUBLIC_` prefix to this or it ends up in the browser bundle |
| `NEXT_PUBLIC_SITE_URL` | Your deployed URL. Used for canonical tags, OG tags, and sitemap generation |

## Database

Schema lives in `supabase/migrations/0001_init.sql`. To set it up on a fresh Supabase project, paste that file into the SQL Editor and run it, or use the Supabase CLI (`supabase db push`) if you've got a project linked.

What it enforces, briefly:

- `waitlist_signups` table with typed enums for `referral_source` and `market` (not free-text)
- Exactly one of `email` / `phone` must be set — checked at the DB level, not just in the form
- Case-insensitive dedup on email per market, and a separate unique index on phone per market, so the same person can't sign up twice for the same market
- RLS is on with **zero policies** — the table is completely closed off from the `anon` key. All writes go through `/api/waitlist` using the service role key server-side. The browser never talks to Supabase directly.

## API

`POST /api/waitlist` — validates with the shared Zod schema, inserts into Supabase, and returns:

- `201` on success
- `400` if the JSON body is malformed or fails validation (with field-level errors)
- `409` if it's a duplicate signup for that market
- `500` on an actual DB failure (logged server-side)

No silent failures — every path returns something the form can show the user.

## Deploy

Deployed on Vercel. Set the three env vars above in the project settings, deploy `main`, then go back and set `NEXT_PUBLIC_SITE_URL` to the real production domain and redeploy once so the metadata/sitemap reflect it correctly (chicken-and-egg problem with the first deploy).

Running on a dedicated subdomain (`mal.azmisal.in`) rather than the root domain or a shared path, per the brief's requirement that this be independent of any main app — separate deploy, separate `NEXT_PUBLIC_SITE_URL`, nothing shared with anything else that might live on the root domain later.

Lighthouse (via PageSpeed Insights, not local Chrome — browser extensions badly skew local runs): 98 Performance / 100 Accessibility / 100 Best Practices / 100 SEO.

## What I'd do next with 2 more hours

* Add automated tests for the validation schema and `/api/waitlist` route, especially duplicate signups and invalid contact details.
* Add analytics and UTM/referral tracking to measure which acquisition channels drive the most signups.
* Add rate limiting and basic bot protection to prevent spam/abuse on the public signup endpoint.
* Improve the landing page copy and run a small A/B test on the headline and CTA to improve conversion.

## Branching

`main` ← `staging` ← `dev` ← `feat/*`.