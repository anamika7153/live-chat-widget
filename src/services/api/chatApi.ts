import { SendMessageRequest, SendMessageResponse, ChatHistoryResponse } from '../../types/chat.types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

class ChatApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ChatApiError';
    this.code = code;
    this.status = status;
  }
}

export async function sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
  const response = await fetch(`${API_URL}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ChatApiError(
      data.error?.message || 'Failed to send message',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return data;
}

export async function getChatHistory(sessionId: string): Promise<ChatHistoryResponse> {
  const response = await fetch(`${API_URL}/chat/history/${sessionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ChatApiError(
      data.error?.message || 'Failed to fetch history',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }

  return data;
}

export async function clearChatSession(sessionId: string): Promise<void> {
  const response = await fetch(`${API_URL}/chat/clear/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const data = await response.json();
    throw new ChatApiError(
      data.error?.message || 'Failed to clear chat',
      data.error?.code || 'UNKNOWN_ERROR',
      response.status
    );
  }
}

export { ChatApiError };
