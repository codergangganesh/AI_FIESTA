import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Check if environment variables are defined
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const errorMsg = 'Missing NEXT_PUBLIC_SUPABASE_URL environment variable'
    console.error(errorMsg)
    throw new Error(errorMsg)
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const errorMsg = 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable'
    console.error(errorMsg)
    throw new Error(errorMsg)
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
      // Handle network errors specifically
      if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
        console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
      }
      throw error;
    }
  };

  // Add global error handler for Supabase database operations
  const originalFrom = supabase.from;
  supabase.from = function(...args: any[]) {
    const result: any = originalFrom.apply(this, args);
    
    // Wrap select method with error handling
    const originalSelect = result.select;
    if (originalSelect) {
      result.select = function(...selectArgs: any[]) {
        const selectResult: any = originalSelect.apply(this, selectArgs);
        
        // Wrap the promise with error handling
        const originalPromiseThen = selectResult.then;
        selectResult.then = function(successCallback: any, errorCallback: any) {
          const wrappedErrorCallback = (error: any) => {
            console.error(`Database error in ${args[0]} table:`, error.message || error);
            // Handle network errors specifically
            if (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError')) {
              console.error('Network connectivity issue detected. Please check your internet connection and Supabase configuration.');
            }
            return errorCallback ? errorCallback(error) : Promise.reject(error);
          };
          return originalPromiseThen.call(this, successCallback, wrappedErrorCallback);
        };
        
        return selectResult;
      };
    }
    
    return result;
  };

  return supabase;
}