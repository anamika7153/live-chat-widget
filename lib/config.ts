// Environment configuration with validation
import dotenv from 'dotenv';

// Load .env.local for development
dotenv.config({ path: '.env.local' });

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

function optionalEnvNumber(name: string, defaultValue: number): number {
  const value = process.env[name];
  return value ? parseInt(value, 10) : defaultValue;
}

export const config = {
  supabase: {
    url: requireEnv('SUPABASE_URL'),
    serviceRoleKey: requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
  },
  openai: {
    apiKey: requireEnv('OPENAI_API_KEY'),
    model: optionalEnv('OPENAI_MODEL', 'gpt-4o-mini'),
    maxTokens: optionalEnvNumber('OPENAI_MAX_TOKENS', 500),
    temperature: 0.7,
    timeout: 30000,
  },
  chat: {
    maxMessageLength: optionalEnvNumber('MAX_MESSAGE_LENGTH', 2000),
    maxContextMessages: optionalEnvNumber('MAX_CONTEXT_MESSAGES', 20),
  },
};

export type Config = typeof config;
