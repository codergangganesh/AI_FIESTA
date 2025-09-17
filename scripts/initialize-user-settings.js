// Script to initialize user settings for existing users
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

async function initializeUserSettings() {
  try {
    console.log('Starting user settings initialization...');
    
    // Get all users from auth.users
    const { data, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      return;
    }
    
    const users = data ? data.users : [];
    console.log(`Found ${users.length} users`);
    
    // For each user, check if they have a user_settings entry
    for (const user of users) {
      try {
        // Check if user settings already exists
        const { data: existingSettings, error: settingsError } = await supabase
          .from('user_settings')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (settingsError && settingsError.code !== 'PGRST116') {
          console.error(`Error checking settings for user ${user.id}:`, settingsError.message);
          continue;
        }
        
        // If no settings exists, create one
        if (!existingSettings) {
          console.log(`Creating settings for user ${user.id} (${user.email})`);
          
          // Get avatar URL from user metadata if available
          const avatarUrl = user.user_metadata?.avatar_url || null;
          
          const { error: insertError } = await supabase
            .from('user_settings')
            .insert({
              user_id: user.id,
              profile_picture_url: avatarUrl,
              display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || null,
              preferences: {
                theme: 'dark',
                notifications: true,
                email_updates: true
              }
            });
          
          if (insertError) {
            console.error(`Error creating settings for user ${user.id}:`, insertError.message);
          } else {
            console.log(`Successfully created settings for user ${user.id}`);
          }
        } else {
          console.log(`User ${user.id} already has settings`);
        }
      } catch (userError) {
        console.error(`Error processing user ${user.id}:`, userError.message);
      }
    }
    
    console.log('User settings initialization completed');
  } catch (error) {
    console.error('Error in initializeUserSettings:', error.message);
  }
}

// Run the initialization
initializeUserSettings();