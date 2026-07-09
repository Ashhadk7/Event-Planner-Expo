import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";

export function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 10);
}
export function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}
export function signToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "2h" });
}
export function verifyToken<T>(token: string): T | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as T;
  } catch {
    return null;
  }
}
export function randomToken(): string {
  return randomBytes(24).toString("hex");
}
export function randomPassword(): string {
  // readable-ish 12 char password
  return randomBytes(9).toString("base64url").slice(0, 12);
}

/** Extract "Authorization: Bearer <jwt>" and return the decoded payload, or null. */
export function bearer<T>(req: { headers: Record<string, string | string[] | undefined> }): T | null {
  const raw = req.headers["authorization"];
  const h = Array.isArray(raw) ? raw[0] : raw;
  if (!h || !h.startsWith("Bearer ")) return null;
  return verifyToken<T>(h.slice(7));
}
export function requireAdmin(req: { headers: Record<string, string | string[] | undefined> }): boolean {
  return bearer<{ role?: string }>(req)?.role === "admin";
}
