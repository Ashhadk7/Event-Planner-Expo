import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.DATABASE_URL = "postgres://u:p@localhost/d"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

describe("speaker me guard", () => {
  it("rejects without a speaker token", async () => {
    const { default: me } = await import("../../api/speaker/me.ts");
    const res = mockRes();
    await me({ method: "GET", headers: {} }, res);
    expect(res.statusCode).toBe(401);
  });
  it("rejects an admin token on a speaker route", async () => {
    const { signToken } = await import("../../api/_lib/auth.ts");
    const { default: me } = await import("../../api/speaker/me.ts");
    const res = mockRes();
    await me({ method: "GET", headers: { authorization: "Bearer " + signToken({ role: "admin" }) } }, res);
    expect(res.statusCode).toBe(401);
  });
});

describe("speaker login validation", () => {
  it("400s without token/password", async () => {
    const { default: login } = await import("../../api/speaker/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: {} }, res);
    expect(res.statusCode).toBe(400);
  });
});
