import { useState, useCallback, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole } from '../types/chat.types';
import { sendMessage, clearChatSession } from '../services/api/chatApi';
import { useSession } from './useSession';

const MESSAGES_KEY = 'chat_messages';

export function useChat() {
  const { sessionId, saveSession } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    if (sessionId) {
      const stored = localStorage.getItem(`${MESSAGES_KEY}_${sessionId}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setMessages(
            parsed.map((m: any) => ({
              ...m,
              timestamp: new Date(m.timestamp),
            }))
          );
        } catch {
          // Ignore parse errors
        }
      }
    }
  }, [sessionId]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`${MESSAGES_KEY}_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const addMessage = useCallback((role: MessageRole, content: string, status: Message['status'] = 'sent') => {
    const message: Message = {
      id: uuidv4(),
      role,
      content,
      timestamp: new Date(),
      status,
    };
    setMessages((prev) => [...prev, message]);
    return message.id;
  }, []);

  const updateMessageStatus = useCallback((id: string, status: Message['status']) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  }, []);

  const mutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await sendMessage({
        message: content,
        sessionId: sessionId || undefined,
      });
      return response;
    },
    onSuccess: (data) => {
      // Save session ID if new
      if (!sessionId) {
        saveSession(data.sessionId);
      }
      // Add AI response
      addMessage('assistant', data.reply);
    },
    onError: (err) => {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      setError(errorMessage);
    },
  });

  const send = useCallback(
    (content: string) => {
      if (!content.trim()) return;

      setError(null);

      // Add user message immediately (optimistic update)
      const messageId = addMessage('user', content, 'pending');

      // Send to API
      mutation.mutate(content, {
        onSuccess: () => {
          updateMessageStatus(messageId, 'sent');
        },
        onError: () => {
          updateMessageStatus(messageId, 'error');
        },
      });
    },
    [addMessage, updateMessageStatus, mutation]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearChat = useCallback(async () => {
    // Clear from database if session exists
    if (sessionId) {
      try {
        await clearChatSession(sessionId);
      } catch (err) {
        console.error('Failed to clear chat from server:', err);
      }
      localStorage.removeItem(`${MESSAGES_KEY}_${sessionId}`);
    }
    setMessages([]);
  }, [sessionId]);

  return {
    messages,
    isLoading: mutation.isPending,
    isTyping: mutation.isPending,
    error,
    send,
    clearError,
    clearChat,
    sessionId,
  };
}
