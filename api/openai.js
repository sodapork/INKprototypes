export default async function handler(req, res) {
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
    promptLength: prompt.length
  });

  try {
    // Use the new OpenAI API format
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: prompt
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    console.log('OpenAI API Response:', {
      timestamp: new Date().toISOString(),
      status: response.status,
      statusText: response.statusText,
      responseLength: data.output_text ? data.output_text.length : 0,
      hasError: !!data.error,
      error: data.error
    });

    if (!response.ok) {
      console.error('OpenAI API Error Response:', data);
      res.status(response.status).json({ 
        error: 'OpenAI API error', 
        details: data.error || 'Unknown error',
        status: response.status 
      });
      return;
    }

    // Convert new format to old format for compatibility
    const convertedResponse = {
      choices: [{
        message: {
          content: data.output_text
        }
      }]
    };

    res.status(200).json(convertedResponse);
    
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