import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import express from 'express';
import cors from 'cors';
import { processMessage, getConversationHistory } from './lib/services/chat-service';
import { supabase } from './lib/supabase';
import { formatErrorResponse, ValidationError } from './lib/utils/errors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', async (req, res) => {
  const checks = {
    database: false,
    openai: false,
  };

  try {
    const { error } = await supabase.from('conversations').select('id').limit(1);
    checks.database = !error;
  } catch {
    checks.database = false;
  }

  checks.openai = !!process.env.OPENAI_API_KEY;

  const isHealthy = Object.values(checks).every(Boolean);

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    checks,
  });
});

// Chat message endpoint
app.post('/api/chat/message', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const result = await processMessage({ message, sessionId });
    res.json(result);
  } catch (error) {
    console.error('Chat message error:', error);
    const { statusCode, body } = formatErrorResponse(error);
    res.status(statusCode).json(body);
  }
});

// Chat history endpoint
app.get('/api/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      throw new ValidationError('Session ID is required');
    }

    const result = await getConversationHistory(sessionId);
    res.json(result);
  } catch (error) {
    console.error('Chat history error:', error);
    const { statusCode, body } = formatErrorResponse(error);
    res.status(statusCode).json(body);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
