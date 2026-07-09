import { Pool } from "@neondatabase/serverless";

// Lazily create the Neon Pool on first use, not at module load. Creating it at
// import time crashed any test that merely imports a handler, and would fail a
// cold start with an opaque error if DATABASE_URL were missing. Now a clear
// error is thrown only when a query is actually attempted without the env var.
//
// We use Pool.query() (the node-postgres-compatible interface) rather than the
// tagged-template neon() helper: Pool.query(text, params) is the documented,
// stable way to run a parameterized query over Neon's low-latency HTTP and
// always returns a { rows } result.
let _pool: Pool | null = null;

function pool(): Pool {
  if (!_pool) {
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  return _pool;
}

/** Run a parameterized query. Returns the result rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool().query(text, params);
  return result.rows as T[];
}
