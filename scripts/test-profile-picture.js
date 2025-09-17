// Script to test profile picture functionality
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

async function testProfilePicture() {
  try {
    console.log('Testing profile picture functionality...');
    
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
    
    // Check if user has settings
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (settingsError) {
      console.error('Error fetching user settings:', settingsError.message);
      return;
    }
    
    if (!settingsData) {
      console.error('No user settings found for user:', user.id);
      return;
    }
    
    console.log('Current user settings:', JSON.stringify(settingsData, null, 2));
    
    // Test updating profile picture
    const testProfilePictureUrl = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.email.charAt(0).toUpperCase()) + '&background=0D8ABC&color=fff';
    
    console.log('Updating profile picture to:', testProfilePictureUrl);
    
    const { error: updateError } = await supabase
      .from('user_settings')
      .update({ profile_picture_url: testProfilePictureUrl })
      .eq('user_id', user.id);
    
    if (updateError) {
      console.error('Error updating profile picture:', updateError.message);
      return;
    }
    
    console.log('Profile picture updated successfully!');
    
    // Verify the update
    const { data: updatedSettingsData, error: verifyError } = await supabase
      .from('user_settings')
      .select('profile_picture_url')
      .eq('user_id', user.id)
      .single();
    
    if (verifyError) {
      console.error('Error verifying update:', verifyError.message);
      return;
    }
    
    console.log('Verified updated profile picture:', updatedSettingsData.profile_picture_url);
    
    // Test fallback to user metadata
    console.log('\nTesting fallback to user metadata...');
    
    if (user.user_metadata?.avatar_url) {
      console.log('User has avatar_url in metadata:', user.user_metadata.avatar_url);
    } else {
      console.log('User does not have avatar_url in metadata');
    }
    
    console.log('\n✅ Profile picture functionality test completed successfully!');
    
  } catch (error) {
    console.error('Error in testProfilePicture:', error.message);
    process.exit(1);
  }
}

// Run the test
testProfilePicture();