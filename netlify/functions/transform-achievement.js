const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { bullet, role, company } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }
    console.log('GROQ_API_KEY loaded:', GROQ_API_KEY.substring(0, 4) + '...');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume writer specializing in transforming job duties into quantified achievements. 
Transform the given bullet point into a powerful achievement statement that:
1. Starts with a strong action verb
2. Includes specific metrics (%, $, time saved, volume)
3. Shows clear impact and results
4. Is concise (under 100 words)
Only return the transformed bullet point, nothing else.`
          },
          {
            role: 'user',
            content: `Role: ${role || 'Professional'}\nCompany: ${company || 'Company'}\nOriginal bullet: ${bullet}`
          }
        ],
        temperature: 0.7,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to transform achievement');
    }

    const data = await response.json();
    const transformedBullet = data.choices[0]?.message?.content?.trim();

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ transformedBullet }),
    };
  } catch (error) {
    console.error('Error in transform-achievement:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

