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
