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
    const { jobTitle, jobDescription, resume } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }
    console.log('GROQ_API_KEY loaded:', GROQ_API_KEY.substring(0, 4) + '...');

    const resumeContext = `
Skills: ${resume.skills?.map((s) => s.name).join(', ') || 'Not specified'}
Recent roles: ${resume.experiences?.slice(0, 2).map((e) => e.title).join(', ') || 'Not specified'}
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
            content: `You are an expert interview coach. Generate 8-10 likely interview questions for the given job.

Return a JSON array with this structure:
[
  {
    "question": "the interview question",
    "type": "behavioral" | "technical" | "situational",
    "tip": "brief tip on how to answer"
  }
]

Include a mix of:
- Behavioral questions (using STAR method)
- Technical questions relevant to the role
- Situational questions about handling scenarios

Only return valid JSON array, no other text.`
          },
          {
            role: 'user',
            content: `Job Title: ${jobTitle}
${jobDescription ? `Job Description: ${jobDescription}` : ''}

Candidate Background:
${resumeContext}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to generate questions');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content?.trim();

    let questions;
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      questions = [
        { question: "Tell me about yourself and your experience.", type: "behavioral", tip: "Focus on relevant experience and key achievements" },
        { question: "Why are you interested in this role?", type: "behavioral", tip: "Connect your skills and goals to the position" },
        { question: "Describe a challenging project you've worked on.", type: "situational", tip: "Use STAR method: Situation, Task, Action, Result" },
        { question: "What are your greatest strengths?", type: "behavioral", tip: "Give specific examples that relate to the job" },
        { question: "Where do you see yourself in 5 years?", type: "behavioral", tip: "Show ambition while aligning with company growth" },
      ];
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions }),
    };
  } catch (error) {
    console.error('Error in generate-interview-questions:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

