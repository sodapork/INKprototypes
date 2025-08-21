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

  if (!wpUrl || !wpUsername || !wpPassword) {
    res.status(500).json({ error: 'WordPress credentials not configured' });
    return;
  }

  try {
    // Create the post content with proper INK formatting
    const postContent = `
<p>${definition}</p>

${relatedTerms ? `
<h3>Synonyms:</h3>

<p>${relatedTerms}</p>
` : ''}

${whyMatters ? `
<h3>Why does ${term.toLowerCase()} matter?</h3>

<p>${whyMatters}</p>
` : ''}

${inkRole ? `
<h3>INK's role</h3>

<p>${inkRole}</p>
` : ''}

${challenges ? `
<h3>Challenges</h3>

${challenges.includes('-') ? challenges.split('\n').map(challenge => challenge.trim()).filter(challenge => challenge.startsWith('-')).map(challenge => `<p>${challenge.substring(1).trim()}</p>`).join('\n') : `<p>${challenges}</p>`}
` : ''}

<p><em>This glossary entry was created by ${author || 'INK Team'}.</em></p>
    `.trim();

    // Prepare the post data
    const postData = {
      title: term,
      content: postContent,
      status: 'draft',
      type: 'glossary', // Use the custom post type 'glossary'
      categories: [], // You can add category IDs here if needed
      tags: ['glossary', 'ink-glossary'],
      meta: {
        _glossary_entry: true,
        _glossary_term: term,
        _glossary_category: category || '',
        _glossary_related_terms: relatedTerms || ''
      }
    };

    // Create the post via WordPress REST API using the glossary endpoint
    const response = await fetch(`${wpUrl}/wp-json/wp/v2/glossary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${wpUsername}:${wpPassword}`).toString('base64')}`
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`WordPress API error: ${response.status} - ${errorData}`);
    }

    const createdPost = await response.json();

    res.status(200).json({
      success: true,
      message: 'Glossary entry created successfully as draft in the Glossary section',
      post: {
        id: createdPost.id,
        title: createdPost.title.rendered,
        link: createdPost.link,
        status: createdPost.status,
        type: 'glossary'
      }
    });

  } catch (error) {
    console.error('Error creating glossary entry:', error);
    res.status(500).json({ 
      error: 'Failed to create glossary entry',
      details: error.message 
    });
  }
}
