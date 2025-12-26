import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getConversationHistory } from '../../../lib/services/chat-service.js';
import { formatErrorResponse, ValidationError } from '../../../lib/utils/errors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Only GET method is allowed' },
    });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== 'string') {
      throw new ValidationError('Session ID is required');
    }

    const result = await getConversationHistory(sessionId);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Chat history error:', error);
    const { statusCode, body } = formatErrorResponse(error);
    return res.status(statusCode).json(body);
  }
}
