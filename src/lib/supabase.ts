import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_URL || 'https://iaaxlsbawfktkugngyxr.supabase.co';

export const SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhYXhsc2Jhd2ZrdGt1Z25neXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNzIxNjYsImV4cCI6MjEwNTg0ODE2Nn0.eImKifLwOQia4TE0TEKiq-TuRYw2mCTBXB6NOJqhPUI';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // No localStorage persistence as requested!
    autoRefreshToken: false,
  },
});
