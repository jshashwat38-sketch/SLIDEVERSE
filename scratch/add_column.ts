import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loader
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_KEY; // Need higher privilege to alter table usually

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials (need service role key)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function addVariantsColumn() {
  console.log('Attempting to add variants column via SQL...');
  const { data, error } = await supabase.rpc('execute_sql', { 
    sql: 'ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT \'[]\'::jsonb;' 
  });

  if (error) {
    console.error('Error adding column via RPC:', error);
    console.log('Trying direct query (if rpc not enabled)...');
    // Supabase JS doesn't support direct ALTER TABLE. Usually done via dashboard or CLI.
    // I'll check if I can run a migration.
  } else {
    console.log('Column added successfully!');
  }
}

addVariantsColumn();
