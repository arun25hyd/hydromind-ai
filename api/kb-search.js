// Retired: no production page calls this Vercel function. Semantic search is
// served by the rate-limited backend, so this route must not spend OpenAI
// credits or expose the service-role client to unauthenticated callers.
export default function handler(req, res) {
  return res.status(410).json({ error: 'This endpoint has been retired.' });
}
