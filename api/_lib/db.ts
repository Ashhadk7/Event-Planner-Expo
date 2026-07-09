import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

/** Run a parameterized query. Returns the result rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  return (await sql.query(text, params)) as T[];
}

export { sql };
