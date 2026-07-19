// /api/kb-documents.js — List and delete KB documents
import { requireAdmin, setCors } from './_admin-auth.js';

export default async function handler(req, res) {
  setCors(res, 'GET, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const auth = await requireAdmin(req);
  if (!auth) return res.status(403).json({ error: 'Administrator access required' });

  const { supabase } = auth;

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
