// Simple authentication test for WordPress
// Run with: node test-auth.js

const fetch = require('node-fetch');

async function testAuth() {
  const wpUrl = process.env.WORDPRESS_URL || 'https://ink-co.com';
  const wpUsername = process.env.WORDPRESS_USERNAME;
  const wpPassword = process.env.WORDPRESS_APPLICATION_PASSWORD;

  console.log('=== WordPress Authentication Test ===');
  console.log('URL:', wpUrl);
  console.log('Username:', wpUsername);
  console.log('Password type:', wpPassword ? (wpPassword.includes(' ') ? 'Application Password' : 'Regular Password') : 'Not set');

  if (!wpUsername || !wpPassword) {
    console.error('❌ Missing credentials');
    return;
  }

  const authHeader = `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`;

  try {
    // Test 1: Try to access user info (requires authentication)
    console.log('\n1. Testing authentication with user info...');
    const userResponse = await fetch(`${wpUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log('User info status:', userResponse.status);
    
    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log('✅ Authentication successful!');
      console.log('User ID:', userData.id);
      console.log('User name:', userData.name);
      console.log('User capabilities:', userData.capabilities);
    } else {
      const errorText = await userResponse.text();
      console.log('❌ Authentication failed');
      console.log('Error:', errorText);
      
      if (userResponse.status === 401) {
        console.log('\n🔧 This looks like an authentication issue.');
        console.log('Possible solutions:');
        console.log('1. Use an Application Password instead of regular password');
        console.log('2. Check if Application Passwords are enabled on your WordPress site');
        console.log('3. Verify your username and password are correct');
      }
    }

    // Test 2: Try to access posts (requires authentication)
    console.log('\n2. Testing posts access...');
    const postsResponse = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      headers: {
        'Authorization': authHeader
      }
    });

    console.log('Posts access status:', postsResponse.status);
    
    if (postsResponse.ok) {
      console.log('✅ Posts access successful!');
    } else {
      const errorText = await postsResponse.text();
      console.log('❌ Posts access failed:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAuth();

