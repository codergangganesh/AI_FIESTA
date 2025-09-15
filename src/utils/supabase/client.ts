import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if environment variables are defined
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Add global error handler for Supabase client
  const originalGetUser = supabase.auth.getUser;
  supabase.auth.getUser = async function(...args) {
    try {
      return await originalGetUser.apply(this, args);
    } catch (error: any) {
      // Handle AuthSessionMissingError gracefully
      if (error?.message?.includes('Auth session missing')) {
        console.log('Caught AuthSessionMissingError in Supabase client');
        return { data: { user: null }, error: null };
      }
      throw error;
    }
  };

  return supabase;
}