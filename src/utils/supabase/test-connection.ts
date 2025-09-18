import { createClient } from '@/utils/supabase/client';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set');
    }
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
    }
    
    console.log('Environment variables are set correctly');
    
    // Create Supabase client
    const supabase = createClient();
    console.log('Supabase client created successfully');
    
    // Test authentication
    console.log('Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError.message);
      throw authError;
    }
    
    console.log('Authentication test passed');
    console.log('User:', user ? 'Authenticated' : 'Not authenticated');
    
    // Test database connection with a simple query
    console.log('Testing database connection...');
    const { data, error } = await supabase
      .from('user_plans')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Database connection error:', error.message);
      throw error;
    }
    
    console.log('Database connection test passed');
    
    return {
      success: true,
      message: 'Supabase connection is working correctly',
      user: user ? 'Authenticated' : 'Not authenticated'
    };
  } catch (error: any) {
    console.error('Supabase connection test failed:', error.message);
    
    // Provide specific error messages for common issues
    if (error.message.includes('Failed to fetch')) {
      return {
        success: false,
        message: 'Network connectivity issue. Please check your internet connection and Supabase configuration.',
        error: error.message
      };
    }
    
    if (error.message.includes('Invalid API key')) {
      return {
        success: false,
        message: 'Invalid Supabase API key. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY.',
        error: error.message
      };
    }
    
    if (error.message.includes('URL')) {
      return {
        success: false,
        message: 'Invalid Supabase URL. Please check your NEXT_PUBLIC_SUPABASE_URL.',
        error: error.message
      };
    }
    
    return {
      success: false,
      message: 'Supabase connection test failed',
      error: error.message
    };
  }
}