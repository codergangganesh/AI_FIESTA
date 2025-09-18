import { createClient } from '@/utils/supabase/client';

export async function testRealtimeConnection() {
  try {
    console.log('Testing real-time connection...');
    
    // Create Supabase client
    const supabase = createClient();
    console.log('Supabase client created successfully');
    
    // Test authentication
    console.log('Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Authentication error:', authError.message);
      return {
        success: false,
        message: 'Authentication failed',
        error: authError.message
      };
    }
    
    if (!user) {
      return {
        success: false,
        message: 'No authenticated user',
        error: 'No user found'
      };
    }
    
    console.log('Authentication successful');
    
    // Test real-time connection by setting up a simple subscription
    console.log('Setting up real-time subscription...');
    
    return new Promise((resolve) => {
      let timeoutId: NodeJS.Timeout;
      
      const channel = supabase
        .channel('test-connection')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_plans',
          filter: `user_id=eq.${user.id}`
        }, (payload) => {
          console.log('Real-time update received:', payload);
        })
        .subscribe((status, err) => {
          console.log('Real-time subscription status:', status);
          
          // Clear timeout since we got a response
          if (timeoutId) {
            clearTimeout(timeoutId);
          }
          
          if (status === 'SUBSCRIBED') {
            // Successfully subscribed, clean up and return success
            supabase.removeChannel(channel);
            resolve({
              success: true,
              message: 'Real-time connection successful',
              details: 'Successfully subscribed to real-time updates'
            });
          } else if (status === 'CHANNEL_ERROR') {
            supabase.removeChannel(channel);
            resolve({
              success: false,
              message: 'Real-time connection failed',
              error: err?.message || 'Unknown error'
            });
          } else if (status === 'CLOSED') {
            // This might be expected if we're just testing
            resolve({
              success: true,
              message: 'Real-time connection test completed',
              details: 'Channel closed (this may be expected)'
            });
          }
        });
      
      // Set timeout to resolve if no response within 10 seconds
      timeoutId = setTimeout(() => {
        supabase.removeChannel(channel);
        resolve({
          success: false,
          message: 'Real-time connection timeout',
          error: 'No response from real-time service within 10 seconds'
        });
      }, 10000);
    });
  } catch (error: any) {
    console.error('Real-time connection test failed:', error.message);
    
    return {
      success: false,
      message: 'Real-time connection test failed',
      error: error.message
    };
  }
}