import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  console.log('QR scan handler called!');
  console.log('Environment check:', {
    hasUrl: !!process.env.VITE_SUPABASE_URL,
    hasKey: !!process.env.SUPABASE_SERVICE_KEY
  });

  // Always redirect, even if Supabase fails
  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error } = await supabase
        .from('qr_scans')
        .insert({ scanned_at: new Date().toISOString() });

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Successfully logged QR scan');
      }
    } else {
      console.log('Supabase not configured, skipping DB insert');
    }
  } catch (e) {
    console.error('Handler error:', e);
  }

  // Always redirect regardless of DB success/failure
  console.log('Redirecting to homepage');
  res.redirect(307, '/');
}