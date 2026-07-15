import { query } from "../_lib/db.js";
import { withErrors } from "../_lib/handler.js";
import { requireAdmin } from "../_lib/auth.js";

const handler = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const { id } = req.body ?? {};
  if (!id) return res.status(400).json({ error: "id is required" });
  const rows = await query<{ id: string }>(
    `delete from speakers where id = $1 returning id`, [id]
  );
  if (rows.length === 0) return res.status(404).json({ error: "No speaker with that id" });
  return res.status(200).json({ ok: true });
};

export default withErrors(handler);
