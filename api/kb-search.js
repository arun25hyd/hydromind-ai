// /api/kb-search.js — Semantic vector search
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { query, limit = 5, category } = req.body;
  if (!query) return res.status(400).json({ error: 'query required' });

  try {
    const embResp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: query.replace(/\n/g, ' '), dimensions: 1536 })
    });
    if (!embResp.ok) { const e = await embResp.json(); return res.status(500).json({ error: e.error?.message }); }
    const embData = await embResp.json();

    const { data, error } = await getSupabase().rpc('search_kb', {
      query_embedding: embData.data[0].embedding,
      match_count: Math.min(parseInt(limit)||5, 20),
      filter_category: category || null
    });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ results: data||[], query, count: (data||[]).length });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
