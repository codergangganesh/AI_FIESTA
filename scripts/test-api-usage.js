// Script to test API usage tracking functionality
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testApiUsage() {
  try {
    console.log('Testing API usage tracking functionality...');
    
    // Get all users from auth.users
    const { data, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      return;
    }
    
    const users = data ? data.users : [];
    console.log(`Found ${users.length} users`);
    
    if (users.length === 0) {
      console.log('No users found. Skipping test.');
      return;
    }
    
    // Test with the first user
    const user = users[0];
    console.log(`Testing with user: ${user.id} (${user.email})`);
    
    // Check if user has a plan
    const { data: planData, error: planError } = await supabase
      .from('user_plans')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (planError) {
      console.error('Error fetching user plan:', planError.message);
      return;
    }
    
    if (!planData) {
      console.error('No user plan found for user:', user.id);
      return;
    }
    
    console.log('Current user plan:', JSON.stringify(planData, null, 2));
    
    // Test updating API usage
    const currentUsage = planData.usage || { apiCalls: 0, comparisons: 0, storage: 0 };
    const updatedUsage = {
      ...currentUsage,
      apiCalls: currentUsage.apiCalls + 1
    };
    
    console.log('Updating API usage:', updatedUsage);
    
    const { error: updateError } = await supabase
      .from('user_plans')
      .update({ usage: updatedUsage })
      .eq('user_id', user.id);
    
    if (updateError) {
      console.error('Error updating user plan:', updateError.message);
      return;
    }
    
    console.log('API usage updated successfully!');
    
    // Verify the update
    const { data: updatedPlanData, error: verifyError } = await supabase
      .from('user_plans')
      .select('usage')
      .eq('user_id', user.id)
      .single();
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError.message);
      return;
    }
    
    console.log('Verified updated usage:', JSON.stringify(updatedPlanData.usage, null, 2));
    
    // Test real-time subscription
    console.log('Testing real-time subscription...');
    
    const channel = supabase
      .channel('test-api-usage-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'user_plans',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Real-time update received:', JSON.stringify(payload, null, 2));
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to real-time updates');
          
          // Test another update to trigger the subscription
          setTimeout(async () => {
            const testUsage = {
              ...updatedPlanData.usage,
              apiCalls: updatedPlanData.usage.apiCalls + 1
            };
            
            console.log('Making another update to test real-time subscription...');
            
            const { error: testUpdateError } = await supabase
              .from('user_plans')
              .update({ usage: testUsage })
              .eq('user_id', user.id);
            
            if (testUpdateError) {
              console.error('Error in test update:', testUpdateError.message);
            } else {
              console.log('Test update completed');
            }
          }, 2000);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to real-time updates:', err?.message || 'Unknown error');
        } else if (status === 'CLOSED') {
          console.log('Real-time subscription closed');
        }
      });
    
    // Keep the script running for a bit to test real-time updates
    setTimeout(() => {
      console.log('Test completed');
      supabase.removeChannel(channel);
      process.exit(0);
    }, 10000);
    
  } catch (error) {
    console.error('Error in testApiUsage:', error.message);
    process.exit(1);
  }
}

// Run the test
testApiUsage();