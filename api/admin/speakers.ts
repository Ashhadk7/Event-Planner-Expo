import { query } from "../_lib/db.js";
import { withErrors } from "../_lib/handler.js";
import { requireAdmin } from "../_lib/auth.js";

const handler = async (req: any, res: any) => {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  if (!requireAdmin(req)) return res.status(401).json({ error: "Admin auth required" });
  const rows = await query<{ id: string; email: string; status: string; has_pending: boolean; approved_data: any; pending_data: any; created_at: string }>(
    `select id, email, status, has_pending, approved_data, pending_data, created_at from speakers order by created_at desc`
  );
  return res.status(200).json({ speakers: rows });
}

export default withErrors(handler);
