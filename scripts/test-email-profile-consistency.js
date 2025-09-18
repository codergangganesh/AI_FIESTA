/**
 * Script to test that user profiles are consistent with their email IDs
 */

// Load environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env.local') });

// Debug: Print environment variables
console.log('Environment variables:');
console.log('- NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
console.log('- SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

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

// Function to generate Gravatar URL
function getGravatarUrl(email) {
  if (!email) return null;
  const hash = crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex');
  return `https://www.gravatar.com/avatar/${hash}?d=identicon&s=200`;
}

async function testEmailProfileConsistency() {
  try {
    console.log('Testing email-profile consistency...');
    
    // Get all users from profiles
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email');
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      process.exit(1);
    }
    
    console.log(`Found ${users.length} users. Testing consistency...`);
    
    let consistentCount = 0;
    let inconsistentCount = 0;
    
    for (const user of users) {
      // Get user settings
      const { data: settings, error: settingsError } = await supabase
        .from('user_settings')
        .select('profile_picture_url, display_name')
        .eq('user_id', user.id)
        .single();
      
      if (settingsError) {
        console.error(`Error fetching settings for ${user.email}:`, settingsError);
        inconsistentCount++;
        continue;
      }
      
      // Check if display name is consistent (based on email)
      const expectedDisplayName = user.email.split('@')[0];
      const isDisplayNameConsistent = settings.display_name === expectedDisplayName;
      
      // Check if profile picture is consistent (Gravatar based on email)
      const expectedGravatarUrl = getGravatarUrl(user.email);
      const isProfilePictureConsistent = !settings.profile_picture_url || 
                                        settings.profile_picture_url === expectedGravatarUrl ||
                                        settings.profile_picture_url.includes('gravatar.com');
      
      if (isDisplayNameConsistent && isProfilePictureConsistent) {
        console.log(`✓ ${user.email} - Profile consistent`);
        consistentCount++;
      } else {
        console.log(`✗ ${user.email} - Profile INCONSISTENT`);
        if (!isDisplayNameConsistent) {
          console.log(`  Display name: expected "${expectedDisplayName}", got "${settings.display_name}"`);
        }
        if (!isProfilePictureConsistent) {
          console.log(`  Profile picture: expected Gravatar URL, got "${settings.profile_picture_url}"`);
        }
        inconsistentCount++;
      }
    }
    
    console.log(`\nTest Results:`);
    console.log(`Consistent profiles: ${consistentCount}`);
    console.log(`Inconsistent profiles: ${inconsistentCount}`);
    console.log(`Total users tested: ${users.length}`);
    
    if (inconsistentCount > 0) {
      console.log(`\nWARNING: ${inconsistentCount} profiles are inconsistent with their email IDs.`);
      console.log('Run ensure-user-settings.js to fix inconsistencies.');
      process.exit(1);
    } else {
      console.log('\nAll profiles are consistent with their email IDs! ✓');
      process.exit(0);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Run the test
testEmailProfileConsistency();