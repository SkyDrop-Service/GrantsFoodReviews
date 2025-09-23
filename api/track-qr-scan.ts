import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY are required.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    // Insert a record into a 'qr_scans' table
    const { error } = await supabase
      .from('qr_scans')
      .insert({ scanned_at: new Date().toISOString() });

    if (error) {
      console.error('Supabase error:', error);
      // Still redirect even if logging fails
    }
  } catch (e) {
    console.error('Handler error:', e);
  }

  res.redirect(307, '/');
}