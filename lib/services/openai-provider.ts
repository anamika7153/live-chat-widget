import OpenAI from 'openai';
import { config } from '../config';
import { ChatMessage, LLMCompletionResult } from '../types';
import { LLMError, RateLimitError, TimeoutError } from '../utils/errors';

let openaiInstance: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({
      apiKey: config.openai.apiKey,
      timeout: config.openai.timeout,
      maxRetries: 2,
    });
  }
  return openaiInstance;
}

export async function generateCompletion(
  messages: ChatMessage[]
): Promise<LLMCompletionResult> {
  const openai = getOpenAI();

  try {
    const response = await openai.chat.completions.create({
      model: config.openai.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: config.openai.maxTokens,
      temperature: config.openai.temperature,
    });

    const choice = response.choices[0];

    if (!choice?.message?.content) {
      throw new LLMError('Empty response from AI service');
    }

    return {
      content: choice.message.content,
      tokensUsed: response.usage?.total_tokens || 0,
      model: response.model,
      finishReason: choice.finish_reason || 'unknown',
    };
  } catch (error) {
    // Handle specific OpenAI errors
    if (error instanceof OpenAI.RateLimitError) {
      console.error('OpenAI rate limit hit:', error.message);
      throw new RateLimitError('Our AI service is busy. Please try again in a moment.');
    }

    if (error instanceof OpenAI.APIConnectionError) {
      console.error('OpenAI connection error:', error.message);
      throw new TimeoutError('Unable to connect to AI service. Please try again.');
    }

    if (error instanceof OpenAI.AuthenticationError) {
      console.error('OpenAI authentication failed:', error.message);
      throw new LLMError('AI service configuration error. Please contact support.');
    }

    if (error instanceof OpenAI.APIError) {
      console.error('OpenAI API error:', error.status, error.message);
      throw new LLMError('AI service temporarily unavailable. Please try again.');
    }

    // Re-throw if it's already our error type
    if (error instanceof LLMError || error instanceof RateLimitError || error instanceof TimeoutError) {
      throw error;
    }

    // Unknown error
    console.error('Unknown OpenAI error:', error);
    throw new LLMError('An unexpected error occurred. Please try again.');
  }
}
