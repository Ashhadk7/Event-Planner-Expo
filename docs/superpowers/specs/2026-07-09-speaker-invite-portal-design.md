# Speaker Invite & Self-Service Portal — Design

Date: 2026-07-09
Status: Approved design, ready for implementation plan
Repo: Ashhadk7/Event-Planner-Expo (app in `web/`)

## Goal

Replace the current copy-a-link invite flow with an email-based, self-service
speaker portal. The admin invites a speaker by email; the speaker receives a
custom link and password, logs in to their own profile, adds and later edits
their details and headshot; every edit or upload is held until the admin
approves it before it appears on the public site.

## Why this needs a backend

The app today is a 100% static Vite SPA. Speaker data is hardcoded in
`web/src/data/speakers.ts`, and the existing admin "approval" flow lives only in
`localStorage` (per browser, not shared, lost on cache clear, no auth of value).
None of the requested behaviour (send email, per-speaker login, persistent
edits, cross-device admin approval, photo upload) can work without real backend
infrastructure. This design adds a thin backend without changing the SPA model.

## Stack (chosen with the client)
- **Vercel serverless functions** (`api/` at repo root) for all backend logic.
- **Neon Postgres** as the database.
- **Resend** for the invite emails.
- **Vercel Blob** for headshot uploads.
- Frontend stays the existing React + TS + Vite + Tailwind SPA in `web/`.

## The three actors and the flow
1. **Admin** opens the admin panel, enters a speaker's name + email, clicks
   Invite. The system creates the speaker, generates a unique token and a random
   password, and emails the speaker a link `APP_URL/speaker/<token>` plus the
   password.
2. **Speaker** opens the link, enters the password, and lands in their own
   profile. They fill in or edit their details and upload a headshot, then Save.
   The save is stored as a pending version. They can return to the same link any
   time to edit again. A banner tells them changes are awaiting approval.
3. **Admin** sees pending changes in the approval queue and Approves or Rejects.
   Approve publishes the pending version; Reject discards it. The public site
   shows the last approved version until a new one is approved. A newly invited
   speaker does not appear publicly until their first approval.

## Data model (Neon Postgres)

Single `speakers` table (one row per speaker, holds both versions):

```
speakers
  id             uuid primary key default gen_random_uuid()
  invite_token   text unique not null      -- the <token> in the portal URL
  password_hash  text not null             -- bcrypt of the emailed password
  email          text not null
  status         text not null             -- 'invited' | 'active'
  approved_data  jsonb                      -- the live public profile, or null
  pending_data   jsonb                      -- edits awaiting approval, or null
  has_pending    boolean not null default false
  created_at     timestamptz not null default now()
  updated_at     timestamptz not null default now()
```

Profile shape stored in `approved_data` / `pending_data` (mirrors the existing
`Speaker` type in `web/src/data/speakerTypes.ts`):
`{ firstName, lastName, title, company, country, bio, expertise[], photoUrl,
   linkedin, type, year }`. The public `id`/`slug` used by the UI are derived
from the row `id` and the name.

State rules:
- **Public visibility:** a speaker is public only when `approved_data` is not
  null. `GET /api/speakers` returns only rows with non-null `approved_data`.
- **Edit:** `PUT /api/speaker/me` writes the body to `pending_data`, sets
  `has_pending = true`. `approved_data` is untouched, so the public site keeps
  showing the last approved version.
- **Approve:** copy `pending_data` into `approved_data`, set `pending_data`
  null, `has_pending` false, `status = 'active'`.
- **Reject:** set `pending_data` null, `has_pending` false (approved stays).

## API endpoints (`api/`)

Speaker-facing:
- `POST /api/speaker/login` — body `{ token, password }`. Verifies bcrypt, issues
  a short-lived JWT (signed with `JWT_SECRET`) returned to the client.
- `GET  /api/speaker/me` — auth by JWT. Returns the speaker's working profile
  (pending if present, else approved) plus `has_pending`.
- `PUT  /api/speaker/me` — auth by JWT. Validates and writes `pending_data`.
- `POST /api/speaker/photo` — auth by JWT. Multipart image upload → Vercel Blob →
  returns the blob URL; the client puts it in the profile before saving.

Public:
- `GET  /api/speakers` — returns all approved speaker profiles for the site.

Admin-facing (all require the admin password, see Auth):
- `POST /api/admin/invite` — body `{ firstName, lastName, email }`. Creates the
  row, generates token + password, sends the Resend email, returns success.
- `GET  /api/admin/pending` — rows where `has_pending = true`, with both the
  approved and pending versions so the admin can compare.
- `POST /api/admin/approve` — body `{ id }`. Applies the approve rule.
- `POST /api/admin/reject`  — body `{ id }`. Applies the reject rule.
- `GET  /api/admin/speakers` — all rows (for the admin roster view), optional.

Each function validates its input and returns clear JSON errors; one bad row or
request never 500s silently.

## Auth
- **Admin:** replace the current client-side `password === 'admin123'` check
  (trivially bypassable) with a server check against an `ADMIN_PASSWORD` env var.
  `/api/admin/login` verifies the password and issues an admin JWT; every admin
  endpoint requires that JWT. The existing `/login` page posts to this.
- **Speaker:** the emailed password + the token in the URL. `POST
  /api/speaker/login` verifies and issues a speaker JWT scoped to that speaker
  id. Speaker endpoints verify the JWT and only touch that speaker's row.
- Passwords are stored bcrypt-hashed. JWTs are short-lived; the speaker's
  permanent re-entry point is their `/speaker/<token>` link plus password (they
  simply log in again), so no long-lived session is needed.

## Frontend changes (`web/src/`)
- **New route `/speaker/:token`** — a `SpeakerPortal` page: password gate →
  profile form (all fields + headshot upload with preview) → Save button
  labelled "Save (pending admin approval)". Shows a banner when `has_pending` is
  true. On load it calls `/api/speaker/me` after login.
- **Admin panel (`AdminDashboard.tsx`)** — add an Invite form (name + email →
  `POST /api/admin/invite`, shows sent/failed). Replace the localStorage pending
  queue with data from `GET /api/admin/pending`; Approve/Reject call the real
  endpoints. Admin auth uses the server login instead of the local check.
- **Public pages (`UpcomingSpeakers` / `PastSpeakers`)** — fetch `/api/speakers`
  instead of importing the static `SPEAKERS` array. `speakers.ts` stays only as
  a type reference / seed source. If the fetch fails, the page shows an empty or
  cached state rather than crashing.

## Env / secrets (Vercel project settings)
`DATABASE_URL` (Neon), `RESEND_API_KEY`, `RESEND_FROM` (verified sender),
`BLOB_READ_WRITE_TOKEN` (Vercel Blob), `ADMIN_PASSWORD`, `JWT_SECRET`, `APP_URL`.
The client must create the Neon DB, Resend account + verified sender, and Vercel
Blob store; exact steps handed over at implementation time.

## Error handling
- API input validated; malformed requests return 400 with a message, not a 500.
- Email send failure on invite returns an error to the admin (the speaker row is
  still created; admin can resend) rather than losing the invite.
- Photo upload rejects non-images and oversized files with a clear message.
- Public `GET /api/speakers` never depends on pending data; a DB hiccup yields an
  empty list and a graceful UI, never a broken page.

## Testing
- API unit/contract tests for: invite (row + token + password created, email
  attempted), speaker login (right/wrong password), edit writes pending only,
  approve copies pending→approved, reject clears pending, public list returns
  only approved.
- Auth tests: admin endpoints reject a missing/wrong admin JWT; speaker
  endpoints reject cross-speaker access.
- A manual end-to-end pass on a Vercel preview: invite → email → login → edit →
  pending banner → admin approve → appears on public site → edit again → pending.

## Out of scope (this build)
- Password reset / "forgot password" (admin can re-invite to regenerate).
- Email templates beyond a clean branded invite.
- Bulk invite / CSV import.
- Public self-signup: the existing `/signup` page is left exactly as-is this
  build (still localStorage-only). It is not wired to the new backend and not
  removed. A later decision can retire or connect it.
