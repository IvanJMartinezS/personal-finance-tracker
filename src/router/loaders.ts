// src/router/loaders.ts
import { redirect } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export async function authLoader() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return redirect('/auth');
  return null; // permite continuar
}