export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { term, definition, category, relatedTerms, author, whyMatters, inkRole, challenges } = req.body;
  
  // Validate required fields
  if (!term || !definition) {
    res.status(400).json({ error: 'Term and definition are required' });
    return;
  }

  const wpUrl = process.env.WORDPRESS_URL;
  const wpUsername = process.env.WORDPRESS_USERNAME;
  const wpPassword = process.env.WORDPRESS_APPLICATION_PASSWORD;

  console.log('=== WordPress API Debug Info ===');
  console.log('WordPress URL:', wpUrl);
  console.log('Username:', wpUsername);
  console.log('Password configured:', !!wpPassword);
  console.log('Term:', term);
  console.log('Category:', category);
  console.log('Author:', author);

  if (!wpUrl || !wpUsername || !wpPassword) {
    console.error('Missing WordPress credentials');
    res.status(500).json({ error: 'WordPress credentials not configured' });
    return;
  }

  try {
    // Create the post content with proper INK formatting
    const postContent = `
<div class="glossary-entry">
  <div class="glossary-definition">
    <h2>Definition</h2>
    <p>${definition}</p>
  </div>

${relatedTerms ? `
  <div class="glossary-synonyms">
    <h3>Synonyms</h3>
    <p>${relatedTerms}</p>
  </div>
` : ''}

${whyMatters ? `
  <div class="glossary-why-matters">
    <h3>Why does ${term.toLowerCase()} matter?</h3>
    <p>${whyMatters}</p>
  </div>
` : ''}

${inkRole ? `
  <div class="glossary-ink-role">
    <h3>INK's role</h3>
    <p>${inkRole}</p>
  </div>
` : ''}

${challenges ? `
  <div class="glossary-challenges">
    <h3>Challenges</h3>
    ${challenges.includes('-') ? 
      '<ul>' + challenges.split('\n')
        .map(challenge => challenge.trim())
        .filter(challenge => challenge.startsWith('-'))
        .map(challenge => `<li>${challenge.substring(1).trim()}</li>`)
        .join('') + '</ul>' 
      : `<p>${challenges}</p>`
    }
  </div>
` : ''}

  <div class="glossary-meta">
    <p><em>This glossary entry was created by ${author || 'INK Team'}.</em></p>
  </div>
</div>
    `.trim();

    // Prepare the post data for standard WordPress posts
    const postData = {
      title: term,
      content: postContent,
      status: 'draft',
      type: 'post',
      categories: [],
      tags: ['glossary', 'ink-glossary', 'business-terms'],
      meta: {
        _glossary_entry: true,
        _glossary_term: term,
        _glossary_category: category || '',
        _glossary_related_terms: relatedTerms || ''
      }
    };

    console.log('Post data prepared:', JSON.stringify(postData, null, 2));

    // Test WordPress connection first
    console.log('Testing WordPress connection...');
    const testResponse = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`
      }
    });

    console.log('Test response status:', testResponse.status);
    console.log('Test response ok:', testResponse.ok);

    if (!testResponse.ok) {
      const testErrorText = await testResponse.text();
      console.error('WordPress connection test failed:', testErrorText);
      throw new Error(`WordPress connection test failed: ${testResponse.status} - ${testErrorText}`);
    }

    console.log('WordPress connection test successful');

    // Create the post
    console.log('Creating post...');
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`
      },
      body: JSON.stringify(postData)
    });

    console.log('Create response status:', response.status);
    console.log('Create response ok:', response.ok);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('WordPress API Error Response:', errorData);
      throw new Error(`WordPress API error: ${response.status} - ${errorData}`);
    }

    const createdPost = await response.json();
    console.log('Post created successfully:', createdPost.id);

    res.status(200).json({
      success: true,
      message: 'Glossary entry created successfully as draft',
      post: {
        id: createdPost.id,
        title: createdPost.title.rendered,
        link: createdPost.link,
        status: createdPost.status,
        type: 'post'
      }
    });

  } catch (error) {
    console.error('Error creating glossary entry:', error);
    res.status(500).json({ 
      error: 'Failed to create glossary entry',
      details: error.message,
      debug: {
        wpUrl: wpUrl,
        hasCredentials: !!(wpUrl && wpUsername && wpPassword),
        timestamp: new Date().toISOString()
      }
    });
  }
}

