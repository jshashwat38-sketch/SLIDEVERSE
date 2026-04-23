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
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

async function testInsert() {
  console.log('Testing insert with variants...');
  const { data, error } = await supabase
    .from('products')
    .insert([{
      id: 'test-insert',
      title: { en: 'Test Product' },
      description: { en: 'Test Desc' },
      price: 0,
      variants: [{ name: 'Test Variant', price: 0 }]
    }]);

  if (error) {
    console.error('Insert failed:', error.message, error.details, error.hint);
  } else {
    console.log('Insert succeeded! (Wait, did I just add a column or was it already there?)');
    // Cleanup
    await supabase.from('products').delete().eq('id', 'test-insert');
  }
}

testInsert();
