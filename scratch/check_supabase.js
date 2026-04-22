const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ywjzqtuhwtxhopkyhora.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3anpxdHVod3R4aG9wa3lob3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTA2MDMsImV4cCI6MjA5MjQyNjYwM30.lDCXurnzJsY0jYx3hM54jMv78ZuOxiID_RrVfpbz6Gs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkTables() {
  console.log("Checking Supabase tables...");
  
  const tables = ['categories', 'products', 'users', 'orders', 'reviews', 'grievances', 'otps', 'appearance'];
  
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    if (error) {
      console.error(`Table '${table}' error:`, error.message);
    } else {
      console.log(`Table '${table}' exists. Count: ${count}`);
    }
  }
}

checkTables();
