const ADMIN_KEY = "epx_admin_jwt";
const SPEAKER_KEY = "epx_speaker_jwt";

async function jsonFetch(url: string, opts: RequestInit = {}) {
  const res = await fetch(url, { ...opts, headers: { "Content-Type": "application/json", ...(opts.headers || {}) } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const adminToken = () => localStorage.getItem(ADMIN_KEY);
export const speakerToken = () => localStorage.getItem(SPEAKER_KEY);
const adminAuth = () => ({ Authorization: `Bearer ${adminToken()}` });
const speakerAuth = () => ({ Authorization: `Bearer ${speakerToken()}` });

export async function adminLogin(password: string) {
  const d = await jsonFetch("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
  localStorage.setItem(ADMIN_KEY, d.token);
}
export const adminLogout = () => localStorage.removeItem(ADMIN_KEY);
export const invite = (firstName: string, lastName: string, email: string) =>
  jsonFetch("/api/admin/invite", { method: "POST", headers: adminAuth(), body: JSON.stringify({ firstName, lastName, email }) });
export const getPending = () => jsonFetch("/api/admin/pending", { headers: adminAuth() });
export const approve = (id: string) => jsonFetch("/api/admin/approve", { method: "POST", headers: adminAuth(), body: JSON.stringify({ id }) });
export const reject = (id: string) => jsonFetch("/api/admin/reject", { method: "POST", headers: adminAuth(), body: JSON.stringify({ id }) });

export async function speakerLogin(token: string, password: string) {
  const d = await jsonFetch("/api/speaker/login", { method: "POST", body: JSON.stringify({ token, password }) });
  localStorage.setItem(SPEAKER_KEY, d.token);
}
export const getMe = () => jsonFetch("/api/speaker/me", { headers: speakerAuth() });
export const saveMe = (profile: unknown) => jsonFetch("/api/speaker/me", { method: "PUT", headers: speakerAuth(), body: JSON.stringify(profile) });
export async function uploadPhoto(file: File): Promise<string> {
  const res = await fetch("/api/speaker/photo", { method: "POST", headers: { "Content-Type": file.type, Authorization: `Bearer ${speakerToken()}` }, body: file });
  const d = await res.json();
  if (!res.ok) throw new Error(d.error || "Upload failed");
  return d.url;
}
export const getPublicSpeakers = () => jsonFetch("/api/speakers");
