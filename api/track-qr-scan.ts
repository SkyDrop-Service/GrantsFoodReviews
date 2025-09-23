import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initialize Supabase client
// Note: Use the SERVICE_ROLE_KEY for write access on the server.
// Store these in your Vercel project's Environment Variables.
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Key are required.');
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

  // Redirect the user to the homepage
  // Using a 307 (Temporary Redirect) is appropriate here.
  res.redirect(307, '/');
}