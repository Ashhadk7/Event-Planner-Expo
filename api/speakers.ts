import { query } from "./_lib/db.ts";

function slugify(first: string, last: string) {
  return `${first ?? ""}-${last ?? ""}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const rows = await query<{ id: string; approved_data: any }>(
      `select id, approved_data from speakers where approved_data is not null order by created_at asc`
    );
    const speakers = rows.map((r) => ({
      id: r.id,
      slug: slugify(r.approved_data?.firstName, r.approved_data?.lastName),
      ...r.approved_data,
    }));
    return res.status(200).json({ speakers });
  } catch {
    return res.status(200).json({ speakers: [] }); // never break the public page
  }
}
