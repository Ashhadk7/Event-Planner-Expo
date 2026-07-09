import { signToken } from "../_lib/auth.ts";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const password = req.body?.password;
  if (typeof password !== "string" || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Incorrect password" });
  }
  return res.status(200).json({ token: signToken({ role: "admin" }) });
}
