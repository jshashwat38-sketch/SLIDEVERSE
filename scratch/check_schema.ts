import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Manual env loader for scratch scripts
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length > 0) {
    env[key.trim()] = vals.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function checkSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  if (data && data.length > 0) {
    console.log('Columns in products table:', Object.keys(data[0]));
  } else {
    console.log('Products table is empty, trying to get columns via RPC or introspection...');
    // If empty, try to get info about the table
    const { data: colData, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'products' });
    if (colError) {
      console.log('RPC failed, table might be empty but column names are unknown.');
    } else {
      console.log('Columns:', colData);
    }
  }
}

checkSchema();
