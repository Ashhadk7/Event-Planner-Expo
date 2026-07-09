import { describe, it, expect } from "vitest";

const valid = {
  firstName: "Mario", lastName: "Stewart", title: "Founder & CEO",
  company: "Stewart Experiential", country: "United States",
  bio: "Bio here", expertise: ["Experiential"], photoUrl: "",
  linkedin: "https://linkedin.com/in/x", type: "Founder", year: 2026,
};

describe("validateProfile", () => {
  it("accepts a well formed profile", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile(valid);
    expect(r.ok).toBe(true);
  });

  it("rejects a missing required field", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, firstName: "" });
    expect(r.ok).toBe(false);
  });

  it("rejects an invalid speaker type", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, type: "Wizard" });
    expect(r.ok).toBe(false);
  });

  it("coerces expertise to an array and year to a number", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    const r = validateProfile({ ...valid, expertise: undefined, year: "2026" });
    expect(r.ok).toBe(true);
    if (r.ok) { expect(Array.isArray(r.value.expertise)).toBe(true); expect(r.value.year).toBe(2026); }
  });
});

describe("validateProfile year edge cases", () => {
  const base = {
    firstName: "Mario", lastName: "Stewart", title: "Founder & CEO",
    company: "Stewart Experiential", country: "United States",
    bio: "Bio", expertise: ["Experiential"], photoUrl: "",
    linkedin: "https://linkedin.com/in/x", type: "Founder",
  };
  it("rejects an empty-string year (would coerce to 0)", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    expect(validateProfile({ ...base, year: "" }).ok).toBe(false);
  });
  it("rejects a missing year", async () => {
    const { validateProfile } = await import("../../api/_lib/profile.ts");
    expect(validateProfile({ ...base }).ok).toBe(false);
  });
});
