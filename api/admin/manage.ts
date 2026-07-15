import { query } from "../_lib/db.js";
import { withErrors } from "../_lib/handler.js";
import { requireAdmin, hashPassword } from "../_lib/auth.js";

// Consolidated admin utilities (kept as ONE function for the Vercel
// serverless-function limit): POST with an `action` field.
//   { action: "reset-password", invite_token, password }
//   { action: "delete", id }
const handler = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });

  const { action } = req.body ?? {};

  if (action === "reset-password") {
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

  if (action === "delete") {
    const { id } = req.body ?? {};
    if (!id) return res.status(400).json({ error: "id is required" });
    const rows = await query<{ id: string }>(
      `delete from speakers where id = $1 returning id`, [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "No speaker with that id" });
    return res.status(200).json({ ok: true });
  }

  return res.status(400).json({ error: "action must be reset-password or delete" });
};

export default withErrors(handler);
