import { query } from "../_lib/db.js";
import { requireAdmin, hashPassword, randomToken, randomPassword } from "../_lib/auth.js";
import { sendInviteEmail } from "../_lib/email.js";
import { withErrors } from "../_lib/handler.js";

type Row = { firstName: string; lastName: string; email: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Parse CSV text into invite rows. Accepts a header line in any column order
 *  containing firstName/first name, lastName/last name and email; without a
 *  recognizable header, assumes firstName,lastName,email column order. */
function parseCsv(text: string): { rows: Row[]; errors: string[] } {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const errors: string[] = [];
  if (!lines.length) return { rows: [], errors: ["CSV is empty"] };

  const split = (line: string) =>
    line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
  const header = split(lines[0]).map(norm);
  let idx = { first: 0, last: 1, email: 2 };
  let start = 0;
  const fi = header.findIndex((h) => ["firstname", "first"].includes(h));
  const li = header.findIndex((h) => ["lastname", "last", "surname"].includes(h));
  const ei = header.findIndex((h) => ["email", "emailaddress", "mail"].includes(h));
  if (fi !== -1 && li !== -1 && ei !== -1) {
    idx = { first: fi, last: li, email: ei };
    start = 1;
  }

  const rows: Row[] = [];
  for (let i = start; i < lines.length; i++) {
    const cols = split(lines[i]);
    const firstName = cols[idx.first] ?? "";
    const lastName = cols[idx.last] ?? "";
    const email = (cols[idx.email] ?? "").toLowerCase();
    if (!firstName || !lastName || !email) {
      errors.push(`Line ${i + 1}: missing name or email`);
      continue;
    }
    if (!EMAIL_RE.test(email)) {
      errors.push(`Line ${i + 1}: invalid email "${email}"`);
      continue;
    }
    rows.push({ firstName, lastName, email });
  }
  return { rows, errors };
}

const handler = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });

  const csv = req.body?.csv;
  if (typeof csv !== "string" || !csv.trim()) {
    return res.status(400).json({ error: "csv (text) is required" });
  }

  const { rows, errors } = parseCsv(csv);
  if (!rows.length) {
    return res.status(400).json({ error: "No valid rows found", details: errors });
  }
  if (rows.length > 500) {
    return res.status(400).json({ error: "Maximum 500 invites per upload" });
  }

  // skip emails that already have a speaker row, so re-uploading the same
  // sheet never creates duplicates
  const existing = await query<{ email: string }>(
    `select lower(email) as email from speakers where lower(email) = any($1)`,
    [rows.map((r) => r.email)]
  );
  const seen = new Set(existing.map((r) => r.email));

  let invited = 0;
  const skipped: string[] = [];
  const emailFailed: string[] = [];

  for (const r of rows) {
    if (seen.has(r.email)) {
      skipped.push(r.email);
      continue;
    }
    seen.add(r.email); // also dedupes repeats inside the same CSV

    const token = randomToken();
    const password = randomPassword();
    const hash = await hashPassword(password);
    await query(
      `insert into speakers (invite_token, password_hash, email, status, pending_data, has_pending)
       values ($1, $2, $3, 'invited', $4, false)`,
      [token, hash, r.email, JSON.stringify({ firstName: r.firstName, lastName: r.lastName })]
    );
    invited++;

    const link = `${process.env.APP_URL}/speaker/${token}`;
    try {
      await sendInviteEmail(r.email, `${r.firstName} ${r.lastName}`, link, password);
    } catch {
      emailFailed.push(r.email); // row exists; admin can resend later
    }
  }

  return res.status(200).json({
    ok: true,
    invited,
    skipped,
    emailFailed,
    parseErrors: errors,
  });
};

export default withErrors(handler);
