const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ywjzqtuhwtxhopkyhora.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3anpxdHVod3R4aG9wa3lob3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4NTA2MDMsImV4cCI6MjA5MjQyNjYwM30.lDCXurnzJsY0jYx3hM54jMv78ZuOxiID_RrVfpbz6Gs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkOTPs() {
  console.log('Checking OTPS table...');
  const { data, error } = await supabase.from('otps').select('*').limit(5);
  if (error) {
    console.error('Error fetching OTPS:', error.message);
  } else {
    console.log('Recent OTPS:', data);
  }
}

checkOTPs();
