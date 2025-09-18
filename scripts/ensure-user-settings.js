/**
 * Script to ensure all users have entries in the user_settings table
 * This helps maintain consistency between user profiles and their email IDs
 */

// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Debug: Print environment variables
console.log('Environment variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin access

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  console.log('Required variables:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ SET' : '✗ MISSING');
  console.log('- SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓ SET' : '✗ MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function ensureUserSettings() {
  try {
    console.log('Starting user settings consistency check...');
    
    // Get all users from auth.users
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users. Checking user_settings consistency...`);
    
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const user of users) {
      // Check if user has entry in user_settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows found"
        console.error(`Error checking user settings for ${user.email}:`, settingsError);
        continue;
      }
      
      if (!settings) {
        // Create user_settings entry
        const { error: insertError } = await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            display_name: user.email.split('@')[0],
            profile_picture_url: null, // Will use Gravatar fallback
            preferences: { theme: 'dark', notifications: true, email_updates: true }
          });
        
        if (insertError) {
          console.error(`Error creating user settings for ${user.email}:`, insertError);
        } else {
          console.log(`Created user settings for ${user.email}`);
          createdCount++;
        }
      } else {
        // Update display name if not set
        const { data: currentSettings, error: fetchError } = await supabase
          .from('user_settings')
          .select('display_name')
          .eq('user_id', user.id)
          .single();
        
        if (fetchError) {
          console.error(`Error fetching current settings for ${user.email}:`, fetchError);
          continue;
        }
        
        if (!currentSettings.display_name) {
          const { error: updateError } = await supabase
            .from('user_settings')
            .update({ display_name: user.email.split('@')[0] })
            .eq('user_id', user.id);
          
          if (updateError) {
            console.error(`Error updating display name for ${user.email}:`, updateError);
          } else {
            console.log(`Updated display name for ${user.email}`);
            updatedCount++;
          }
        }
      }
    }
    
    console.log(`Completed! Created: ${createdCount}, Updated: ${updatedCount}`);
    process.exit(0);
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
ensureUserSettings();