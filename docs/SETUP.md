# Speaker Invite Portal — Backend Setup

The speaker invite/self-service portal needs a small backend (Vercel serverless
functions + Neon Postgres + Resend + Vercel Blob). The static site keeps working
without it, but invites, speaker logins, edits, approvals, and the live speaker
list all require the steps below. Do this once.

## 1. Create the external accounts / stores

- **Neon Postgres** — [neon.tech](https://neon.tech) → create a project → copy the
  **pooled** connection string. This is `DATABASE_URL`.
- **Resend** — [resend.com](https://resend.com) → **API Keys** → create one
  (`RESEND_API_KEY`). Then verify a sending domain under **Domains** so you can
  send from an address on it (e.g. `speakers@yourdomain.com`).
- **Vercel Blob** — Vercel dashboard → **Storage** → create a **Blob** store →
  connect it to this project. NOTE: connecting only injects `BLOB_STORE_ID` and
  `BLOB_WEBHOOK_PUBLIC_KEY`, **not** `BLOB_READ_WRITE_TOKEN`. Copy the token
  yourself from the Blob store's **`.env.local`** tab (the `vercel_blob_rw_…`
  value) and add it as `BLOB_READ_WRITE_TOKEN` below. This is only needed for
  speaker headshot **uploads**; the rest of the app works without it.

## 2. Set environment variables

In **Vercel → Project → Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | verified sender, e.g. `Speakers <speakers@yourdomain.com>` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (injected when you connect the store) |
| `ADMIN_PASSWORD` | the password for the `/login` admin panel |
| `JWT_SECRET` | any long random string (used to sign login tokens) |
| `APP_URL` | the site's public URL, e.g. `https://event-planner-expo-dusky.vercel.app` — used to build the `/speaker/<token>` link in invite emails |

Set them for the **Production** (and Preview, if you deploy previews) environment.

## 3. Create the database table

Run the schema once against Neon — either:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

…or open the **Neon SQL Editor** and paste the contents of `db/schema.sql`.

## 4. Deploy

After the env vars are set and the schema is applied:

```bash
vercel deploy --prod --yes --scope muhammadmehroz786s-projects --name event-planner-expo
```

Wait for the deployment to report **READY**.

## 5. End-to-end check on the live URL

1. **Admin:** go to `/login`, sign in with `ADMIN_PASSWORD`, land on `/admin`.
   Use the **Invite** form to invite a speaker (use your own email to test).
2. **Email:** open the invite email → click the `/speaker/<token>` link →
   log in with the password from the email.
3. **Speaker:** fill in the profile, upload a headshot, click
   **Save (pending admin approval)** → the "awaiting approval" banner appears.
4. **Admin:** back on `/admin`, the **Pending** queue shows the speaker → **Approve**.
5. **Public:** on `/` the speaker now appears (with their photo) in the current-year list.
6. **Edit again:** the speaker opens their same link, edits, and saves → the banner
   returns and the public site keeps showing the previously approved version until
   you approve the new one.

## Notes

- **Email failure never loses an invite.** If Resend can't send (bad key /
  unverified sender), the speaker row is still created; the admin sees "email
  failed to send" and can re-invite.
- **The public page degrades gracefully.** If the API/DB is unreachable, `/`
  falls back to the built-in static speaker list instead of showing a blank page.
- **A speaker's link + password are permanent** — they reuse them to edit anytime.
  There is no self-service password reset in this build; re-invite to regenerate.
