import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processMessage } from '../../lib/services/chat-service.js';
import { formatErrorResponse } from '../../lib/utils/errors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only POST method is allowed' },
    });
  }

  try {
    const { message, sessionId } = req.body;

    const result = await processMessage({ message, sessionId });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Chat message error:', error);
    const { statusCode, body } = formatErrorResponse(error);
    return res.status(statusCode).json(body);
  }
}
