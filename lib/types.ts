// Database types
export interface Conversation {
  id: string;
  session_id: string;
  status: 'active' | 'closed' | 'archived';
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_used?: number;
  model?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// API types
export interface ChatRequest {
  message: string;
  sessionId?: string;
}

export interface ChatResponse {
  reply: string;
  sessionId: string;
}

export interface ChatHistoryResponse {
  sessionId: string;
  messages: Array<{
    role: MessageRole;
    content: string;
    timestamp: string;
  }>;
}

// LLM types
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

export interface LLMCompletionResult {
  content: string;
  tokensUsed: number;
  model: string;
  finishReason: string;
}

// Error types
export interface APIErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}
