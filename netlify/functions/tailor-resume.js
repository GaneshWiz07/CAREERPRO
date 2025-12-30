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
    const { jobDescription, jobTitle, company, resume } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }
    console.log('GROQ_API_KEY loaded:', GROQ_API_KEY.substring(0, 4) + '...');

    const resumeText = `
Summary: ${resume.summary || 'None'}
Skills: ${resume.skills?.map((s) => s.name).join(', ') || 'None'}
Experience: ${resume.experiences?.map((e) =>
      `${e.title} at ${e.company}: ${e.bullets.join('; ')}`).join(' | ') || 'None'}
Education: ${resume.education?.map((e) =>
        `${e.degree} in ${e.field} from ${e.institution}`).join(', ') || 'None'}
`;

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
            content: `You are an expert ATS resume analyzer and career coach. Analyze how well a resume matches a job description.

Return a JSON response with this exact structure:
{
  "matchScore": <number 0-100>,
  "matchedKeywords": [<array of keywords found in both resume and JD>],
  "missingKeywords": [<array of important JD keywords missing from resume>],
  "tailoredSummary": "<a rewritten professional summary optimized for this specific job>",
  "suggestions": [<array of 3-5 specific improvement suggestions>]
}

Be specific and actionable. Focus on ATS optimization and keyword matching.
Only return valid JSON, no other text.`
          },
          {
            role: 'user',
            content: `Job Title: ${jobTitle || 'Not specified'}
Company: ${company || 'Not specified'}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}`
          }
        ],
        temperature: 0.5,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to analyze resume');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    let result;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      result = {
        matchScore: 60,
        matchedKeywords: ['experience', 'skills'],
        missingKeywords: ['specific requirements'],
        tailoredSummary: resume.summary || 'Please add a professional summary.',
        suggestions: [
          'Add more specific keywords from the job description',
          'Quantify your achievements with metrics',
          'Tailor your experience bullets to match job requirements'
        ]
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in tailor-resume:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

