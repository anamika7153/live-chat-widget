import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const checks = {
    database: false,
    openai: false,
  };

  // Check Supabase connection
  try {
    const { error } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  // Check OpenAI API key is configured
  checks.openai = !!process.env.OPENAI_API_KEY;

  const isHealthy = Object.values(checks).every(Boolean);

  return res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
}
