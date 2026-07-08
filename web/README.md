# EPX Speaker Portal — Frontend

Premium speaker discovery portals for **The Event Planner Expo**, built with
React + Vite + TypeScript + Tailwind CSS v4. This phase covers the **public
(user-facing) experience**. The admin panel and PostgreSQL backend come next.

## Run it

```bash
cd web
npm install
npm run dev        # http://localhost:5173
```

Build / type-check:

```bash
npm run build      # tsc -b && vite build
```

## What's built

Two portals sharing one component, filtered by year:

| Route             | Portal                    | Data          |
| ----------------- | ------------------------- | ------------- |
| `/2026-speakers`  | Upcoming speakers hub     | year ≥ 2026   |
| `/past-speakers`  | 2025 & archive hub        | year < 2026   |

`/` redirects to `/2026-speakers`.

### Features
- Hero with brand gradient, live countdown to Oct 27 2026, and a stats strip
- Real-time search by **name or company**
- Filter dropdown by **speaker type**
- Responsive card grid (2 → 3 → 4 → 5 columns)
- Elegant initials placeholders (navy gradient) when a speaker has no photo
- Detail **modal**: bio, expertise pills, LinkedIn, share menu
  (copy link / LinkedIn / X / email); closes on X, outside-click or `Esc`
- Deep-linking: opening a speaker sets `?speaker=<slug>` so links are shareable
- Mobile-first, keyboard-accessible, honours `prefers-reduced-motion`

## Design system

Brand sourced from theeventplannerexpo.com — see `src/index.css` (`@theme`).

- **Navy** `#001F3F` (primary) · **Orange** `#FF4500` (CTA) · gold accent
- **Poppins** (display) + **Inter** (body)
- Speaker-type badge colours per the brief in `src/data/speakerTypes.ts`

## Structure

```
src/
  data/
    speakers.ts        # mock data — mirrors the Sheet/Postgres schema (API-ready)
    speakerTypes.ts    # speaker types + badge styles
    portals.ts         # 2026 vs Past portal config
  components/
    ui/                # Button, TypeBadge, Avatar, Logo, BrandIcons
    Navbar, Footer, Hero, Countdown,
    SearchFilterBar, SpeakerCard, SpeakerGrid,
    SpeakerModal, ShareMenu, RegisterCta
  pages/
    SpeakerHub.tsx     # orchestrates search/filter/modal state
  App.tsx              # routes
```

## Swapping mock data for the API

`src/data/speakers.ts` exports a `SPEAKERS` array typed as `Speaker[]`. When the
Postgres backend is ready, replace that import with a fetch/query returning the
same `Speaker` shape — no UI changes required.
