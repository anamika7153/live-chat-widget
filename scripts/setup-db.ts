import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('Make sure these are set in your .env.local file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupSQL = `
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
`;

async function setupDatabase() {
  console.log('Setting up database tables...');

  try {
    // Execute SQL using Supabase's rpc or direct query
    const { error } = await supabase.rpc('exec_sql', { sql: setupSQL });

    if (error) {
      // If rpc doesn't exist, we'll need to run SQL manually
      console.log('Note: Please run the SQL migration manually in the Supabase SQL Editor.');
      console.log('SQL to run:');
      console.log(setupSQL);
    } else {
      console.log('Database tables created successfully!');
    }
  } catch (err) {
    console.log('Please run the following SQL in your Supabase SQL Editor:');
    console.log('');
    console.log(setupSQL);
  }

  // Test connection by checking if tables exist
  const { data, error: testError } = await supabase
    .from('conversations')
    .select('count')
    .limit(1);

  if (testError && testError.code === '42P01') {
    console.log('\nTables do not exist yet. Please run the SQL above in Supabase SQL Editor.');
  } else if (testError) {
    console.log('\nConnection test error:', testError.message);
  } else {
    console.log('\nConnection successful! Tables are ready.');
  }
}

setupDatabase();
