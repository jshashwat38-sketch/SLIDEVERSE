import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client for general use (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for admin operations (if needed, you could add service role key here)
// For now, using anon key as RLS is wide open in the provided schema
