// Script to initialize user plans for existing users
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'NOT SET');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'NOT SET');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function initializeUserPlans() {
  try {
    console.log('Starting user plans initialization...');
    
    // Get all users from auth.users
    const { data, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      return;
    }
    
    const users = data ? data.users : [];
    console.log(`Found ${users.length} users`);
    
    // For each user, check if they have a user_plans entry
    for (const user of users) {
      try {
        // Check if user plan already exists
        const { data: existingPlan, error: planError } = await supabase
          .from('user_plans')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (planError && planError.code !== 'PGRST116') {
          console.error(`Error checking plan for user ${user.id}:`, planError.message);
          continue;
        }
        
        // If no plan exists, create one
        if (!existingPlan) {
          console.log(`Creating plan for user ${user.id} (${user.email})`);
          
          const defaultUsage = {
            apiCalls: 0,
            comparisons: 0,
            storage: 0
          };
          
          const { error: insertError } = await supabase
            .from('user_plans')
            .insert({
              user_id: user.id,
              user_email: user.email,
              usage: defaultUsage,
              plan_type: 'free'
            });
          
          if (insertError) {
            console.error(`Error creating plan for user ${user.id}:`, insertError.message);
          } else {
            console.log(`Successfully created plan for user ${user.id}`);
          }
        } else {
          console.log(`User ${user.id} already has a plan`);
        }
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError.message);
      }
    }
    
    console.log('User plans initialization completed');
  } catch (error) {
    console.error('Error in initializeUserPlans:', error.message);
  }
}

// Run the initialization
initializeUserPlans();