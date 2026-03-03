import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE = import.meta.env.VITE_SUPABASE_PUBLISHABLE;


export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});