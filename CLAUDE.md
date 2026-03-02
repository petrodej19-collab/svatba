# CLAUDE.md — Bor & Sara Wedding Website

## Project Overview

A private wedding website for Bor and Sara. The site serves as an informational hub for wedding guests and includes interactive features like song requests and a visual seating chart. The entire site is gated behind a shared guest password so only invited people can access it. Bor and Sara have a separate admin login to manage seating arrangements.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database & Auth:** Supabase (Postgres DB + Row Level Security + Supabase Auth for admin)
- **Supabase client:** `@supabase/supabase-js` and `@supabase/ssr` for server-side usage in Next.js
- **Guest gate:** A shared password stored in an env var (`GUEST_PASSWORD`), verified via API route and stored in an HTTP-only cookie. Middleware enforces the gate on all pages except `/gate`.
- **Admin auth:** Supabase Auth with email/password. A single admin account for Bor & Sara. Protected via middleware checking Supabase session on `/admin/*` routes.
- **Deployment target:** Vercel

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=         # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Supabase anon/public key
SUPABASE_SERVICE_ROLE_KEY=        # Supabase service role key (server-side only, never expose to client)
GUEST_PASSWORD=                   # Shared password guests enter to access the site
```

## Database Schema (Supabase / Postgres)

```sql
-- Tables at the wedding (not DB tables)
CREATE TABLE wedding_tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,                    -- e.g. "Table 1", "Head Table"
  seat_count INT NOT NULL DEFAULT 8,
  position_x FLOAT NOT NULL DEFAULT 0,  -- x position on the floor plan (percentage 0-100)
  position_y FLOAT NOT NULL DEFAULT 0,  -- y position on the floor plan (percentage 0-100)
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Guests assigned to tables
CREATE TABLE guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID REFERENCES wedding_tables(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  seat_index INT,                        -- optional: specific seat position at the table
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Song requests from guests
CREATE TABLE song_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  song_title TEXT NOT NULL,
  artist TEXT,
  requested_by TEXT,                     -- guest name (optional, free text)
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

- **wedding_tables:** SELECT for anon (read-only for guests). ALL for authenticated (admin).
- **guests:** SELECT for anon. ALL for authenticated.
- **song_requests:** SELECT and INSERT for anon (guests can view and add). ALL for authenticated (admin can delete).

## Project Structure

```
/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — fonts, metadata, Navbar
│   │   ├── page.tsx                # Landing / hero page — wedding date, names, welcome
│   │   ├── gate/
│   │   │   └── page.tsx            # Password gate (first thing guests see)
│   │   ├── info/
│   │   │   └── page.tsx            # Event details — when, where, directions, schedule
│   │   ├── songs/
│   │   │   └── page.tsx            # Song request form + list of requested songs
│   │   ├── seating/
│   │   │   └── page.tsx            # Public seating chart viewer (read-only)
│   │   ├── admin/
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Admin login (Supabase Auth email/password)
│   │   │   └── seating/
│   │   │       └── page.tsx        # Admin seating editor (CRUD tables, assign guests)
│   │   └── api/
│   │       └── gate/
│   │           └── route.ts        # POST: verify guest password, set cookie
│   ├── components/
│   │   ├── Navbar.tsx              # Navigation bar (shown after gate)
│   │   ├── FloorPlan.tsx           # Visual floor plan with draggable tables (admin) / static (public)
│   │   ├── TableCard.tsx           # Single table circle/shape showing guest names
│   │   ├── SongForm.tsx            # Form to submit a song request
│   │   ├── SongList.tsx            # List of all requested songs
│   │   ├── GuestPasswordForm.tsx   # The gate form
│   │   └── AdminLoginForm.tsx      # Admin login form
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client (anon key)
│   │   │   ├── server.ts           # Server-side Supabase client (service role for admin ops)
│   │   │   └── middleware.ts       # Supabase auth helpers for middleware
│   │   └── constants.ts            # Shared constants (route paths, etc.)
│   ├── middleware.ts               # Enforce guest gate + admin auth
│   └── types/
│       └── index.ts                # TypeScript types for DB models
├── public/
│   └── images/                     # Hero photos, decorative assets (to be added)
├── supabase/
│   └── migrations/                 # SQL migration files for the schema above
├── .env.local
├── tailwind.config.ts
├── next.config.js
├── package.json
├── CLAUDE.md
└── tickets.md
```

## Design Direction

- **Mood:** Elegant, warm, celebratory — not corporate. Think soft creams, sage greens or dusty rose, muted gold accents.
- **Typography:** A refined serif for headings (e.g., Playfair Display from Google Fonts) and a clean sans-serif for body text (e.g., Inter).
- **Layout:** Mobile-first. Most guests will open this on their phone.
- **Animations:** Subtle and tasteful — gentle fade-ins on scroll, soft hover states. Nothing flashy.
- **Imagery:** Placeholder hero section for a photo of Bor & Sara (they'll add the image later). Use decorative botanical/floral SVG accents if appropriate.

## Key Behaviors & Rules

1. **Guest gate is global.** Every page except `/gate` and `/api/gate` must be behind the guest password. Use Next.js middleware to check for the `guest_authenticated` cookie.
2. **Admin routes are separate.** `/admin/*` requires a Supabase Auth session. The admin login page (`/admin/login`) is accessible after the guest gate but does not require admin auth.
3. **Song requests are anonymous-friendly.** The "requested by" field is optional. Guests do not need to create accounts.
4. **Seating chart is read-only for guests.** Guests see a visual floor plan with tables and names. Only the admin can edit.
5. **Admin seating editor.** Bor & Sara can: create/delete tables, name tables, set seat count, drag tables to position them on a floor plan, and assign guest names to seats.
6. **Info page has placeholder content.** Use clear placeholder text like `[VENUE ADDRESS HERE]` and `[DIRECTIONS HERE]` so Bor & Sara can fill in the real details later.
7. **All data flows through Supabase.** No local state hacks — everything persists in the DB.
8. **No over-engineering.** This is a wedding site for ~100 guests, not a SaaS product. Keep it simple, beautiful, and functional.

## Commands

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Lint
```
