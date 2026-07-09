const SPEAKER_TYPES = ["Main Day", "Fireside Chat", "Founder", "Influencer", "Ambassador", "Sponsor"];

export interface Profile {
  firstName: string;
  lastName: string;
  title: string;
  company: string;
  country: string;
  bio: string;
  expertise: string[];
  photoUrl: string;
  linkedin: string;
  type: string;
  year: number;
}

type Result = { ok: true; value: Profile } | { ok: false; error: string };

export function validateProfile(input: unknown): Result {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Body must be an object" };
  const b = input as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string).trim() : "");

  for (const k of ["firstName", "lastName", "title", "company"]) {
    if (!str(k)) return { ok: false, error: `${k} is required` };
  }
  const type = str("type");
  if (!SPEAKER_TYPES.includes(type)) return { ok: false, error: `type must be one of ${SPEAKER_TYPES.join(", ")}` };

  const year = Number(b.year);
  if (!Number.isFinite(year)) return { ok: false, error: "year must be a number" };

  const expertise = Array.isArray(b.expertise)
    ? (b.expertise as unknown[]).map(String).filter(Boolean)
    : [];

  return {
    ok: true,
    value: {
      firstName: str("firstName"), lastName: str("lastName"), title: str("title"),
      company: str("company"), country: str("country"), bio: str("bio"),
      expertise, photoUrl: str("photoUrl"), linkedin: str("linkedin"),
      type, year,
    },
  };
}
