import { query } from "../_lib/db.js";
import { withErrors } from "../_lib/handler.js";
import { verifyPassword, signToken } from "../_lib/auth.js";

const handler = async (req: any, res: any) => {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { token, password } = req.body ?? {};
  if (!token || !password) return res.status(400).json({ error: "token and password required" });

  const rows = await query<{ id: string; password_hash: string }>(
    `select id, password_hash from speakers where invite_token = $1`, [token]
  );
  // same status + message for unknown token and wrong password, so responses
  // don't reveal whether an invite token exists
  if (rows.length === 0 || !(await verifyPassword(password, rows[0]?.password_hash ?? ""))) {
    return res.status(401).json({ error: "Invalid link or password" });
  }
  return res.status(200).json({ token: signToken({ sub: rows[0].id, role: "speaker" }) });
}

export default withErrors(handler);
