import { requireAdmin, hashPassword, randomToken, randomPassword } from "../_lib/auth.ts";
import { sendInviteEmail } from "../_lib/email.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });

  const { firstName, lastName, email } = req.body ?? {};
  if (!firstName || !lastName || !email) return res.status(400).json({ error: "firstName, lastName and email are required" });

  // Lazy import to avoid DB connection at module load time (allows test isolation)
  const { query } = await import("../_lib/db.ts");

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
