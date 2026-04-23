
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const [key, ...value] = line.split('=');
  if (key && value.length > 0) {
    env[key.trim()] = value.join('=').trim();
  }
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  console.log('Checking products table schema...');
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
    if (Object.keys(data[0]).includes('variants')) {
      console.log('SUCCESS: "variants" column exists.');
    } else {
      console.log('FAILURE: "variants" column is MISSING.');
    }
  } else {
    console.log('No data found in products table to check columns.');
    // Try to insert a dummy product with variants to see if it fails
    console.log('Attempting to insert a dummy product with variants...');
    const dummyProduct = {
      id: 'test-check-' + Date.now(),
      title: { en: 'Test' },
      price: 0,
      variants: [{ name: 'test', price: 0 }]
    };
    const { error: insertError } = await supabase
      .from('products')
      .insert([dummyProduct]);
    
    if (insertError) {
      console.error('Insert failed:', insertError);
      if (insertError.message.includes('variants')) {
        console.log('FAILURE: "variants" column is likely MISSING.');
      }
    } else {
      console.log('Insert successful! "variants" column exists.');
      // Cleanup
      await supabase.from('products').delete().eq('id', dummyProduct.id);
    }
  }
}

checkSchema();
