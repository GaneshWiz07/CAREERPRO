import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { jobTitle, location, yearsExperience, skills } = JSON.parse(event.body || '{}');
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
            content: `You are a salary negotiation expert with deep knowledge of tech industry compensation.

Provide salary estimates based on the job title, location, experience, and skills.

Return a JSON object with this exact structure:
{
  "lowRange": <number - entry level salary>,
  "midRange": <number - typical salary for experience level>,
  "highRange": <number - senior/top performer salary>,
  "currency": "USD",
  "factors": [<array of 4-6 factors affecting salary>],
  "negotiationTips": [<array of 4-5 specific negotiation tips>],
  "marketInsights": "<1-2 sentence market insight>"
}

Be realistic with current 2024-2025 market data. Consider remote vs in-office, company size, and industry.
Only return valid JSON, no other text.`
          },
          {
            role: 'user',
            content: `Job Title: ${jobTitle}
Location: ${location || 'United States'}
Years of Experience: ${yearsExperience || 5}
Key Skills: ${skills?.join(', ') || 'Not specified'}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to analyze salary');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      result = {
        lowRange: 80000,
        midRange: 120000,
        highRange: 180000,
        currency: 'USD',
        factors: ['Experience level', 'Location', 'Company size', 'Industry', 'Skills demand'],
        negotiationTips: [
          'Research the company\'s salary range before negotiating',
          'Highlight your unique skills and achievements',
          'Consider total compensation including benefits',
          'Be prepared to justify your ask with market data',
          'Don\'t accept the first offer - there\'s usually room to negotiate'
        ],
        marketInsights: 'The tech market remains competitive with strong demand for experienced professionals.'
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in salary-analysis:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
