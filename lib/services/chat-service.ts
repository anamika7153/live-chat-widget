import { v4 as uuidv4 } from 'uuid';
import { ChatRequest, ChatResponse } from '../types';
import { config } from '../config';
import { ValidationError } from '../utils/errors';
import {
  findOrCreateConversation,
  updateConversationTimestamp,
} from '../repositories/conversation-repository';
import {
  findMessagesByConversationId,
  createMessage,
} from '../repositories/message-repository';
import { buildContext } from './context-builder';
import { generateCompletion } from './openai-provider';

function generateSessionId(): string {
  return `sess_${uuidv4()}`;
}

function validateMessage(message: string): void {
  if (!message || typeof message !== 'string') {
    throw new ValidationError('Message is required');
  }

  const trimmed = message.trim();

  if (trimmed.length === 0) {
    throw new ValidationError('Message cannot be empty');
  }

  if (trimmed.length > config.chat.maxMessageLength) {
    throw new ValidationError(
      `Message exceeds maximum length of ${config.chat.maxMessageLength} characters`
    );
  }
}

export async function processMessage(request: ChatRequest): Promise<ChatResponse> {
  // Validate input
  validateMessage(request.message);

  // Get or create session
  const sessionId = request.sessionId || generateSessionId();

  // Get or create conversation
  const conversation = await findOrCreateConversation(sessionId);

  console.log('Processing message:', {
    sessionId,
    conversationId: conversation.id,
    messageLength: request.message.length,
  });

  // Fetch conversation history
  const history = await findMessagesByConversationId(conversation.id);

  // Build context and generate response
  const contextMessages = buildContext(history, request.message);
  const llmResult = await generateCompletion(contextMessages);

  // Persist user message
  await createMessage({
    conversation_id: conversation.id,
    role: 'user',
    content: request.message,
  });

  // Persist assistant response
  await createMessage({
    conversation_id: conversation.id,
    role: 'assistant',
    content: llmResult.content,
    tokens_used: llmResult.tokensUsed,
    model: llmResult.model,
    metadata: {
      finish_reason: llmResult.finishReason,
    },
  });

  // Update conversation timestamp
  await updateConversationTimestamp(conversation.id);

  console.log('Message processed successfully:', {
    sessionId,
    tokensUsed: llmResult.tokensUsed,
  });

  return {
    reply: llmResult.content,
    sessionId,
  };
}

export async function getConversationHistory(sessionId: string) {
  const conversation = await findOrCreateConversation(sessionId);
  const messages = await findMessagesByConversationId(conversation.id);

  return {
    sessionId,
    messages: messages
      .filter((m) => m.role !== 'system')
      .map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.created_at,
      })),
  };
}
