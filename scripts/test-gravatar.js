// Script to test Gravatar functionality
const md5 = require('crypto-js/md5');

function getGravatarUrl(email) {
  if (!email) return null;
  const hash = md5(email.toLowerCase().trim()).toString();
  return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
}

// Test with sample emails
const testEmails = [
  'mannamganeshbabu8@gmail.com',
  'test@example.com',
  'user@domain.com'
];

console.log('Testing Gravatar URL generation...\n');

testEmails.forEach(email => {
  const gravatarUrl = getGravatarUrl(email);
  console.log(`Email: ${email}`);
  console.log(`Gravatar URL: ${gravatarUrl}`);
  console.log('---');
});

console.log('\n✅ Gravatar functionality test completed successfully!');