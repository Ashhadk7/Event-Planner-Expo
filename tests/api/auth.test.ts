import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; });

describe("auth", () => {
  it("hashes and verifies a password", async () => {
    const { hashPassword, verifyPassword } = await import("../../api/_lib/auth.ts");
    const h = await hashPassword("hunter2");
    expect(h).not.toBe("hunter2");
    expect(await verifyPassword("hunter2", h)).toBe(true);
    expect(await verifyPassword("wrong", h)).toBe(false);
  });

  it("signs and verifies a JWT round trip", async () => {
    const { signToken, verifyToken } = await import("../../api/_lib/auth.ts");
    const t = signToken({ sub: "abc", role: "speaker" });
    expect(verifyToken<{ sub: string }>(t)?.sub).toBe("abc");
    expect(verifyToken("garbage")).toBeNull();
  });

  it("random token and password are non empty and unique", async () => {
    const { randomToken, randomPassword } = await import("../../api/_lib/auth.ts");
    expect(randomToken()).not.toBe(randomToken());
    expect(randomPassword().length).toBeGreaterThanOrEqual(10);
  });
});
