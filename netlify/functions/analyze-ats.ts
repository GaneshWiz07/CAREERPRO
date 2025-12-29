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
    const { resume, jobDescription } = JSON.parse(event.body || '{}');
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }
    console.log('GROQ_API_KEY loaded:', GROQ_API_KEY.substring(0, 4) + '...');

    const resumeText = `
CONTACT:
Name: ${resume.contact?.fullName || 'Not provided'}
Email: ${resume.contact?.email || 'Not provided'}
Phone: ${resume.contact?.phone || 'Not provided'}
Location: ${resume.contact?.location || 'Not provided'}
LinkedIn: ${resume.contact?.linkedin || 'Not provided'}

SUMMARY:
${resume.summary || 'No summary provided'}

WORK EXPERIENCE:
${resume.experiences?.map((e: any) =>
      `${e.title} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate})
  Location: ${e.location || 'Not specified'}
  Achievements:
  ${e.bullets?.map((b: string) => `  • ${b}`).join('\n') || '  No bullets'}`
    ).join('\n\n') || 'No experience listed'}

EDUCATION:
${resume.education?.map((e: any) =>
      `${e.degree} in ${e.field} from ${e.institution} (${e.graduationDate})${e.gpa ? ` - GPA: ${e.gpa}` : ''}`
    ).join('\n') || 'No education listed'}

SKILLS:
${resume.skills?.map((s: any) => s.name).join(', ') || 'No skills listed'}

CERTIFICATIONS:
${resume.certifications?.map((c: any) =>
      `${c.name} - ${c.issuer} (${c.date})`
    ).join('\n') || 'No certifications listed'}
`;

    const systemPrompt = `You are an expert ATS (Applicant Tracking System) analyzer with deep knowledge of how systems like Workday, Greenhouse, Lever, and Taleo parse and score resumes.

Your task is to analyze a resume against a job description and provide:
1. A precise ATS score (0-100) based on keyword matching, formatting, and content alignment
2. Detailed breakdown of matched and missing keywords
3. Section-by-section analysis with specific issues
4. Optimized content that would score higher

SCORING CRITERIA:
- Keyword Match (40%): Exact and semantic matches between resume and JD
- Skills Alignment (25%): Technical and soft skills coverage
- Experience Relevance (20%): Job titles, responsibilities, industry match
- Format & Structure (10%): Standard headers, clean formatting
- Quantified Achievements (5%): Metrics, numbers, percentages

Return a JSON response with this EXACT structure:
{
  "score": <number 0-100>,
  "breakdown": {
    "keywordMatch": <number 0-40>,
    "skillsAlignment": <number 0-25>,
    "experienceRelevance": <number 0-20>,
    "formatStructure": <number 0-10>,
    "quantifiedAchievements": <number 0-5>
  },
  "matchedKeywords": [<array of keywords found in both>],
  "missingKeywords": [<array of critical JD keywords missing from resume>],
  "issues": [
    {
      "type": "error|warning|info",
      "section": "<section name>",
      "message": "<specific issue>",
      "suggestion": "<how to fix>"
    }
  ],
  "optimizedContent": {
    "summary": "<rewritten ATS-optimized professional summary>",
    "experienceBullets": [
      {
        "original": "<original bullet>",
        "optimized": "<ATS-optimized version with keywords and metrics>"
      }
    ],
    "additionalSkills": [<skills to add from JD>]
  },
  "recommendations": [<array of 3-5 specific actionable improvements>]
}

Be extremely precise and thorough. Focus on actionable improvements.
Only return valid JSON, no other text.`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          {
            role: 'user',
            content: `Analyze this resume against the job description:

JOB DESCRIPTION:
${jobDescription}

RESUME:
${resumeText}

Provide comprehensive ATS analysis with optimized content.`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
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
        score: 50,
        breakdown: {
          keywordMatch: 20,
          skillsAlignment: 12,
          experienceRelevance: 10,
          formatStructure: 5,
          quantifiedAchievements: 3
        },
        matchedKeywords: [],
        missingKeywords: ['Unable to parse response'],
        issues: [{
          type: 'error',
          section: 'General',
          message: 'Analysis failed - please try again',
          suggestion: 'Ensure job description is properly formatted'
        }],
        optimizedContent: {
          summary: resume.summary || '',
          experienceBullets: [],
          additionalSkills: []
        },
        recommendations: ['Please retry the analysis']
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    console.error('Error in analyze-ats:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

export { handler };
