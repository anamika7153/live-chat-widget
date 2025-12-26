import { supabase } from '../supabase.js';
import { Conversation } from '../types.js';
import { DatabaseError } from '../utils/errors.js';

export async function findConversationBySessionId(
  sessionId: string
): Promise<Conversation | null> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = not found, which is ok
    console.error('Failed to find conversation:', error);
    throw new DatabaseError('Failed to retrieve conversation');
  }

  return data;
}

export async function findOrCreateConversation(
  sessionId: string
): Promise<Conversation> {
  // Try to find existing
  const existing = await findConversationBySessionId(sessionId);
  if (existing) {
    return existing;
  }

  // Create new
  const { data, error } = await supabase
    .from('conversations')
    .insert({
      session_id: sessionId,
      status: 'active',
      metadata: {},
    })
    .select()
    .single();

  if (error) {
    console.error('Failed to create conversation:', error);
    throw new DatabaseError('Failed to create conversation');
  }

  return data;
}

export async function updateConversationTimestamp(id: string): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Failed to update conversation timestamp:', error);
    // Non-critical, don't throw
  }
}
