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
    const { resumeText } = JSON.parse(event.body || '{}');
    
    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Resume text is required');
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    console.log('Parsing resume with Groq, text length:', resumeText.length);

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume parser. Your task is to extract structured information from resume text and return it as valid JSON.

IMPORTANT RULES:
1. Extract ALL information accurately from the resume
2. If a field is not found, use an empty string "" or empty array []
3. For dates, use the format found in the resume (e.g., "Jan 2024", "2024", "January 2024")
4. Separate different items properly - each job, education, skill, certification should be its own entry
5. For skills, group them by category (e.g., "Programming Languages", "Frameworks", "Tools", "Soft Skills")
6. If you find sections that don't fit standard categories (like "Projects", "Publications", "Awards", "Extracurricular Activities", "Languages", "Volunteer Work"), include them in the "customSections" array
7. Be thorough - don't miss any information

Return ONLY valid JSON in this exact format:
{
  "contact": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string (full URL if available)",
    "website": "string"
  },
  "summary": "string (professional summary/objective if present)",
  "experience": [
    {
      "company": "string",
      "title": "string (job title)",
      "location": "string",
      "startDate": "string",
      "endDate": "string (or 'Present' if current)",
      "current": boolean,
      "bullets": ["string (responsibility/achievement)"]
    }
  ],
  "education": [
    {
      "school": "string (institution name)",
      "degree": "string (e.g., 'Bachelor of Technology in Computer Science and Engineering' - include the full degree with field/major)",
      "location": "string",
      "batchStart": "string (the year the person STARTED this education, e.g., '2022' or 'Nov 2022'. Look for admission year, enrollment year, or calculate from graduation year minus typical degree duration: 4 years for B.Tech/B.E., 3 years for BSc/BA, 2 years for Masters)",
      "batchEnd": "string (the year the person COMPLETED or will complete this education, e.g., '2026' or 'April 2026'. This is the graduation year/expected graduation)",
      "gpa": "string",
      "honors": "string"
    }
  ],
  "skills": [
    {
      "category": "string (e.g., 'Programming Languages', 'Frameworks', 'Tools')",
      "items": ["string"]
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string (e.g., 'Coursera', 'LinkedIn Learning')",
      "date": "string",
      "credentialId": "string",
      "expirationDate": "string"
    }
  ],
  "customSections": [
    {
      "title": "string (section name like 'Projects', 'Extracurricular Activities', 'Languages')",
      "type": "custom",
      "items": [
        {
          "title": "string (project name or item title)",
          "technologies": "string (comma-separated list of technologies, tools, or frameworks used, e.g., 'React, Node.js, MongoDB')",
          "date": "string (date range when the project was done, e.g., 'Jan 2024 - Mar 2024' or 'Dec 2023')",
          "bullets": ["string (key points, features, or achievements)"]
        }
      ]
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Parse this resume and extract all information:\n\n${resumeText}`
          }
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from Groq API');
    }

    console.log('Groq response:', content.substring(0, 500));

    let parsedResume;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResume = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Content:', content);
      throw new Error('Failed to parse Groq response as JSON');
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(parsedResume),
    };
  } catch (error) {
    console.error('Error in parse-resume function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      statusCode: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: errorMessage }),
    };
  }
};

export { handler };
