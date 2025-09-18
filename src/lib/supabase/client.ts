import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if environment variables are defined
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  console.log('Creating Supabase client with:')
  console.log('- URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('- Key present:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  // Add global error handler for Supabase client
  const originalGetUser = supabase.auth.getUser;
  supabase.auth.getUser = async function(...args) {
    try {
      console.log('Attempting to get user from Supabase...')
      const result = await originalGetUser.apply(this, args);
      console.log('Get user result:', result)
      return result;
    } catch (error: any) {
      // Handle AuthSessionMissingError gracefully
      if (error?.message?.includes('Auth session missing')) {
        console.log('Caught AuthSessionMissingError in Supabase client');
        return { data: { user: null }, error: null };
      }
      console.error('Error in Supabase getUser:', error)
      throw error;
    }
  };

  return supabase;
}