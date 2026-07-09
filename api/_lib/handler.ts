// Wrap a serverless handler so an unexpected throw (DB/Blob transport error,
// etc.) returns a clean JSON 500 instead of a raw stack trace. The spec
// requires that a request never 500s silently with internals leaked; input
// validation still returns its own 4xx before anything here fires.
export function withErrors(
  fn: (req: any, res: any) => Promise<any>
): (req: any, res: any) => Promise<any> {
  return async (req: any, res: any) => {
    try {
      return await fn(req, res);
    } catch (e) {
      // Log server-side for debugging; never send the error detail to the client.
      console.error("handler error:", e);
      return res.status(500).json({ error: "Server error" });
    }
  };
}
