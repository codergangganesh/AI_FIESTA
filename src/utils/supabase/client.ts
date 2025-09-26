'use client';

import { supabase } from '@/lib/supabaseClient';

export function createClient() {
  return supabase;
}


