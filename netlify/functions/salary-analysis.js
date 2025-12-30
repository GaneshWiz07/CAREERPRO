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
    const { jobTitle, location, yearsExperience, skills, currency, currencyName, country } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }
    console.log('GROQ_API_KEY loaded:', GROQ_API_KEY.substring(0, 4) + '...');

    // Use provided currency or default to USD
    const targetCurrency = currency || 'USD';
    const targetCurrencyName = currencyName || 'US Dollar';
    const targetCountry = country || 'United States';
    const targetLocation = location || targetCountry;

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
            content: `You are a salary negotiation expert with deep knowledge of global tech industry compensation across different countries and currencies.

IMPORTANT: You must provide salary estimates in ${targetCurrencyName} (${targetCurrency}) for the specified location.

Provide realistic salary estimates based on:
1. The job title and its typical compensation in the target market
2. The location's cost of living and local job market
3. The candidate's experience level
4. Their skills and how they match market demand

Return a JSON object with this exact structure:
{
  "lowRange": <number - entry level/junior salary in ${targetCurrency}>,
  "midRange": <number - typical salary for the experience level in ${targetCurrency}>,
  "highRange": <number - senior/top performer salary in ${targetCurrency}>,
  "currency": "${targetCurrency}",
  "factors": [<array of 4-6 factors affecting salary in this market>],
  "negotiationTips": [<array of 4-5 specific negotiation tips relevant to the local market>],
  "marketInsights": "<1-2 sentence market insight about the job market in this region>"
}

CRITICAL INSTRUCTIONS:
- All salary values MUST be in ${targetCurrency} (${targetCurrencyName})
- Use realistic 2024-2025 market data for ${targetLocation}
- Consider local cost of living, tax implications, and market conditions
- For currencies like INR, JPY, KRW - use appropriate large numbers (e.g., INR salaries are typically in lakhs/crores)
- For currencies like EUR, GBP, USD - use standard annual salary figures
- Provide negotiation tips relevant to the local business culture

Only return valid JSON, no other text.`
          },
          {
            role: 'user',
            content: `Job Title: ${jobTitle}
Location: ${targetLocation}
Years of Experience: ${yearsExperience || 5}
Key Skills: ${skills?.join(', ') || 'Not specified'}
Target Currency: ${targetCurrency} (${targetCurrencyName})
Country/Region: ${targetCountry}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1200,
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
        // Ensure currency is set correctly
        result.currency = targetCurrency;
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Provide fallback values based on currency (rough estimates)
      const fallbackMultipliers = {
        'USD': 1,
        'EUR': 0.92,
        'GBP': 0.79,
        'INR': 83,
        'CAD': 1.36,
        'AUD': 1.53,
        'JPY': 149,
        'CNY': 7.24,
        'SGD': 1.34,
        'AED': 3.67,
        'CHF': 0.88,
        'SEK': 10.42,
        'NZD': 1.64,
        'ZAR': 18.5,
        'BRL': 4.97,
        'MXN': 17.15,
        'KRW': 1320,
        'PLN': 3.98,
        'PHP': 56.5,
        'IDR': 15800,
      };
      const multiplier = fallbackMultipliers[targetCurrency] || 1;
      result = {
        lowRange: Math.round(80000 * multiplier),
        midRange: Math.round(120000 * multiplier),
        highRange: Math.round(180000 * multiplier),
        currency: targetCurrency,
        factors: ['Experience level', 'Location', 'Company size', 'Industry', 'Skills demand'],
        negotiationTips: [
          'Research the company\'s salary range before negotiating',
          'Highlight your unique skills and achievements',
          'Consider total compensation including benefits',
          'Be prepared to justify your ask with market data',
          'Don\'t accept the first offer - there\'s usually room to negotiate'
        ],
        marketInsights: `The tech market in ${targetLocation} remains competitive with strong demand for experienced professionals.`
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

