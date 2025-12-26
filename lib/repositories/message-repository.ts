import { supabase } from '../supabase';
import { Message, MessageRole } from '../types';
import { DatabaseError } from '../utils/errors';

export interface CreateMessageInput {
  conversation_id: string;
  role: MessageRole;
  content: string;
  tokens_used?: number;
  model?: string;
  metadata?: Record<string, unknown>;
}

export async function findMessagesByConversationId(
  conversationId: string,
  limit?: number
): Promise<Message[]> {
  let query = supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch messages:', error);
    throw new DatabaseError('Failed to retrieve messages');
  }

  return data || [];
}

export async function createMessage(input: CreateMessageInput): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: input.conversation_id,
      role: input.role,
      content: input.content,
      tokens_used: input.tokens_used,
      model: input.model,
      metadata: input.metadata || {},
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create message:', error);
    throw new DatabaseError('Failed to save message');
  }

  return data;
}
