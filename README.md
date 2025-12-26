# Live Chat Widget - AI Support Agent

A mini AI support agent for a live chat widget that simulates customer support chat using OpenAI's GPT-4o-mini model.

---

## Quick Start

```bash
# 1. Navigate to project
cd /Users/anamikayadav/projects/live-chat-widget

# 2. Install dependencies (if not already done)
npm install

# 3. Start the backend server
npm run dev:server

# 4. In a new terminal, start the frontend
npm run dev:client

# 5. Open browser
open http://localhost:5173
```

**Using the Chat Widget:**
1. Click the blue chat bubble in the bottom-right corner
2. Type a message like "What is your return policy?" and press Enter
3. The AI will respond with information about ShopEase store policies

---

## Test with cURL

```bash
# Health check
curl http://localhost:3001/api/health

# Send a chat message
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your return policy?"}'

# Ask about shipping
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Do you ship internationally?"}'

# Ask about payment methods
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What payment methods do you accept?"}'

# Continue a conversation (use sessionId from previous response)
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "How long does a refund take?", "sessionId": "sess_xxx"}'

# Get conversation history
curl http://localhost:3001/api/chat/history/sess_xxx
```

---

## Features

- Real-time chat interface with AI-powered responses
- Conversation persistence in PostgreSQL (Supabase)
- Session management with localStorage
- Mobile-responsive design
- Typing indicators and smooth animations
- Error handling with user-friendly messages
- FAQ knowledge base for ShopEase (fictional e-commerce store)

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js + Express + TypeScript (Vercel Functions for production)
- **Database:** Supabase (PostgreSQL)
- **LLM:** OpenAI GPT-4o-mini
- **Deployment:** Vercel

## Project Structure

```
live-chat-widget/
├── api/                    # Vercel serverless functions
│   ├── chat/
│   │   ├── message.ts      # POST /api/chat/message
│   │   └── history/[sessionId].ts
│   └── health.ts
├── lib/                    # Backend shared logic
│   ├── services/           # Business logic
│   ├── repositories/       # Data access layer
│   ├── knowledge/          # FAQ and domain context
│   └── utils/              # Error handling, helpers
├── src/                    # React frontend
│   ├── components/chat/    # UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/api/       # API client
│   ├── types/              # TypeScript types
│   └── utils/              # Utilities
├── server.ts               # Express server for local dev
└── package.json
```

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key

### 1. Clone and Install

```bash
git clone <repo-url>
cd live-chat-widget
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** and run:

```sql
-- conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    tokens_used INTEGER,
    model VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- indexes
CREATE INDEX IF NOT EXISTS idx_conversations_session_id ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
```

### 3. Configure Environment

Create `.env.local` in the project root:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenAI
OPENAI_API_KEY=sk-your-api-key
OPENAI_MODEL=gpt-4o-mini

# Chat Settings
MAX_MESSAGE_LENGTH=2000
MAX_CONTEXT_MESSAGES=20

# Frontend
VITE_API_URL=/api
```

### 4. Start Development Servers

```bash
# Option 1: Run both servers concurrently
npm run dev

# Option 2: Run separately
npm run dev:server   # Express backend on port 3001
npm run dev:client   # Vite frontend on port 5173
```

### 5. Open the App

Visit [http://localhost:5173](http://localhost:5173)

## API Endpoints

### POST /api/chat/message

Send a message and receive an AI response.

**Request:**
```json
{
  "message": "What is your return policy?",
  "sessionId": "sess_abc123" // optional
}
```

**Response:**
```json
{
  "reply": "We offer a 30-day return policy...",
  "sessionId": "sess_abc123"
}
```

### GET /api/chat/history/:sessionId

Retrieve conversation history.

**Response:**
```json
{
  "sessionId": "sess_abc123",
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ]
}
```

### GET /api/health

Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "checks": {
    "database": true,
    "openai": true
  }
}
```

## Architecture Overview

### Backend Flow

```
User Message → Express Server → ChatService
                                    ↓
                            ConversationRepo (find/create)
                                    ↓
                            MessageRepo (fetch history)
                                    ↓
                            ContextBuilder (system prompt + FAQ)
                                    ↓
                            OpenAI API (generate response)
                                    ↓
                            MessageRepo (save user + AI messages)
                                    ↓
                            Return response to frontend
```

### LLM Integration

- **Provider:** OpenAI GPT-4o-mini (cost-efficient, fast)
- **System Prompt:** Includes store info, policies, and FAQ
- **Context Window:** Last 20 messages for conversation continuity
- **Max Tokens:** 500 per response
- **Temperature:** 0.7 for balanced creativity

### FAQ Knowledge Base

The AI is trained on ShopEase (fictional e-commerce store) knowledge:

- Shipping policies (5-7 days standard, 2-3 days express, international)
- Return policy (30 days, 15 days for electronics)
- Payment methods (Visa, MC, Amex, PayPal, Apple Pay)
- Support hours (Mon-Fri 8AM-8PM EST)
- Warranty information (1-year standard)
- ShopEase Plus membership program

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY`
   - `OPENAI_MODEL`
4. Deploy

Vercel will automatically:
- Build the Vite frontend
- Deploy serverless functions from `/api`

## Error Handling

The app handles various error scenarios:

- **Empty messages:** Validation error shown
- **Long messages:** Truncated at 2000 characters
- **API timeouts:** 30-second timeout with friendly message
- **Rate limiting:** OpenAI rate limit errors handled gracefully
- **Network errors:** Retry prompt shown to user
- **Invalid API key:** Generic error shown, detailed log on server

## Trade-offs & Design Decisions

1. **GPT-4o-mini vs GPT-4:** Chose mini for cost efficiency while maintaining quality
2. **Express for local dev:** Simpler debugging than Vercel CLI
3. **localStorage for sessions:** No auth needed, simpler user experience
4. **React Query:** Handles loading states, caching, and retries automatically
5. **No streaming:** Simpler implementation; full responses feel more natural for support

## If I Had More Time...

1. **Streaming responses:** Real-time token streaming for better UX
2. **Message feedback:** Thumbs up/down for response quality tracking
3. **Agent handoff:** Escalation to human support when AI cannot resolve
4. **Analytics dashboard:** Track common questions, resolution rates
5. **Multi-provider LLM:** Fallback to Claude if OpenAI fails
6. **Vector search:** Semantic FAQ matching with embeddings
7. **WebSocket:** Real-time updates for multi-device sync
8. **E2E tests:** Playwright tests for critical user flows
9. **Rate limiting:** Redis-based rate limiting per session
10. **Conversation summarization:** Reduce context tokens for long conversations

## Testing

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test chat
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What is your return policy?"}'
```

## License

MIT
