# tickets.md — Implementation Plan

Work through these tickets in order. Mark each `[x]` when complete.

---

## Ticket 1: Project Scaffolding & Dependencies

- [ ] Initialize Next.js 14+ project with TypeScript and App Router (`create-next-app`)
- [ ] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `tailwindcss`
- [ ] Configure Tailwind with a custom color palette (creams, sage greens, muted gold — see CLAUDE.md design direction)
- [ ] Add Google Fonts: Playfair Display (serif, headings) and Inter (sans-serif, body)
- [ ] Set up the root `layout.tsx` with fonts, metadata (`<title>Bor & Sara</title>`), and a basic HTML shell
- [ ] Create `.env.local.example` with all required env vars documented
- [ ] Create the `src/types/index.ts` file with TypeScript interfaces for `WeddingTable`, `Guest`, and `SongRequest` matching the DB schema in CLAUDE.md
- [ ] Verify `npm run dev` starts without errors

**Acceptance:** Project runs, Tailwind works, fonts load, types are defined.

---

## Ticket 2: Supabase Setup & Database Schema

- [ ] Create `supabase/migrations/001_initial_schema.sql` with the full schema from CLAUDE.md (wedding_tables, guests, song_requests)
- [ ] Include RLS policies in the migration:
  - `wedding_tables`: SELECT for anon, ALL for authenticated
  - `guests`: SELECT for anon, ALL for authenticated
  - `song_requests`: SELECT + INSERT for anon, ALL for authenticated
- [ ] Enable RLS on all three tables
- [ ] Create `src/lib/supabase/client.ts` — browser-side Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Create `src/lib/supabase/server.ts` — server-side Supabase client using `@supabase/ssr` with cookie handling for Next.js App Router
- [ ] Create a separate admin server client helper that uses `SUPABASE_SERVICE_ROLE_KEY` for admin operations that bypass RLS
- [ ] Add instructions in a comment or README section on how to run the migration against a Supabase project

**Acceptance:** Migration file is complete and valid SQL. Both client and server Supabase helpers are created and export usable clients.

---

## Ticket 3: Guest Password Gate

- [ ] Create `src/app/gate/page.tsx` — a centered, beautifully styled page with a single password input and submit button. Heading: "Enter the password to continue" or similar warm wording.
- [ ] Create `src/components/GuestPasswordForm.tsx` — client component with the form logic
- [ ] Create `src/app/api/gate/route.ts` — POST handler that:
  - Compares the submitted password to `process.env.GUEST_PASSWORD`
  - On success: sets an HTTP-only cookie `guest_authenticated=true` (with reasonable expiry, e.g., 30 days) and returns 200
  - On failure: returns 401
- [ ] Create `src/middleware.ts` that:
  - Checks for `guest_authenticated` cookie on every request
  - Allows `/gate`, `/api/gate`, `/_next`, and static files through without the cookie
  - Redirects all other requests to `/gate` if the cookie is missing
- [ ] Style the gate page to feel like an elegant invitation — it's the first impression

**Acceptance:** Visiting any page without the cookie redirects to `/gate`. Entering the correct password sets the cookie and redirects to `/`. Entering the wrong password shows an error. Refreshing after auth keeps you logged in.

---

## Ticket 4: Landing Page (Hero)

- [ ] Create `src/app/page.tsx` — the home / landing page
- [ ] Design a full-viewport hero section with:
  - Names: "Bor & Sara" in large serif font
  - A placeholder area for a photo (use a soft gradient or decorative placeholder for now)
  - Wedding date placeholder: `[DATE]`
  - A warm welcome message, e.g., "We're getting married and we'd love for you to be there"
- [ ] Create `src/components/Navbar.tsx` — simple top navigation with links to: Home, Info, Songs, Seating
  - Sticky on scroll, semi-transparent background
  - Mobile hamburger menu
- [ ] Add Navbar to the root layout (only render it if the user has passed the gate — check cookie server-side, or conditionally render based on route)
- [ ] Add a subtle scroll-down indicator or "See details" button linking to `/info`

**Acceptance:** Beautiful, responsive landing page. Navbar works on mobile and desktop. Feels like a wedding invitation, not a tech demo.

---

## Ticket 5: Info Page (Event Details & Directions)

- [ ] Create `src/app/info/page.tsx`
- [ ] Lay out the following sections with placeholder content:
  - **When:** Date and time — `[DATE AND TIME HERE]`
  - **Where:** Venue name and address — `[VENUE NAME]`, `[VENUE ADDRESS]`
  - **How to get there:** Directions section — `[DIRECTIONS / MAP EMBED HERE]`
  - **Schedule / Timeline:** A simple timeline of the day (ceremony, cocktail hour, dinner, party) — `[SCHEDULE HERE]`
  - **Dress code:** `[DRESS CODE HERE]`
  - **Accommodation:** `[ACCOMMODATION SUGGESTIONS HERE]`
- [ ] Use clear `[PLACEHOLDER]` markers so Bor & Sara know exactly what to fill in
- [ ] Style with elegant typography, good spacing, and subtle dividers between sections
- [ ] Make it easy to read on mobile (single column, generous padding)

**Acceptance:** Info page looks polished even with placeholder content. All sections are clearly laid out and easy to edit later.

---

## Ticket 6: Song Requests

- [ ] Create `src/app/songs/page.tsx` — the song request page
- [ ] Create `src/components/SongForm.tsx` — client component with fields:
  - Song title (required)
  - Artist (optional)
  - Your name (optional)
  - Submit button
- [ ] On submit: INSERT into `song_requests` via Supabase client (anon insert, allowed by RLS)
- [ ] Show a success toast/message after submission
- [ ] Create `src/components/SongList.tsx` — displays all song requests fetched from Supabase
  - Show song title, artist, and who requested it
  - Order by most recent first
  - Style as a nice list or card grid
- [ ] Fetch songs server-side on page load, and optionally refresh client-side after a new submission
- [ ] Add a fun heading like "Request a song for the party 🎵" (emoji acceptable here as it fits the vibe)

**Acceptance:** Guests can submit songs. Songs appear in the list. No login required. Duplicate submissions are fine (no need to prevent).

---

## Ticket 7: Public Seating Chart (Read-Only)

- [ ] Create `src/app/seating/page.tsx` — the public seating chart page
- [ ] Create `src/components/FloorPlan.tsx` — a visual component that:
  - Fetches all `wedding_tables` and their `guests` from Supabase
  - Renders each table as a round/rectangular shape positioned according to `position_x` and `position_y` (percentage-based on a container)
  - Displays the table name and guest names around/inside each table
  - Props accept a `mode` prop: `"view"` (public) or `"edit"` (admin) — for now implement `"view"` only
- [ ] Create `src/components/TableCard.tsx` — renders a single table with:
  - Table name as a label
  - Guest names arranged around a circular table shape (or listed neatly)
  - Seat count indicator if table is not full
- [ ] Make the floor plan responsive — zoomable or scrollable on mobile
- [ ] If no tables exist yet, show a friendly message: "Seating arrangements coming soon!"

**Acceptance:** Guests can view a visual seating chart. Tables are positioned correctly. Guest names are visible. Looks good on mobile.

---

## Ticket 8: Admin Login

- [ ] Create `src/app/admin/login/page.tsx` — admin login form
- [ ] Create `src/components/AdminLoginForm.tsx` — client component with email + password fields
- [ ] On submit: call `supabase.auth.signInWithPassword()` with the entered credentials
- [ ] On success: redirect to `/admin/seating`
- [ ] On failure: show error message
- [ ] Update `src/middleware.ts` to:
  - Check for a valid Supabase Auth session on `/admin/*` routes (except `/admin/login`)
  - Redirect to `/admin/login` if no session
  - Keep the existing guest gate logic intact (admin routes also require guest gate first)
- [ ] Add a small "Admin" link in the Navbar footer or a discreet link somewhere (not prominently displayed)

**Acceptance:** Admin can log in. Unauthenticated users are redirected to login. Session persists across page reloads.

---

## Ticket 9: Admin Seating Editor

- [ ] Create `src/app/admin/seating/page.tsx` — the admin seating management page
- [ ] Build the editor UI with two panels:
  - **Left / Top panel:** The floor plan (reuse `FloorPlan.tsx` in `"edit"` mode)
  - **Right / Bottom panel:** Table editor sidebar/form
- [ ] Implement table management:
  - "Add Table" button → creates a new table with default values via Supabase (use service role client)
  - Click a table to select it and edit its properties:
    - Table name (text input)
    - Seat count (number input)
    - Delete table button (with confirmation)
  - Drag tables to reposition them on the floor plan → updates `position_x` and `position_y` in the DB
- [ ] Implement guest assignment:
  - When a table is selected, show its guest list
  - "Add Guest" button → text input for name, INSERT into `guests` with the table's ID
  - Remove guest button (x icon) → DELETE from `guests`
  - Show remaining seats: `{seat_count - guest_count} seats left`
- [ ] All changes persist to Supabase immediately (no separate save button — autosave on change)
- [ ] Add a "Logout" button that calls `supabase.auth.signOut()` and redirects to `/`

**Acceptance:** Admin can create tables, name them, position them, add/remove guests, and delete tables. Changes are visible immediately on the public seating page. Drag-to-position works.

---

## Ticket 10: Polish & Final Touches

- [ ] Review all pages on mobile (375px) and desktop (1280px) — fix any layout issues
- [ ] Add subtle page transition animations (fade-in on route change)
- [ ] Add scroll animations to content sections (gentle fade-up on enter)
- [ ] Ensure consistent spacing, font sizes, and color usage across all pages
- [ ] Add a footer to the layout with "Bor & Sara · [YEAR]" and maybe a heart icon
- [ ] Add proper `<head>` metadata: title, description, Open Graph tags (for when the link is shared)
- [ ] Test the full guest flow: gate → home → info → songs → seating
- [ ] Test the full admin flow: gate → admin login → seating editor → logout
- [ ] Ensure there are no TypeScript errors (`npm run build` succeeds)
- [ ] Ensure no console errors in the browser
- [ ] Write a brief README.md with setup instructions (env vars, Supabase setup, running migrations, creating the admin user)

**Acceptance:** The site is polished, responsive, error-free, and ready for Bor & Sara to fill in their content and deploy.
