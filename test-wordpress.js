// Test script to verify WordPress API connection and glossary endpoint
// Run this with: node test-wordpress.js

const fetch = require('node-fetch');

async function testWordPressConnection() {
  const wpUrl = process.env.WORDPRESS_URL || 'https://ink-co.com';
  const wpUsername = process.env.WORDPRESS_USERNAME;
  const wpPassword = process.env.WORDPRESS_APPLICATION_PASSWORD;

  console.log('=== WordPress API Connection Test ===');
  console.log('WordPress URL:', wpUrl);
  console.log('Username:', wpUsername);
  console.log('Password configured:', !!wpPassword);

  if (!wpUsername || !wpPassword) {
    console.error('❌ Missing WordPress credentials in environment variables');
    console.log('Please set WORDPRESS_USERNAME and WORDPRESS_APPLICATION_PASSWORD');
    return;
  }

  const authHeader = `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`;

  try {
    // Test 1: Basic WordPress REST API
    console.log('\n1. Testing basic WordPress REST API...');
    const basicTest = await fetch(`${wpUrl}/wp-json/`, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Basic API status:', basicTest.status);
    console.log('Basic API ok:', basicTest.ok);

    // Test 2: Posts endpoint
    console.log('\n2. Testing posts endpoint...');
    const postsTest = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });
    console.log('Posts endpoint status:', postsTest.status);
    console.log('Posts endpoint ok:', postsTest.ok);

    // Test 3: Glossary endpoint
    console.log('\n3. Testing glossary endpoint...');
    const glossaryTest = await fetch(`${wpUrl}/wp-json/wp/v2/glossary`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      }
    });
    console.log('Glossary endpoint status:', glossaryTest.status);
    console.log('Glossary endpoint ok:', glossaryTest.ok);

    if (!glossaryTest.ok) {
      const errorText = await glossaryTest.text();
      console.log('Glossary endpoint error:', errorText);
    }

    // Test 4: Try to create a test post
    console.log('\n4. Testing post creation...');
    const testPostData = {
      title: 'Test Glossary Entry',
      content: '<p>This is a test entry to verify API functionality.</p>',
      status: 'draft',
      type: 'glossary'
    };

    const createTest = await fetch(`${wpUrl}/wp-json/wp/v2/glossary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader
      },
      body: JSON.stringify(testPostData)
    });

    console.log('Create test status:', createTest.status);
    console.log('Create test ok:', createTest.ok);

    if (!createTest.ok) {
      const errorText = await createTest.text();
      console.log('Create test error:', errorText);
    } else {
      const createdPost = await createTest.json();
      console.log('✅ Test post created successfully!');
      console.log('Post ID:', createdPost.id);
      console.log('Post link:', createdPost.link);
    }

    // Summary
    console.log('\n=== Test Summary ===');
    console.log('Basic API:', basicTest.ok ? '✅ Working' : '❌ Failed');
    console.log('Posts endpoint:', postsTest.ok ? '✅ Working' : '❌ Failed');
    console.log('Glossary endpoint:', glossaryTest.ok ? '✅ Working' : '❌ Failed');
    console.log('Post creation:', createTest.ok ? '✅ Working' : '❌ Failed');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testWordPressConnection();

