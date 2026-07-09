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
