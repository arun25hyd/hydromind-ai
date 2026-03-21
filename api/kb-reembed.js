// /api/kb-reembed.js — Re-embed existing chunks with NULL embedding
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}
async function verifyUser(req) {
  const auth = req.headers.authorization || '';
  let email = auth.startsWith('Email ') ? auth.replace('Email ', '').trim() : req.body?.userEmail;
  if (!email) return null;
  const { data } = await getSupabase().from('users').select('id, is_premium').eq('email', email.toLowerCase()).maybeSingle();
  return data?.is_premium ? data : null;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: 'Premium account required' });

  const supabase = getSupabase();
  const { data: chunks, error } = await supabase.from('kb_chunks').select('id, content').is('embedding', null);
  if (error) return res.status(500).json({ error: error.message });
  if (!chunks || chunks.length === 0) {
    return res.status(200).json({ success: true, message: 'All chunks already embedded.', count: 0 });
  }

  res.status(200).json({ success: true, message: `Re-embedding ${chunks.length} chunks in background (~30 seconds).`, count: chunks.length });

  (async () => {
    try {
      const BATCH = 100;
      for (let i = 0; i < chunks.length; i += BATCH) {
        const batch = chunks.slice(i, i + BATCH);
        const texts = batch.map(c => c.content.replace(/\n/g, ' '));
        const embResp = await fetch('https://api.openai.com/v1/embeddings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
          body: JSON.stringify({ model: 'text-embedding-3-small', input: texts, dimensions: 1536 })
        });
        if (!embResp.ok) continue;
        const embData = await embResp.json();
        const sorted = embData.data.sort((a, b) => a.index - b.index);
        for (let j = 0; j < batch.length; j++) {
          await supabase.from('kb_chunks').update({ embedding: `[${sorted[j].embedding.join(',')}]` }).eq('id', batch[j].id);
        }
        if (i + BATCH < chunks.length) await new Promise(r => setTimeout(r, 300));
      }
      console.log('[kb-reembed] Complete');
    } catch (err) { console.error('[kb-reembed]', err.message); }
  })();
}
