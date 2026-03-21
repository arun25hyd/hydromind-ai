// /api/kb-upload.js — Upload PDF, chunk, embed, store
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

async function extractText(base64) {
  const { default: pdfParse } = await import('pdf-parse/lib/pdf-parse.js');
  const buffer = Buffer.from(base64, 'base64');
  const data = await pdfParse(buffer);
  return { text: data.text, pageCount: data.numpages };
}

function chunkText(text, docName) {
  const CHUNK = 2000; const OVERLAP = 200;
  const cleaned = text.replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').replace(/[ \t]+/g, ' ').trim();
  const chunks = []; let start = 0; let index = 0;
  while (start < cleaned.length) {
    let end = start + CHUNK;
    if (end < cleaned.length) { const bp = cleaned.lastIndexOf('. ', end); if (bp > start + CHUNK * 0.5) end = bp + 1; }
    const content = cleaned.slice(start, end).trim();
    if (content.length > 50) { chunks.push({ content, chunkIndex: index, docName }); index++; }
    start = end - OVERLAP; if (start <= 0) start = end;
  }
  return chunks;
}

async function generateEmbeddings(texts) {
  const BATCH = 100; const all = [];
  for (let i = 0; i < texts.length; i += BATCH) {
    const batch = texts.slice(i, i + BATCH).map(t => t.replace(/\n/g, ' '));
    const resp = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: 'text-embedding-3-small', input: batch, dimensions: 1536 })
    });
    if (!resp.ok) { const e = await resp.json(); throw new Error('OpenAI: ' + (e.error?.message || resp.status)); }
    const data = await resp.json();
    all.push(...data.data.sort((a,b)=>a.index-b.index).map(d=>d.embedding));
    if (i + BATCH < texts.length) await new Promise(r => setTimeout(r, 250));
  }
  return all;
}

export default async function handler(req, res) {
  setCORS(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = await verifyUser(req);
  if (!user) return res.status(401).json({ error: 'Premium account required' });

  const { fileName, fileBase64, category, description } = req.body;
  if (!fileName || !fileBase64) return res.status(400).json({ error: 'fileName and fileBase64 required' });

  const docName = fileName.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9\s\-_]/g, '').trim();
  const supabase = getSupabase();

  const { data: existing } = await supabase.from('kb_documents').select('id').eq('name', docName).maybeSingle();
  if (existing) return res.status(409).json({ error: `"${docName}" already exists. Delete it first.` });

  const { data: doc, error: docErr } = await supabase
    .from('kb_documents')
    .insert({ name: docName, category: category||'General', description: description||'', uploaded_by: user.id, status: 'processing' })
    .select().single();
  if (docErr) return res.status(500).json({ error: docErr.message });

  try {
    const { text, pageCount } = await extractText(fileBase64);
    if (!text || text.trim().length < 100) {
      await supabase.from('kb_documents').delete().eq('id', doc.id);
      return res.status(422).json({ error: 'Cannot extract text — PDF may be scanned/image-based.' });
    }

    const chunks = chunkText(text, docName);
    const embeddings = await generateEmbeddings(chunks.map(c => c.content));

    const rows = chunks.map((chunk, i) => ({
      doc_id: doc.id, doc_name: docName, category: category||'General',
      content: chunk.content, chunk_index: chunk.chunkIndex,
      embedding: `[${embeddings[i].join(',')}]`
    }));

    for (let i = 0; i < rows.length; i += 50) {
      const { error: ce } = await supabase.from('kb_chunks').insert(rows.slice(i, i+50));
      if (ce) throw new Error('Chunk insert: ' + ce.message);
    }

    await supabase.from('kb_documents').update({ page_count: pageCount, char_count: text.length, chunk_count: chunks.length, status: 'ready' }).eq('id', doc.id);

    return res.status(200).json({ success: true, document: { id: doc.id, name: docName, pageCount, chunkCount: chunks.length, category: category||'General', status: 'ready' } });

  } catch (err) {
    await supabase.from('kb_documents').update({ status: 'error' }).eq('id', doc.id);
    console.error('[kb-upload]', err.message);
    return res.status(500).json({ error: 'Processing failed: ' + err.message });
  }
}

export const config = { api: { bodyParser: { sizeLimit: '50mb' } } };
