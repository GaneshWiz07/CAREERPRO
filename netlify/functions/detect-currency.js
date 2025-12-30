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
    const { location, availableCurrencies } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }

    if (!location || location.trim().length < 2) {
      return {
        statusCode: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({ currencyCode: null }),
      };
    }

    // Create a list of available currency codes for the prompt
    const currencyList = availableCurrencies
      .map(c => `${c.code} (${c.country})`)
      .join(', ');

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
            content: `You are a geography and currency expert. Your task is to identify the most appropriate currency for a given location.

Given a location (city, state, country, or region), determine which currency is used there.

Available currencies: ${currencyList}

Rules:
1. For cities/states, identify the country first, then the currency
2. For ambiguous locations, use the most common interpretation
3. For locations in the Eurozone, return EUR
4. For UK locations (England, Scotland, Wales, Northern Ireland), return GBP
5. For US locations (including territories), return USD
6. For Indian locations (cities like Bangalore, Mumbai, Delhi, Chennai, Hyderabad, Pune, etc.), return INR
7. For Chinese locations, return CNY
8. For Japanese locations, return JPY
9. Only return currency codes from the available list

Return ONLY a JSON object with this structure:
{
  "currencyCode": "<3-letter currency code>",
  "country": "<identified country>",
  "confidence": "<high|medium|low>"
}

If you cannot determine the location or currency, return:
{
  "currencyCode": null,
  "country": null,
  "confidence": "none"
}`
          },
          {
            role: 'user',
            content: `What currency is used in: ${location}`
          }
        ],
        temperature: 0.1,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to detect currency');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
        
        // Validate that the currency code is in our available list
        const validCurrency = availableCurrencies.find(c => c.code === result.currencyCode);
        if (!validCurrency) {
          result.currencyCode = null;
        }
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      result = { currencyCode: null, country: null, confidence: 'none' };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in detect-currency:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message, currencyCode: null }),
    };
  }
};

