import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

// Lazily create the Neon client on first use, not at module load. Creating it
// at import time crashed any test that merely imports a handler, and would fail
// a cold start with an opaque error if DATABASE_URL were missing. Now a clear
// error is thrown only when a query is actually attempted without the env var.
let _sql: NeonQueryFunction<false, false> | null = null;

function client(): NeonQueryFunction<false, false> {
  if (!_sql) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

/** Run a parameterized query. Returns the result rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  return (await client().query(text, params)) as T[];
}
