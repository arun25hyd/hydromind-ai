// Retired: production traffic uses the rate-limited Render backend at
// /api/chat. Keeping a second unauthenticated provider-key proxy here would
// create an unbounded spend and abuse path.
export default function handler(req, res) {
  return res.status(410).json({ error: 'This endpoint has been retired.' });
}
