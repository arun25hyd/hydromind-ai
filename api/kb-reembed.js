// /api/kb-reembed.js — Re-embed existing chunks (synchronous — Vercel compatible)
// NOTE: Vercel kills background tasks. This runs fully synchronous.
// For 75 chunks it takes ~20 seconds — within Vercel's 60s limit.

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
  const { data } = await getSupabase()
    .from('users').select('id, is_premium')
    .eq('email', email.toLowerCase()).maybeSingle();
  return data?.is_premium ? data : null;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: 'Premium account required' });

  const supabase = getSupabase();

  // Fetch all chunks with no embedding
  const { data: chunks, error } = await supabase
    .from('kb_chunks').select('id, content')
    .is('embedding', null);

  if (error) return res.status(500).json({ error: error.message });
  if (!chunks || chunks.length === 0) {
    return res.status(200).json({ success: true, message: 'All chunks already embedded.', count: 0 });
  }

  // Run SYNCHRONOUSLY — Vercel serverless requires this
  try {
    const BATCH = 100;
    let done = 0;

    for (let i = 0; i < chunks.length; i += BATCH) {
      const batch = chunks.slice(i, i + BATCH);
      const texts = batch.map(c => c.content.replace(/\n/g, ' '));

      const embResp = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: texts, dimensions: 1536 })
      });

      if (!embResp.ok) {
        const e = await embResp.json();
        return res.status(500).json({ error: 'OpenAI error: ' + (e.error?.message || embResp.status) });
      }

      const embData = await embResp.json();
      const sorted = embData.data.sort((a, b) => a.index - b.index);

      // Update each chunk
      for (let j = 0; j < batch.length; j++) {
        const vectorStr = `[${sorted[j].embedding.join(',')}]`;
        const { error: upErr } = await supabase
          .from('kb_chunks')
          .update({ embedding: vectorStr })
          .eq('id', batch[j].id);
        if (!upErr) done++;
      }
    }

    return res.status(200).json({
      success: true,
      message: `Successfully embedded ${done} of ${chunks.length} chunks.`,
      done,
      total: chunks.length
    });

  } catch (err) {
    console.error('[kb-reembed]', err.message);
    return res.status(500).json({ error: err.message });
  }
}

// Extend Vercel timeout to 60 seconds for this function
export const config = {
  api: {
    bodyParser: { sizeLimit: '1mb' },
    responseLimit: false,
    externalResolver: true
  },
  maxDuration: 60
};
