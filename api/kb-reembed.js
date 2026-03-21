// ============================================================
// /api/kb-reembed.js — Re-embed existing chunks (one-time use)
// POST: finds all chunks with NULL embedding, generates new
//       OpenAI 1536-dim vectors, updates each chunk in DB
// Auth: premium user required
// ============================================================

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY
  );
}

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

async function verifyAuth(req) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  const supabase = getSupabase();
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) return null;
  const { data: profile } = await supabase
    .from('users')
    .select('id, is_premium')
    .eq('id', user.id)
    .single();
  return profile;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await verifyAuth(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });
  if (!user.is_premium) return res.status(403).json({ error: 'Premium required' });

  const supabase = getSupabase();

  // Fetch all chunks with no embedding
  const { data: chunks, error } = await supabase
    .from('kb_chunks')
    .select('id, content, doc_name')
    .is('embedding', null);

  if (error) return res.status(500).json({ error: error.message });

  if (!chunks || chunks.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'All chunks already have embeddings. Nothing to do.',
      count: 0
    });
  }

  // Respond immediately — re-embedding runs in background
  res.status(200).json({
    success: true,
    message: `Re-embedding ${chunks.length} chunks in background. Takes ~30 seconds.`,
    count: chunks.length
  });

  // Background processing
  (async () => {
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
          body: JSON.stringify({
            model: 'text-embedding-3-small',
            input: texts,
            dimensions: 1536
          })
        });

        if (!embResp.ok) {
          const err = await embResp.json();
          console.error('[reembed] OpenAI error:', err.error?.message);
          continue;
        }

        const embData = await embResp.json();
        const sorted = embData.data.sort((a, b) => a.index - b.index);

        // Update each chunk with new embedding
        for (let j = 0; j < batch.length; j++) {
          const vectorStr = `[${sorted[j].embedding.join(',')}]`;
          await supabase
            .from('kb_chunks')
            .update({ embedding: vectorStr })
            .eq('id', batch[j].id);
          done++;
        }

        // Small delay between batches
        if (i + BATCH < chunks.length) {
          await new Promise(r => setTimeout(r, 300));
        }
      }

      console.log(`[kb-reembed] Complete — ${done}/${chunks.length} chunks re-embedded`);

    } catch (err) {
      console.error('[kb-reembed] Background error:', err.message);
    }
  })();
}
