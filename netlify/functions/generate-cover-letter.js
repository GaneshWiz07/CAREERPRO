const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Helper function to count words
function countWords(text) {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

// Helper function to get tone description
function getToneDescription(tone) {
  const descriptions = {
    professional: 'formal, business-appropriate language',
    enthusiastic: 'energetic, passionate, and excited tone',
    confident: 'assertive, self-assured, and bold',
    conversational: 'friendly, approachable, and personable'
  };
  return descriptions[tone] || descriptions.professional;
}

export const handler = async (event, context) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: corsHeaders, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { 
      jobTitle, 
      company, 
      hiringManager, 
      jobDescription, 
      tone, 
      length, 
      additionalInfo,
      resume 
    } = JSON.parse(event.body || '{}');
    
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is missing');
      throw new Error('Service configuration error. Please contact support.');
    }

    const candidateName = resume.contactInfo?.fullName || 'The Candidate';
    
    // Build resume context
    const resumeText = `
Name: ${candidateName}
Summary: ${resume.summary || 'Experienced professional'}
Skills: ${resume.skills?.map((s) => s.name).join(', ') || 'Various technical and soft skills'}
Experience: ${resume.experiences?.map((e) =>
  `${e.title} at ${e.company}: ${e.bullets.slice(0, 2).join('; ')}`
).join(' | ') || 'Professional experience in the field'}
Education: ${resume.education?.map((e) =>
  `${e.degree} in ${e.field} from ${e.institution}`
).join(', ') || 'Relevant educational background'}
`;

    // Length configurations with minimum word counts
    const lengthConfig = {
      short: {
        minWords: 200,
        maxWords: 280,
        targetWords: 250,
        paragraphGuide: `
- Opening paragraph (40-50 words): Greeting and express interest in the position
- Body paragraph 1 (80-100 words): Highlight 2-3 key qualifications and relevant experience with specific examples
- Body paragraph 2 (60-80 words): Explain why you're interested in the company and how you can contribute
- Closing paragraph (30-40 words): Thank them and express enthusiasm for an interview`
      },
      medium: {
        minWords: 320,
        maxWords: 420,
        targetWords: 380,
        paragraphGuide: `
- Opening paragraph (50-60 words): Greeting, express strong interest, mention how you learned about the position
- Body paragraph 1 (80-100 words): Highlight your most relevant experience with specific achievements and metrics
- Body paragraph 2 (80-100 words): Discuss additional skills and qualifications that match the job requirements
- Body paragraph 3 (60-80 words): Explain your interest in the company culture and how you align with their mission
- Closing paragraph (40-50 words): Summarize your value, thank them, and express enthusiasm for discussing further`
      },
      long: {
        minWords: 450,
        maxWords: 580,
        targetWords: 520,
        paragraphGuide: `
- Opening paragraph (60-70 words): Engaging greeting, express enthusiasm, mention the position and how you discovered it
- Body paragraph 1 (100-120 words): Detail your most impressive relevant experience with specific achievements, metrics, and impact
- Body paragraph 2 (100-120 words): Highlight additional technical skills, certifications, or expertise that match job requirements
- Body paragraph 3 (80-100 words): Discuss soft skills, leadership experience, or team collaboration examples
- Body paragraph 4 (60-80 words): Express genuine interest in the company's mission, values, or recent achievements
- Closing paragraph (50-60 words): Strong summary of your value proposition, thank them, and confidently request an interview`
      }
    };
    
    const config = lengthConfig[length] || lengthConfig.medium;

    const systemPrompt = `You are an expert cover letter writer. Your task is to write a cover letter with EXACTLY ${config.targetWords} words (minimum ${config.minWords}, maximum ${config.maxWords}).

WORD COUNT IS CRITICAL: The letter MUST have at least ${config.minWords} words. Count your words carefully.

Writing style: ${getToneDescription(tone)}

Structure your letter as follows:
${config.paragraphGuide}

Format the output as JSON:
{
  "coverLetter": "the complete cover letter with \\n\\n between paragraphs",
  "keyHighlights": ["highlight 1", "highlight 2", "highlight 3"]
}`;

    const userPrompt = `Write a ${config.targetWords}-word cover letter for:

POSITION: ${jobTitle} at ${company}
TO: ${hiringManager || 'Hiring Manager'}

CANDIDATE PROFILE:
${resumeText}

${jobDescription ? `JOB REQUIREMENTS:\n${jobDescription.substring(0, 1000)}\n` : ''}
${additionalInfo ? `ADDITIONAL NOTES: ${additionalInfo}\n` : ''}

IMPORTANT: Write EXACTLY ${config.targetWords} words (at least ${config.minWords} words minimum). Each paragraph must be substantial. Do not write a short letter.

Sign the letter with: ${candidateName}`;

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
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to generate cover letter');
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
      // Use the raw content if JSON parsing fails
      result = {
        coverLetter: content,
        keyHighlights: ['Professional experience', 'Relevant skills', 'Strong motivation']
      };
    }

    // Calculate actual word count
    const actualWordCount = countWords(result.coverLetter || '');
    
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverLetter: result.coverLetter,
        keyHighlights: result.keyHighlights || ['Professional experience', 'Relevant skills', 'Strong motivation'],
        tone: tone,
        wordCount: actualWordCount,
        targetLength: length
      }),
    };
  } catch (error) {
    console.error('Error in generate-cover-letter:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: message }),
    };
  }
};

