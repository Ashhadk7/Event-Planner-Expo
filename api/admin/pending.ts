import { query } from "../_lib/db.ts";
import { withErrors } from "../_lib/handler.ts";
import { requireAdmin } from "../_lib/auth.ts";

const handler = async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const rows = await query<{ id: string; approved_data: any; pending_data: any; email: string }>(
    `select id, email, approved_data, pending_data from speakers where has_pending = true order by updated_at desc`
  );
  return res.status(200).json({
    pending: rows.map((r) => ({ id: r.id, email: r.email, approved: r.approved_data, pending: r.pending_data })),
  });
}

export default withErrors(handler);
