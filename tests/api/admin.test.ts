import { describe, it, expect, beforeAll } from "vitest";

beforeAll(() => { process.env.JWT_SECRET = "test-secret"; process.env.DATABASE_URL = "postgres://u:p@localhost/d"; });

function mockRes() {
  return { statusCode: 0, body: null as any,
    status(c: number) { this.statusCode = c; return this; },
    json(b: any) { this.body = b; return this; } };
}

for (const name of ["pending", "approve", "reject"]) {
  describe(`admin ${name} guard`, () => {
    it("rejects without admin token", async () => {
      const { default: h } = await import(`../../api/admin/${name}.ts`);
      const res = mockRes();
      const method = name === "pending" ? "GET" : "POST";
      await h({ method, headers: {}, body: { id: "x" } }, res);
      expect(res.statusCode).toBe(401);
    });
  });
}

describe("approve requires id", () => {
  it("400s without id when admin", async () => {
    const { signToken } = await import("../../api/_lib/auth.ts");
    const { default: approve } = await import("../../api/admin/approve.ts");
    const res = mockRes();
    await approve({ method: "POST", headers: { authorization: "Bearer " + signToken({ role: "admin" }) }, body: {} }, res);
    expect(res.statusCode).toBe(400);
  });
});
