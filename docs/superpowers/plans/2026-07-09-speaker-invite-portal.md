# Speaker Invite & Self-Service Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the copy-a-link invite with an email-based self-service speaker portal: admin invites by email, speaker logs in via a custom link + password to edit their own profile and headshot, and every change waits for admin approval before it shows publicly.

**Architecture:** Add Vercel serverless functions (`api/` at repo root) over a Neon Postgres database, with Resend for invite email and Vercel Blob for headshot uploads. The existing React+TS+Vite SPA in `web/` keeps its structure and calls these APIs instead of using localStorage or the hardcoded `SPEAKERS` array.

**Tech Stack:** Vercel Functions (Node), Neon Postgres (`@neondatabase/serverless`), Resend, Vercel Blob (`@vercel/blob`), `bcryptjs`, `jsonwebtoken`, Vitest for API tests. Frontend: React 19, TypeScript, Vite, Tailwind, react-router-dom.

## Global Constraints

- Backend is **Vercel serverless functions** in `api/` at the repo ROOT (not under `web/`). Vercel auto-detects `api/*.ts` as functions.
- Database is **Neon Postgres** accessed with `@neondatabase/serverless` using `process.env.DATABASE_URL`.
- A speaker is **public only when `approved_data IS NOT NULL`**. `GET /api/speakers` returns only those.
- **Edit writes `pending_data` only**; `approved_data` is never touched by a speaker edit. **Approve** copies pending→approved and clears pending. **Reject** clears pending, leaves approved.
- Passwords stored **bcrypt-hashed** (`bcryptjs`). Auth tokens are **JWTs** signed with `process.env.JWT_SECRET`, `expiresIn: '2h'`.
- Admin auth uses `process.env.ADMIN_PASSWORD` server-side (replaces the client-side `admin123`).
- Profile shape (stored in the jsonb columns) mirrors the existing `Speaker` interface in `web/src/data/speakerTypes.ts` + `web/src/data/speakers.ts`: `{ firstName, lastName, title, company, country, bio, expertise: string[], photoUrl, linkedin, type, year }`.
- Env vars (Vercel project settings): `DATABASE_URL`, `RESEND_API_KEY`, `RESEND_FROM`, `BLOB_READ_WRITE_TOKEN`, `ADMIN_PASSWORD`, `JWT_SECRET`, `APP_URL`.
- All API handlers validate input and return JSON `{ error }` with a 4xx status on bad input; never let a bad request 500 silently.
- Commit author is `Mehroz <mehroz.muneer@gmail.com>`. Run API tests from repo root; frontend from `web/`.

---

## File Structure

**Root (new backend):**
- `package.json` (root) — deps for the functions + Vitest. Separate from `web/package.json`.
- `api/_lib/db.ts` — Neon client + query helper.
- `api/_lib/auth.ts` — JWT sign/verify, bcrypt helpers, request auth guards.
- `api/_lib/profile.ts` — profile validation + the shared Profile type.
- `api/_lib/email.ts` — Resend invite-email sender.
- `api/speakers.ts` — `GET` public approved speakers.
- `api/speaker/login.ts` — `POST` token+password → JWT.
- `api/speaker/me.ts` — `GET` current profile / `PUT` save pending.
- `api/speaker/photo.ts` — `POST` headshot → Blob url.
- `api/admin/login.ts` — `POST` admin password → admin JWT.
- `api/admin/invite.ts` — `POST` create speaker + email.
- `api/admin/pending.ts` — `GET` rows with pending changes.
- `api/admin/approve.ts` — `POST` approve.
- `api/admin/reject.ts` — `POST` reject.
- `db/schema.sql` — the `speakers` table DDL (run once against Neon).
- `tests/api/*.test.ts` — Vitest contract tests for the `_lib` logic + handlers.
- `vercel.json` (root, MODIFY) — fix the SPA rewrite so `/api/*` is not swallowed.

**Frontend (`web/src`):**
- `web/src/lib/api.ts` (new) — typed fetch helpers for the endpoints.
- `web/src/pages/SpeakerPortal.tsx` (new) — the `/speaker/:token` portal.
- `web/src/pages/AdminDashboard.tsx` (modify) — invite form + real pending queue.
- `web/src/pages/AdminLogin.tsx` (modify) — server login.
- `web/src/pages/SpeakerHub.tsx` (modify) — fetch `/api/speakers`.
- `web/src/App.tsx` (modify) — add the `/speaker/:token` route.

---

### Task 1: Root backend scaffold + DB schema + test runner

**Files:**
- Create: `package.json` (root), `db/schema.sql`, `api/_lib/db.ts`, `tests/api/db.test.ts`, `vitest.config.ts` (root)
- Modify: `vercel.json` (root)

**Interfaces:**
- Produces: `query(sql: string, params?: unknown[]): Promise<Row[]>` from `api/_lib/db.ts`; the `speakers` table.

- [ ] **Step 1: Create the root package.json**

Create `package.json` (repo root):

```json
{
  "name": "epx-api",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "vitest run"
  },
  "dependencies": {
    "@neondatabase/serverless": "^0.10.4",
    "@vercel/blob": "^0.27.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "resend": "^4.0.1"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^22.10.0",
    "typescript": "^5.7.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Install**

Run: `cd /Users/apple/Event-Planner-Expo && npm install`
Expected: `added N packages`, no errors.

- [ ] **Step 3: Create vitest config**

Create `vitest.config.ts` (root):

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["tests/**/*.test.ts"] },
});
```

- [ ] **Step 4: Create the DB schema**

Create `db/schema.sql`:

```sql
create extension if not exists pgcrypto;

create table if not exists speakers (
  id            uuid primary key default gen_random_uuid(),
  invite_token  text unique not null,
  password_hash text not null,
  email         text not null,
  status        text not null default 'invited',
  approved_data jsonb,
  pending_data  jsonb,
  has_pending   boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists speakers_approved_idx on speakers ((approved_data is not null));
create index if not exists speakers_pending_idx  on speakers (has_pending);
```

- [ ] **Step 5: Create the db helper**

Create `api/_lib/db.ts`:

```ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/** Run a parameterized query. Returns the result rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  return (await sql.query(text, params)) as T[];
}

export { sql };
```

- [ ] **Step 6: Write a lightweight test that db.ts loads and query is a function**

Create `tests/api/db.test.ts`:

```ts
import { describe, it, expect } from "vitest";

describe("db module", () => {
  it("exports a query function", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost/db";
    const mod = await import("../../api/_lib/db.ts");
    expect(typeof mod.query).toBe("function");
  });
});
```

- [ ] **Step 7: Run it**

Run: `cd /Users/apple/Event-Planner-Expo && npm test`
Expected: 1 passed.

- [ ] **Step 8: Fix vercel.json so /api is not swallowed by the SPA rewrite**

Modify `vercel.json` — replace the rewrites so API routes reach the functions:

```json
{
  "buildCommand": "npm install --prefix web && npm run build --prefix web",
  "outputDirectory": "web/dist",
  "rewrites": [
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ]
}
```

- [ ] **Step 9: Commit**

```bash
git add package.json vitest.config.ts db/schema.sql api/_lib/db.ts tests/api/db.test.ts vercel.json package-lock.json
git commit -m "feat: backend scaffold, Neon schema, vitest, api rewrite fix" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 2: Auth + profile validation libs

**Files:**
- Create: `api/_lib/auth.ts`, `api/_lib/profile.ts`, `tests/api/auth.test.ts`, `tests/api/profile.test.ts`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces:
  - `auth.ts`: `hashPassword(pw: string): Promise<string>`, `verifyPassword(pw, hash): Promise<boolean>`, `signToken(payload: object): string`, `verifyToken<T>(token: string): T | null`, `randomToken(): string`, `randomPassword(): string`.
  - `profile.ts`: type `Profile`, `validateProfile(input: unknown): { ok: true; value: Profile } | { ok: false; error: string }`.

- [ ] **Step 1: Write failing tests for auth**

Create `tests/api/auth.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; });

describe("auth", () => {
  it("hashes and verifies a password", async () => {
    const { hashPassword, verifyPassword } = await import("../../api/_lib/auth.ts");
    const h = await hashPassword("hunter2");
    expect(h).not.toBe("hunter2");
    expect(await verifyPassword("hunter2", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });

  it("signs and verifies a JWT round trip", async () => {
    const { signToken, verifyToken } = await import("../../api/_lib/auth.ts");
    const t = signToken({ sub: "abc", role: "speaker" });
    expect(verifyToken<{ sub: string }>(t)?.sub).toBe("abc");
    expect(verifyToken("garbage")).toBeNull();
  });

  it("random token and password are non empty and unique", async () => {
    const { randomToken, randomPassword } = await import("../../api/_lib/auth.ts");
    expect(randomToken()).not.toBe(randomToken());
    expect(randomPassword().length).toBeGreaterThanOrEqual(10);
  });
});
```

- [ ] **Step 2: Run, verify fail**

Run: `npm test tests/api/auth.test.ts`
Expected: FAIL, cannot find module `../../api/_lib/auth.ts`.

- [ ] **Step 3: Implement auth.ts**

Create `api/_lib/auth.ts`:

```ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

export function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}
export function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}
export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "2h" });
}
export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as T;
  } catch {
    return null;
  }
}
export function randomToken(): string {
  return randomBytes(24).toString("hex");
}
export function randomPassword(): string {
  // readable-ish 12 char password
  return randomBytes(9).toString("base64url").slice(0, 12);
}
```

- [ ] **Step 4: Run, verify pass**

Run: `npm test tests/api/auth.test.ts`
Expected: 3 passed.

- [ ] **Step 5: Write failing tests for profile validation**

Create `tests/api/profile.test.ts`:

```ts
import { describe, it, expect } from "vitest";

const valid = {
  firstName: "Mario", lastName: "Stewart", title: "Founder & CEO",
  company: "Stewart Experiential", country: "United States",
  bio: "Bio here", expertise: ["Experiential"], photoUrl: "",
  linkedin: "https://linkedin.com/in/x", type: "Founder", year: 2026,
};

describe("validateProfile", () => {
  it("accepts a well formed profile", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile(valid);
    expect(r.ok).toBe(true);
  });

  it("rejects a missing required field", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, firstName: "" });
    expect(r.ok).toBe(false);
  });

  it("rejects an invalid speaker type", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, type: "Wizard" });
    expect(r.ok).toBe(false);
  });

  it("coerces expertise to an array and year to a number", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, expertise: undefined, year: "2026" });
    expect(r.ok).toBe(true);
    if (r.ok) { expect(Array.isArray(r.value.expertise)).toBe(true); expect(r.value.year).toBe(2026); }
  });
});
```

- [ ] **Step 6: Run, verify fail**

Run: `npm test tests/api/profile.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 7: Implement profile.ts**

Create `api/_lib/profile.ts`:

```ts
const SPEAKER_TYPES = ["Main Day", "Fireside Chat", "Founder", "Influencer", "Ambassador", "Sponsor"];

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  country: string;
  bio: string;
  expertise: string[];
  photoUrl: string;
  linkedin: string;
  type: string;
  year: number;
}

type Result = { ok: true; value: Profile } | { ok: false; error: string };

export function validateProfile(input: unknown): Result {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Body must be an object" };
  const b = input as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");

  for (const k of ["firstName", "lastName", "title", "company"]) {
    if (!str(k)) return { ok: false, error: `${k} is required` };
  }
  const type = str("type");
  if (!SPEAKER_TYPES.includes(type)) return { ok: false, error: `type must be one of ${SPEAKER_TYPES.join(", ")}` };

  const year = Number(b.year);
  if (!Number.isFinite(year)) return { ok: false, error: "year must be a number" };

  const expertise = Array.isArray(b.expertise)
    ? (b.expertise as unknown[]).map(String).filter(Boolean)
    : [];

  return {
    ok: true,
    value: {
      firstName: str("firstName"), lastName: str("lastName"), title: str("title"),
      company: str("company"), country: str("country"), bio: str("bio"),
      expertise, photoUrl: str("photoUrl"), linkedin: str("linkedin"),
      type, year,
    },
  };
}
```

- [ ] **Step 8: Run, verify pass**

Run: `npm test tests/api/profile.test.ts`
Expected: 4 passed.

- [ ] **Step 9: Commit**

```bash
git add api/_lib/auth.ts api/_lib/profile.ts tests/api/auth.test.ts tests/api/profile.test.ts
git commit -m "feat: auth (bcrypt/jwt) and profile validation libs" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 3: Admin invite + email + admin login

**Files:**
- Create: `api/_lib/email.ts`, `api/admin/login.ts`, `api/admin/invite.ts`, `tests/api/invite.test.ts`

**Interfaces:**
- Consumes: `query` (Task 1); `hashPassword`, `signToken`, `verifyToken`, `randomToken`, `randomPassword` (Task 2).
- Produces:
  - `email.ts`: `sendInviteEmail(to: string, name: string, link: string, password: string): Promise<void>`.
  - `api/admin/login.ts` default handler: `POST { password } -> { token }` (admin JWT `{ role: "admin" }`).
  - `api/admin/invite.ts` default handler: `POST { firstName, lastName, email }` (Bearer admin JWT) -> `{ ok, emailSent }`.
  - Admin guard `requireAdmin(req): boolean` lives in `api/_lib/auth.ts` (added here).

- [ ] **Step 1: Add the admin guard to auth.ts**

Append to `api/_lib/auth.ts`:

```ts
/** Extract "Authorization: Bearer <jwt>" and return the decoded payload, or null. */
export function bearer<T>(req: { headers: Record<string, string | string[] | undefined> }): T | null {
  const raw = req.headers["authorization"];
  const h = Array.isArray(raw) ? raw[0] : raw;
  if (!h || !h.startsWith("Bearer ")) return null;
  return verifyToken<T>(h.slice(7));
}
export function requireAdmin(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  return bearer<{ role?: string }>(req)?.role === "admin";
}
```

- [ ] **Step 2: Write the email sender**

Create `api/_lib/email.ts`:

```ts
import { Resend } from "resend";

export async function sendInviteEmail(to: string, name: string, link: string, password: string): Promise<void> {
  const resend = new Resend(process.env.RESEND_API_KEY!);
  await resend.emails.send({
    from: process.env.RESEND_FROM!,
    to,
    subject: "Your Event Planner Expo speaker portal",
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111">
        <h2>Welcome, ${name}</h2>
        <p>You have been invited to add your speaker profile for The Event Planner Expo.</p>
        <p><a href="${link}" style="background:#e11d48;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none">Open your speaker portal</a></p>
        <p>Or paste this link: <br>${link}</p>
        <p>Your password: <b>${password}</b></p>
        <p>Use the same link and password any time to edit your profile. Every change is reviewed before it goes live.</p>
      </div>`,
  });
}
```

- [ ] **Step 3: Write admin login handler**

Create `api/admin/login.ts`:

```ts
import { signToken } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const password = req.body?.password;
  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  return res.status(200).json({ token: signToken({ role: "admin" }) });
}
```

- [ ] **Step 4: Write invite handler**

Create `api/admin/invite.ts`:

```ts
import { query } from "../_lib/db.ts";
import { requireAdmin, hashPassword, randomToken, randomPassword } from "../_lib/auth.ts";
import { sendInviteEmail } from "../_lib/email.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });

  const { firstName, lastName, email } = req.body ?? {};
  if (!firstName || !lastName || !email) return res.status(400).json({ error: "firstName, lastName and email are required" });

  const token = randomToken();
  const password = randomPassword();
  const hash = await hashPassword(password);

  await query(
    `insert into speakers (invite_token, password_hash, email, status, pending_data, has_pending)
     values ($1, $2, $3, 'invited', $4, false)`,
    [token, hash, email, JSON.stringify({ firstName, lastName })]
  );

  const link = `${process.env.APP_URL}/speaker/${token}`;
  let emailSent = true;
  try {
    await sendInviteEmail(email, `${firstName} ${lastName}`, link, password);
  } catch {
    emailSent = false; // row still created; admin can resend
  }
  return res.status(200).json({ ok: true, emailSent, link });
}
```

- [ ] **Step 5: Write a test for the admin guard + invite validation (no DB/network)**

Create `tests/api/invite.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.ADMIN_PASSWORD = "pw"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

describe("admin login", () => {
  it("rejects wrong password", async () => {
    const { default: login } = await import("../../api/admin/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: { password: "nope" } }, res);
    expect(res.statusCode).toBe(401);
  });
  it("issues a token for the right password", async () => {
    const { default: login } = await import("../../api/admin/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: { password: "pw" } }, res);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });
});

describe("invite guard", () => {
  it("rejects without admin token", async () => {
    const { default: invite } = await import("../../api/admin/invite.ts");
    const res = mockRes();
    await invite({ method: "POST", headers: {}, body: { firstName: "A", lastName: "B", email: "a@b.co" } }, res);
    expect(res.statusCode).toBe(401);
  });
});
```

- [ ] **Step 6: Run, verify pass**

Run: `npm test tests/api/invite.test.ts`
Expected: 3 passed.

- [ ] **Step 7: Commit**

```bash
git add api/_lib/auth.ts api/_lib/email.ts api/admin/login.ts api/admin/invite.ts tests/api/invite.test.ts
git commit -m "feat: admin login, email invite handler + admin guard" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 4: Speaker login + me (get/put) + public list

**Files:**
- Create: `api/speaker/login.ts`, `api/speaker/me.ts`, `api/speakers.ts`, `tests/api/speaker.test.ts`

**Interfaces:**
- Consumes: `query` (Task 1); `verifyPassword`, `signToken`, `bearer` (Task 2/3); `validateProfile` (Task 2).
- Produces:
  - `api/speaker/login.ts`: `POST { token, password } -> { token: jwt }` (speaker JWT `{ sub: <id>, role: "speaker" }`).
  - `api/speaker/me.ts`: `GET` (Bearer) -> `{ profile, hasPending, status }`; `PUT` (Bearer) `{ ...Profile }` -> `{ ok }` (writes pending_data).
  - `api/speakers.ts`: `GET` -> `{ speakers: PublicSpeaker[] }` (approved only; adds `id`, `slug`).

- [ ] **Step 1: Write speaker login handler**

Create `api/speaker/login.ts`:

```ts
import { query } from "../_lib/db.ts";
import { verifyPassword, signToken } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { token, password } = req.body ?? {};
  if (!token || !password) return res.status(400).json({ error: "token and password required" });

  const rows = await query<{ id: string; password_hash: string }>(
    `select id, password_hash from speakers where invite_token = $1`, [token]
  );
  if (rows.length === 0) return res.status(404).json({ error: "Invalid link" });
  if (!(await verifyPassword(password, rows[0].password_hash))) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  return res.status(200).json({ token: signToken({ sub: rows[0].id, role: "speaker" }) });
}
```

- [ ] **Step 2: Write speaker me handler (GET + PUT)**

Create `api/speaker/me.ts`:

```ts
import { query } from "../_lib/db.ts";
import { bearer } from "../_lib/auth.ts";
import { validateProfile } from "../_lib/profile.ts";

export default async function handler(req: any, res: any) {
  const payload = bearer<{ sub?: string; role?: string }>(req);
  if (!payload || payload.role !== "speaker" || !payload.sub) {
    return res.status(401).json({ error: "Speaker auth required" });
  }
  const id = payload.sub;

  if (req.method === "GET") {
    const rows = await query<{ approved_data: any; pending_data: any; has_pending: boolean; status: string }>(
      `select approved_data, pending_data, has_pending, status from speakers where id = $1`, [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    const r = rows[0];
    return res.status(200).json({ profile: r.pending_data ?? r.approved_data ?? null, hasPending: r.has_pending, status: r.status });
  }

  if (req.method === "PUT") {
    const result = validateProfile(req.body);
    if (!result.ok) return res.status(400).json({ error: result.error });
    await query(
      `update speakers set pending_data = $1, has_pending = true, status = 'active', updated_at = now() where id = $2`,
      [JSON.stringify(result.value), id]
    );
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
```

- [ ] **Step 3: Write the public speakers handler**

Create `api/speakers.ts`:

```ts
import { query } from "./_lib/db.ts";

function slugify(first: string, last: string) {
  return `${first}-${last}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const rows = await query<{ id: string; approved_data: any }>(
      `select id, approved_data from speakers where approved_data is not null order by created_at asc`
    );
    const speakers = rows.map((r) => ({
      id: r.id,
      slug: slugify(r.approved_data.firstName, r.approved_data.lastName),
      ...r.approved_data,
    }));
    return res.status(200).json({ speakers });
  } catch {
    return res.status(200).json({ speakers: [] }); // never break the public page
  }
}
```

- [ ] **Step 4: Write tests for auth guards + method handling (no live DB)**

Create `tests/api/speaker.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.DATABASE_URL = "postgres://u:p@localhost/d"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

describe("speaker me guard", () => {
  it("rejects without a speaker token", async () => {
    const { default: me } = await import("../../api/speaker/me.ts");
    const res = mockRes();
    await me({ method: "GET", headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });
  it("rejects an admin token on a speaker route", async () => {
    const { signToken } = await import("../../api/_lib/auth.ts");
    const { default: me } = await import("../../api/speaker/me.ts");
    const res = mockRes();
    await me({ method: "GET", headers: { authorization: "Bearer " + signToken({ role: "admin" }) } }, res);
    expect(res.statusCode).toBe(401);
  });
});

describe("speaker login validation", () => {
  it("400s without token/password", async () => {
    const { default: login } = await import("../../api/speaker/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: {} }, res);
    expect(res.statusCode).toBe(400);
  });
});
```

- [ ] **Step 5: Run, verify pass**

Run: `npm test tests/api/speaker.test.ts`
Expected: 3 passed.

- [ ] **Step 6: Commit**

```bash
git add api/speaker/login.ts api/speaker/me.ts api/speakers.ts tests/api/speaker.test.ts
git commit -m "feat: speaker login, profile get/put, public approved list" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 5: Photo upload + admin approve/reject/pending

**Files:**
- Create: `api/speaker/photo.ts`, `api/admin/pending.ts`, `api/admin/approve.ts`, `api/admin/reject.ts`, `tests/api/admin.test.ts`

**Interfaces:**
- Consumes: `query` (Task 1); `bearer`, `requireAdmin` (Task 2/3); Vercel Blob `put`.
- Produces:
  - `api/speaker/photo.ts`: `POST` (Bearer speaker, raw image body) -> `{ url }`.
  - `api/admin/pending.ts`: `GET` (admin) -> `{ pending: [{ id, approved, pending }] }`.
  - `api/admin/approve.ts`: `POST { id }` (admin) -> `{ ok }` (pending→approved).
  - `api/admin/reject.ts`: `POST { id }` (admin) -> `{ ok }` (clear pending).

- [ ] **Step 1: Write the photo upload handler**

Create `api/speaker/photo.ts`:

```ts
import { put } from "@vercel/blob";
import { bearer } from "../_lib/auth.ts";

export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
  const payload = bearer<{ sub?: string; role?: string }>(req);
  if (!payload || payload.role !== "speaker" || !payload.sub) {
    return res.status(401).json({ error: "Speaker auth required" });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("image/")) return res.status(400).json({ error: "Body must be an image" });

  try {
    const blob = await put(`speakers/${payload.sub}-${Date.now()}.jpg`, req, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return res.status(200).json({ url: blob.url });
  } catch (e: any) {
    return res.status(500).json({ error: "Upload failed" });
  }
}
```

- [ ] **Step 2: Write admin pending handler**

Create `api/admin/pending.ts`:

```ts
import { query } from "../_lib/db.ts";
import { requireAdmin } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const rows = await query<{ id: string; approved_data: any; pending_data: any; email: string }>(
    `select id, email, approved_data, pending_data from speakers where has_pending = true order by updated_at desc`
  );
  return res.status(200).json({
    pending: rows.map((r) => ({ id: r.id, email: r.email, approved: r.approved_data, pending: r.pending_data })),
  });
}
```

- [ ] **Step 3: Write approve handler**

Create `api/admin/approve.ts`:

```ts
import { query } from "../_lib/db.ts";
import { requireAdmin } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const id = req.body?.id;
  if (!id) return res.status(400).json({ error: "id required" });
  await query(
    `update speakers set approved_data = pending_data, pending_data = null,
       has_pending = false, status = 'active', updated_at = now() where id = $1`,
    [id]
  );
  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 4: Write reject handler**

Create `api/admin/reject.ts`:

```ts
import { query } from "../_lib/db.ts";
import { requireAdmin } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const id = req.body?.id;
  if (!id) return res.status(400).json({ error: "id required" });
  await query(
    `update speakers set pending_data = null, has_pending = false, updated_at = now() where id = $1`,
    [id]
  );
  return res.status(200).json({ ok: true });
}
```

- [ ] **Step 5: Write guard tests for the admin endpoints**

Create `tests/api/admin.test.ts`:

```ts
import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.DATABASE_URL = "postgres://u:p@localhost/d"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

for (const name of ["pending", "approve", "reject"]) {
  describe(`admin ${name} guard`, () => {
    it("rejects without admin token", async () => {
      const { default: h } = await import(`../../api/admin/${name}.ts`);
      const res = mockRes();
      const method = name === "pending" ? "GET" : "POST";
      await h({ method, headers: {}, body: { id: "x" } }, res);
      expect(res.statusCode).toBe(401);
    });
  });
}

describe("approve requires id", () => {
  it("400s without id when admin", async () => {
    const { signToken } = await import("../../api/_lib/auth.ts");
    const { default: approve } = await import("../../api/admin/approve.ts");
    const res = mockRes();
    await approve({ method: "POST", headers: { authorization: "Bearer " + signToken({ role: "admin" }) }, body: {} }, res);
    expect(res.statusCode).toBe(400);
  });
});
```

- [ ] **Step 6: Run, verify pass**

Run: `npm test tests/api/admin.test.ts`
Expected: 4 passed.

- [ ] **Step 7: Run the whole API suite**

Run: `cd /Users/apple/Event-Planner-Expo && npm test`
Expected: all passing.

- [ ] **Step 8: Commit**

```bash
git add api/speaker/photo.ts api/admin/pending.ts api/admin/approve.ts api/admin/reject.ts tests/api/admin.test.ts
git commit -m "feat: photo upload + admin approve/reject/pending" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 6: Frontend API client + admin login + admin invite/queue

**Files:**
- Create: `web/src/lib/api.ts`
- Modify: `web/src/pages/AdminLogin.tsx`, `web/src/pages/AdminDashboard.tsx`

**Interfaces:**
- Consumes: the `/api/*` endpoints (Tasks 3-5).
- Produces: `web/src/lib/api.ts` exporting `adminLogin`, `adminToken`, `invite`, `getPending`, `approve`, `reject`, `speakerLogin`, `speakerToken`, `getMe`, `saveMe`, `uploadPhoto`, `getPublicSpeakers`.

- [ ] **Step 1: Create the API client**

Create `web/src/lib/api.ts`:

```ts
const ADMIN_KEY = "epx_admin_jwt";
const SPEAKER_KEY = "epx_speaker_jwt";

async function jsonFetch(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const adminToken = () => localStorage.getItem(ADMIN_KEY);
export const speakerToken = () => localStorage.getItem(SPEAKER_KEY);
const adminAuth = () => ({ Authorization: `Bearer ${adminToken()}` });
const speakerAuth = () => ({ Authorization: `Bearer ${speakerToken()}` });

export async function adminLogin(password: string) {
  const d = await jsonFetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
  localStorage.setItem(ADMIN_KEY, d.token);
}
export const adminLogout = () => localStorage.removeItem(ADMIN_KEY);
export const invite = (firstName: string, lastName: string, email: string) =>
  jsonFetch("/api/admin/invite", { method: "POST", headers: adminAuth(), body: JSON.stringify({ firstName, lastName, email }) });
export const getPending = () => jsonFetch("/api/admin/pending", { headers: adminAuth() });
export const approve = (id: string) => jsonFetch("/api/admin/approve", { method: "POST", headers: adminAuth(), body: JSON.stringify({ id }) });
export const reject = (id: string) => jsonFetch("/api/admin/reject", { method: "POST", headers: adminAuth(), body: JSON.stringify({ id }) });

export async function speakerLogin(token: string, password: string) {
  const d = await jsonFetch("/api/speaker/login", { method: "POST", body: JSON.stringify({ token, password }) });
  localStorage.setItem(SPEAKER_KEY, d.token);
}
export const getMe = () => jsonFetch("/api/speaker/me", { headers: speakerAuth() });
export const saveMe = (profile: unknown) => jsonFetch("/api/speaker/me", { method: "PUT", headers: speakerAuth(), body: JSON.stringify(profile) });
export async function uploadPhoto(file: File): Promise<string> {
  const res = await fetch("/api/speaker/photo", { method: "POST", headers: { "Content-Type": file.type, Authorization: `Bearer ${speakerToken()}` }, body: file });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error || "Upload failed");
  return d.url;
}
export const getPublicSpeakers = () => jsonFetch("/api/speakers");
```

- [ ] **Step 2: Point AdminLogin at the server**

In `web/src/pages/AdminLogin.tsx`, replace the `handleLogin` body. Change the import block to add `import { adminLogin } from '../lib/api'` and replace the setTimeout block:

```tsx
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await adminLogin(password);
      navigate('/admin');
    } catch (err) {
      setError('Incorrect password. Please try again.');
      setPassword('');
      setIsLoading(false);
    }
  };
```

- [ ] **Step 3: Wire the admin dashboard to the API**

In `web/src/pages/AdminDashboard.tsx`: add `import { adminToken, adminLogout, invite, getPending, approve as apiApprove, reject as apiReject } from '../lib/api'`. The pending rows now have the shape `{ id: string; email: string; approved: Profile | null; pending: Profile }`; type the state accordingly (`const [pendingApps, setPendingApps] = useState<any[]>([])`) and, wherever the old table read `app.firstName`, `app.linkedIn`, etc., read from `app.pending.firstName`, `app.pending.linkedin`, etc. Add two new pieces of component state near the other `useState` calls:

```tsx
const [inviteForm, setInviteForm] = useState({ firstName: '', lastName: '', email: '' });
const [inviteMsg, setInviteMsg] = useState('');
```

Replace the mount effect (the `localStorage.getItem('epx_admin_auth')` auth + `SPEAKERS` seed block) and the handlers with:

```tsx
useEffect(() => {
  if (!adminToken()) { navigate('/login'); return; }
  getPending().then((d) => setPendingApps(d.pending)).catch(() => setPendingApps([]));
}, [navigate]);

const handleApprove = async (id: string) => { await apiApprove(id); const d = await getPending(); setPendingApps(d.pending); };
const handleReject  = async (id: string) => { await apiReject(id);  const d = await getPending(); setPendingApps(d.pending); };
const handleLogout  = () => { adminLogout(); navigate('/login'); };
const handleInvite  = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    const r = await invite(inviteForm.firstName, inviteForm.lastName, inviteForm.email);
    setInviteMsg(r.emailSent ? 'Invite sent.' : 'Speaker created, but the email failed to send.');
    setInviteForm({ firstName: '', lastName: '', email: '' });
  } catch (err: any) { setInviteMsg(err.message || 'Invite failed.'); }
};
```

Add an Invite form to the JSX (near the top of the dashboard body) bound to `inviteForm`/`setInviteForm`, submitting via `handleInvite`, and render `inviteMsg` beneath it. Wire the existing Approve/Reject/Logout buttons to `handleApprove(app.id)` / `handleReject(app.id)` / `handleLogout`. Remove the now-unused `SPEAKERS` import and the `epx_live_speakers` / `epx_pending_speakers` localStorage code.

```tsx
// mount effect (replace the localStorage auth + seed block)
useEffect(() => {
  if (!adminToken()) { navigate('/login'); return; }
  getPending().then((d) => setPendingApps(d.pending)).catch(() => setPendingApps([]));
}, [navigate]);

// handlers
const handleApprove = async (id: string) => { await apiApprove(id); const d = await getPending(); setPendingApps(d.pending); };
const handleReject  = async (id: string) => { await apiReject(id);  const d = await getPending(); setPendingApps(d.pending); };
const handleLogout  = () => { adminLogout(); navigate('/login'); };
const handleInvite  = async (firstName: string, lastName: string, email: string) => {
  const r = await invite(firstName, lastName, email);
  setInviteMsg(r.emailSent ? 'Invite sent.' : 'Speaker created, but the email failed to send.');
};
```

- [ ] **Step 4: Build the frontend to confirm it compiles**

Run: `cd /Users/apple/Event-Planner-Expo/web && npm run build`
Expected: build succeeds (tsc + vite), no type errors.

- [ ] **Step 5: Commit**

```bash
git add web/src/lib/api.ts web/src/pages/AdminLogin.tsx web/src/pages/AdminDashboard.tsx
git commit -m "feat: frontend api client, server admin login, invite + real approval queue" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 7: Speaker portal page + route + public list from API

**Files:**
- Create: `web/src/pages/SpeakerPortal.tsx`
- Modify: `web/src/App.tsx`, `web/src/pages/SpeakerHub.tsx`

**Interfaces:**
- Consumes: `web/src/lib/api.ts` (Task 6).
- Produces: route `/speaker/:token`.

- [ ] **Step 1: Create the speaker portal page**

Create `web/src/pages/SpeakerPortal.tsx`:

```tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { speakerLogin, speakerToken, getMe, saveMe, uploadPhoto } from '../lib/api';
import { SPEAKER_TYPES } from '../data/speakerTypes';

const EMPTY = { firstName: '', lastName: '', title: '', company: '', country: '', bio: '', expertise: [] as string[], photoUrl: '', linkedin: '', type: 'Founder', year: 2026 };

export function SpeakerPortal() {
  const { token = '' } = useParams();
  const [authed, setAuthed] = useState(!!speakerToken());
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<any>(EMPTY);
  const [hasPending, setHasPending] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { if (authed) getMe().then((d) => { if (d.profile) setProfile({ ...EMPTY, ...d.profile }); setHasPending(d.hasPending); }).catch(() => setAuthed(false)); }, [authed]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    try { await speakerLogin(token, password); setAuthed(true); }
    catch { setError('Incorrect password.'); }
  };
  const set = (k: string, v: any) => setProfile((p: any) => ({ ...p, [k]: v }));
  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true); try { set('photoUrl', await uploadPhoto(f)); } finally { setBusy(false); }
  };
  const save = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true);
    try { await saveMe({ ...profile, expertise: profile.expertise, year: Number(profile.year) }); setSaved(true); setHasPending(true); }
    catch (err: any) { setError(err.message); } finally { setBusy(false); }
  };

  if (!authed) return (
    <div style={{ maxWidth: 380, margin: '80px auto', fontFamily: 'Inter, sans-serif' }}>
      <h2>Speaker Portal</h2>
      <form onSubmit={login}>
        <input type="password" placeholder="Password from your email" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: 12, margin: '12px 0' }} />
        <button type="submit" style={{ padding: '10px 18px' }}>Enter</button>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );

  return (
    <div style={{ maxWidth: 640, margin: '48px auto', fontFamily: 'Inter, sans-serif', padding: 16 }}>
      <h2>Your Speaker Profile</h2>
      {hasPending && <p style={{ background: '#fff7ed', border: '1px solid #fdba74', padding: 10 }}>Changes are awaiting admin approval.</p>}
      <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
        <input placeholder="First name" value={profile.firstName} onChange={(e) => set('firstName', e.target.value)} />
        <input placeholder="Last name" value={profile.lastName} onChange={(e) => set('lastName', e.target.value)} />
        <input placeholder="Title" value={profile.title} onChange={(e) => set('title', e.target.value)} />
        <input placeholder="Company" value={profile.company} onChange={(e) => set('company', e.target.value)} />
        <input placeholder="Country" value={profile.country} onChange={(e) => set('country', e.target.value)} />
        <input placeholder="LinkedIn URL" value={profile.linkedin} onChange={(e) => set('linkedin', e.target.value)} />
        <select value={profile.type} onChange={(e) => set('type', e.target.value)}>
          {SPEAKER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input placeholder="Year" type="number" value={profile.year} onChange={(e) => set('year', e.target.value)} />
        <input placeholder="Expertise (comma separated)" value={profile.expertise.join(', ')} onChange={(e) => set('expertise', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
        <textarea placeholder="Bio" value={profile.bio} onChange={(e) => set('bio', e.target.value)} rows={5} />
        <div>
          {profile.photoUrl && <img src={profile.photoUrl} alt="" style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }} />}
          <input type="file" accept="image/*" onChange={onPhoto} />
        </div>
        <button type="submit" disabled={busy}>{busy ? 'Working...' : 'Save (pending admin approval)'}</button>
        {saved && <p style={{ color: 'green' }}>Saved. Awaiting admin approval.</p>}
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
      </form>
    </div>
  );
}
```

- [ ] **Step 2: Add the route**

In `web/src/App.tsx`: add `import { SpeakerPortal } from './pages/SpeakerPortal'` and inside `<Routes>` add:

```tsx
      <Route path="/speaker/:token" element={<SpeakerPortal />} />
```

- [ ] **Step 3: Make the public hub load from the API (with static fallback)**

In `web/src/pages/SpeakerHub.tsx`: keep the `SPEAKERS` import as the fallback. Add state and an effect that fetches the API and replaces the source:

```tsx
import { getPublicSpeakers } from '../lib/api';
// ...
const [remote, setRemote] = useState<Speaker[] | null>(null);
useEffect(() => {
  getPublicSpeakers().then((d) => setRemote(d.speakers)).catch(() => setRemote(null));
}, []);
const source = remote ?? SPEAKERS;
// replace the `SPEAKERS.filter(...)` in the portalSpeakers memo with `source.filter(...)`
// and add `source` to that memo's dependency array.
```

- [ ] **Step 4: Build to confirm it compiles**

Run: `cd /Users/apple/Event-Planner-Expo/web && npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add web/src/pages/SpeakerPortal.tsx web/src/App.tsx web/src/pages/SpeakerHub.tsx
git commit -m "feat: speaker portal page, route, public hub loads from API" --author="Mehroz <mehroz.muneer@gmail.com>"
```

---

### Task 8: Deploy config, env docs, and end-to-end verification

**Files:**
- Create: `docs/SETUP.md`
- Modify: none (deploy + manual verification)

- [ ] **Step 1: Write the setup doc (the accounts the client must create)**

Create `docs/SETUP.md`:

```markdown
# Backend setup (one time)

Set these in Vercel > Project > Settings > Environment Variables:

- `DATABASE_URL` — Neon connection string (Neon.tech > create project > copy the pooled connection string).
- `RESEND_API_KEY` — Resend.com > API Keys.
- `RESEND_FROM` — a verified sender, e.g. `Speakers <speakers@yourdomain.com>` (verify the domain in Resend first).
- `BLOB_READ_WRITE_TOKEN` — Vercel > Storage > create a Blob store > connect to this project (token is injected, or copy it).
- `ADMIN_PASSWORD` — the admin panel password.
- `JWT_SECRET` — any long random string.
- `APP_URL` — the site's URL, e.g. `https://event-planner-expo-dusky.vercel.app`.

Then run the schema once against Neon:
`psql "$DATABASE_URL" -f db/schema.sql`  (or paste db/schema.sql into the Neon SQL editor).
```

- [ ] **Step 2: Run the full API test suite one final time**

Run: `cd /Users/apple/Event-Planner-Expo && npm test`
Expected: all passing.

- [ ] **Step 3: Build the frontend**

Run: `cd /Users/apple/Event-Planner-Expo/web && npm run build`
Expected: succeeds.

- [ ] **Step 4: Commit + push**

```bash
git add docs/SETUP.md
git commit -m "docs: backend setup instructions" --author="Mehroz <mehroz.muneer@gmail.com>"
git push origin main
```

- [ ] **Step 5: Deploy (after the client sets env vars + runs the schema)**

Run: `cd /Users/apple/Event-Planner-Expo && vercel deploy --prod --yes --scope muhammadmehroz786s-projects --name event-planner-expo`
Expected: READY.

- [ ] **Step 6: Manual end-to-end on the live URL**

1. Admin: `/login` with `ADMIN_PASSWORD` → `/admin` → Invite (your own email).
2. Check the email; open the `/speaker/<token>` link; log in with the emailed password.
3. Fill the profile + upload a photo; Save → see the "awaiting approval" banner.
4. Admin: `/admin` → Pending queue shows the speaker → Approve.
5. Public `/` (2026 speakers) → the speaker now appears with their photo.
6. Speaker: edit again → banner returns → public still shows the previous approved version until re-approved.
