export function validateSupabaseConfig() {
  const errors: string[] = [];
  
  // Check Supabase URL
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    errors.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  } else {
    // Validate URL format
    try {
      new URL(process.env.NEXT_PUBLIC_SUPABASE_URL);
    } catch {
      errors.push('NEXT_PUBLIC_SUPABASE_URL is not a valid URL');
    }
  }
  
  // Check Supabase Anon Key
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  } else if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length < 10) {
    errors.push('NEXT_PUBLIC_SUPABASE_ANON_KEY appears to be too short');
  }
  
  // Check Service Role Key (optional but good to validate if present)
  if (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length < 10) {
    errors.push('SUPABASE_SERVICE_ROLE_KEY appears to be too short');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}