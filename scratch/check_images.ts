import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('id, title, image_url, images')
    .limit(5);

  if (error) {
    console.error("Error fetching products:", error);
    return;
  }

  console.log("Product Image Data:");
  data.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Title: ${JSON.stringify(p.title)}`);
    console.log(`Image URL: ${p.image_url}`);
    console.log(`Images: ${JSON.stringify(p.images)}`);
    console.log("---");
  });
}

checkProducts();
