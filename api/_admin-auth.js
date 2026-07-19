import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

export function getSupabase() {
  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    throw new Error('Supabase server configuration is missing');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
}

export function setCors(res, methods) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.hydromindai.com');
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', methods);
}

export async function requireAdmin(req) {
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
  if (!token) return null;

  // HydroMind issues its own JWTs (signed with JWT_SECRET, see Backend/server.js
  // login handler) — these are NOT Supabase Auth session tokens, so they must be
  // verified with the same secret/library the login endpoint used, not
  // supabase.auth.getUser().
  if (!process.env.JWT_SECRET) return null;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
  if (!decoded?.id) return null;

  const supabase = getSupabase();
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, is_admin')
    .eq('id', decoded.id)
    .maybeSingle();

  if (profileError || !profile?.is_admin) return null;
  return { supabase, user: profile };
}
