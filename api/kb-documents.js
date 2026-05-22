// /api/kb-documents.js — List and delete KB documents
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
}
async function verifyUser(req) {
  const auth = req.headers.authorization || '';
  let email = auth.startsWith('Email ') ? auth.replace('Email ', '').trim() : null;
  if (!email) return null;
  const { data } = await getSupabase().from('users').select('id, is_premium').eq('email', email.toLowerCase()).maybeSingle();
  return data?.is_premium ? data : null;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: 'Premium account required' });

  const supabase = getSupabase();

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('kb_documents')
      .select('id, name, category, description, page_count, char_count, chunk_count, status, created_at')
      .order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ documents: data });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Document ID required' });
    await supabase.from('kb_chunks').delete().eq('doc_id', id);
    const { error } = await supabase.from('kb_documents').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
