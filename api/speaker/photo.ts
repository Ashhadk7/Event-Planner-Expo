import { put } from "@vercel/blob";
import { bearer } from "../_lib/auth.ts";

export const config = { api: { bodyParser: false } };

export default async function handler(req: any, res: any) {
  const payload = bearer<{ sub?: string; role?: string }>(req);
  if (!payload || payload.role !== "speaker" || !payload.sub) {
    return res.status(401).json({ error: "Speaker auth required" });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("image/")) return res.status(400).json({ error: "Body must be an image" });

  try {
    const blob = await put(`speakers/${payload.sub}-${Date.now()}.jpg`, req, {
      access: "public",
      contentType,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return res.status(200).json({ url: blob.url });
  } catch (e: any) {
    return res.status(500).json({ error: "Upload failed" });
  }
}
