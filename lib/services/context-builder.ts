import { ChatMessage, Message } from '../types';
import { getFAQContext } from '../knowledge/faq';
import { getDomainContext } from '../knowledge/domain-context';
import { config } from '../config';

export function buildSystemPrompt(): string {
  const domainContext = getDomainContext();
  const faqContext = getFAQContext();

  return `You are a helpful customer support assistant for ShopEase, an online e-commerce store specializing in electronics and home goods.

## Your Role
- Provide friendly, accurate, and helpful responses to customer inquiries
- Help with order tracking, returns, product questions, and general support
- Be concise but thorough in your responses
- If you don't know something specific, acknowledge it and offer to help find the answer

## Store Information
${domainContext}

## Frequently Asked Questions
${faqContext}

## Guidelines
- Always be polite and professional
- If a customer seems frustrated, acknowledge their feelings empathetically
- For order-specific questions (tracking, status), ask for the order number if not provided
- Do not make up information about specific orders - you don't have access to order data
- If an issue requires human intervention (complex refunds, disputes), let them know a support agent will follow up
- Keep responses concise - aim for 2-4 sentences unless more detail is needed
- Use bullet points for listing multiple items or steps`;
}

export function buildContext(
  conversationHistory: Message[],
  newUserMessage: string
): ChatMessage[] {
  const messages: ChatMessage[] = [];

  // Add system prompt
  messages.push({
    role: 'system',
    content: buildSystemPrompt(),
  });

  // Add conversation history (limited to maxContextMessages)
  const recentHistory = conversationHistory
    .filter((m) => m.role !== 'system')
    .slice(-config.chat.maxContextMessages);

  for (const msg of recentHistory) {
    messages.push({
      role: msg.role,
      content: msg.content,
    });
  }

  // Add the new user message
  messages.push({
    role: 'user',
    content: newUserMessage,
  });

  return messages;
}
