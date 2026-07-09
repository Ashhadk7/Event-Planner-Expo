import { describe, it, expect } from "vitest";

describe("db module", () => {
  it("exports a query function", async () => {
    process.env.DATABASE_URL = "postgres://user:pass@localhost/db";
    const mod = await import("../../api/_lib/db.ts");
    expect(typeof mod.query).toBe("function");
  });
});
