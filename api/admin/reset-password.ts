import { query } from "../_lib/db.js";
import { withErrors } from "../_lib/handler.js";
import { requireAdmin, hashPassword } from "../_lib/auth.js";

const handler = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const { invite_token, password } = req.body ?? {};
  if (!invite_token || !password) return res.status(400).json({ error: "invite_token and password required" });
  const hash = await hashPassword(password);
  const rows = await query<{ id: string }>(
    `update speakers set password_hash = $1, updated_at = now() where invite_token = $2 returning id`,
    [hash, invite_token]
  );
  if (rows.length === 0) return res.status(404).json({ error: "No speaker found with that token" });
  return res.status(200).json({ ok: true, id: rows[0].id });
}

export default withErrors(handler);
