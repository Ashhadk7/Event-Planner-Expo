import { query } from "../_lib/db.ts";
import { withErrors } from "../_lib/handler.ts";
import { bearer } from "../_lib/auth.ts";
import { validateProfile } from "../_lib/profile.ts";

const handler = async (req: any, res: any) => {
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

export default withErrors(handler);
