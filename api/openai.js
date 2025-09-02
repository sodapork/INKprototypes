export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const { prompt } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    res.status(500).json({ error: 'OpenAI API key not set in environment' });
    return;
  }

  console.log('OpenAI API Request:', {
    timestamp: new Date().toISOString(),
    prompt: prompt.substring(0, 200) + '...', // Log first 200 chars
    promptLength: prompt.length,
    userAgent: req.headers['user-agent'],
    origin: req.headers['origin'],
    referer: req.headers['referer']
  });

  try {
    // Try different models in order of preference
    const models = ['gpt-4o-mini', 'gpt-3.5-turbo', 'gpt-4'];
    let response;
    let lastError;
    
    for (const model of models) {
      try {
        console.log(`Trying model: ${model}`);
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: model,
            messages: [
              {
                role: 'user',
                content: prompt
              }
            ],
            max_tokens: 1000,
            temperature: 0.7
          })
        });
        
        // If we get here, the request was successful
        break;
      } catch (modelError) {
        console.log(`Model ${model} failed:`, modelError.message);
        lastError = modelError;
        continue;
      }
    }
    
    if (!response) {
      throw new Error(`All models failed. Last error: ${lastError?.message}`);
    }

    const data = await response.json();
    
    // Find which model was actually used
    const usedModel = data.model || 'unknown';
    
    console.log('OpenAI API Response:', {
      timestamp: new Date().toISOString(),
      model: usedModel,
      status: response.status,
      statusText: response.statusText,
      responseLength: data.choices?.[0]?.message?.content ? data.choices[0].message.content.length : 0,
      hasError: !!data.error,
      error: data.error,
      fullResponse: data
    });

    if (!response.ok || data.error) {
      console.error('OpenAI API Error Response:', data);
      res.status(response.status).json({ 
        error: 'OpenAI API error', 
        details: data.error || 'Unknown error',
        status: response.status 
      });
      return;
    }

    // Return the response in the expected format
    res.status(200).json(data);
    
  } catch (err) {
    console.error('OpenAI API Exception:', {
      timestamp: new Date().toISOString(),
      error: err.message,
      stack: err.stack
    });
    
    res.status(500).json({ 
      error: 'Error communicating with OpenAI', 
      details: err.message 
    });
  }
} 