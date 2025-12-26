import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResumeData {
  summary: string;
  experiences: Array<{ title: string; company: string; bullets: string[] }>;
  skills: Array<{ name: string; category: string }>;
  education: Array<{ degree: string; field: string; institution: string }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, jobTitle, company, resume } = await req.json();
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const resumeText = `
Summary: ${resume.summary || 'None'}
Skills: ${resume.skills?.map((s: { name: string }) => s.name).join(', ') || 'None'}
Experience: ${resume.experiences?.map((e: { title: string; company: string; bullets: string[] }) => 
  `${e.title} at ${e.company}: ${e.bullets.join('; ')}`).join(' | ') || 'None'}
Education: ${resume.education?.map((e: { degree: string; field: string; institution: string }) => 
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
    
    // Parse JSON response
    let result;
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Content:', content);
      // Fallback response
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

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in tailor-resume:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
