import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const isSupabaseClient = (client: any): client is ReturnType<typeof createClient> => {
  return client && typeof client.from === 'function';
};

let supabase: ReturnType<typeof createClient> | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else if (import.meta.env.MODE !== 'production') {
  console.warn("Supabase URL or Anon Key not provided. Supabase client not initialized in development.");
} else {
  throw new Error("VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required in production.");
}

export { supabase, isSupabaseClient };