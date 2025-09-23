import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';


function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac os x') || ua.includes('macintosh')) os = 'macOS';
  else if (ua.includes('iphone')) os = 'iOS';
  else if (ua.includes('ipad')) os = 'iPadOS';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('linux')) os = 'Linux';
  
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  let deviceType = 'Desktop';
  if (ua.includes('mobile')) deviceType = 'Mobile';
  else if (ua.includes('tablet') || ua.includes('ipad')) deviceType = 'Tablet';
  
  return { os, browser, deviceType };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  console.log('QR scan handler called!');
  
  // Parse client information
  const userAgent = req.headers['user-agent'] || '';
  const clientInfo = parseUserAgent(userAgent);
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  
  console.log('Client info:', { ...clientInfo, userAgent, ipAddress });

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
      
      const { error } = await supabase
        .from('qr_scans')
        .insert({ 
          scanned_at: new Date().toISOString(),
          operating_system: clientInfo.os,
          browser: clientInfo.browser,
          device_type: clientInfo.deviceType,
          user_agent: userAgent,
          ip_address: ipAddress.toString().split(',')[0].trim() // Get first IP if multiple
        });

      if (error) {
        console.error('Supabase error:', error);
      } else {
        console.log('Successfully logged QR scan with client data');
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