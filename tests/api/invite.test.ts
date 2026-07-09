import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.ADMIN_PASSWORD = "pw"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

describe("admin login", () => {
  it("rejects wrong password", async () => {
    const { default: login } = await import("../../api/admin/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: { password: "nope" } }, res);
    expect(res.statusCode).toBe(401);
  });
  it("issues a token for the right password", async () => {
    const { default: login } = await import("../../api/admin/login.ts");
    const res = mockRes();
    await login({ method: "POST", body: { password: "pw" } }, res);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body.token).toBe("string");
  });
});

describe("invite guard", () => {
  it("rejects without admin token", async () => {
    const { default: invite } = await import("../../api/admin/invite.ts");
    const res = mockRes();
    await invite({ method: "POST", headers: {}, body: { firstName: "A", lastName: "B", email: "a@b.co" } }, res);
    expect(res.statusCode).toBe(401);
  });
});
