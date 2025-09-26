'use client';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mpephfelycexrqgkghsw.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wZXBoZmVseWNleHJxZ2tnaHN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNTg0NzgsImV4cCI6MjA3MzgzNDQ3OH0.Ori3PWIf7tfAXkjciaU_RMCK6UCZdCv8yTTkYZw0C1E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


