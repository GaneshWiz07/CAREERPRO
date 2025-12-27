import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resumeText } = await req.json();
    
    if (!resumeText || typeof resumeText !== 'string') {
      throw new Error('Resume text is required');
    }

    const groqApiKey = Deno.env.get('GROQ_API_KEY');
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
        model: 'llama-3.1-70b-versatile',
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
      "degree": "string (e.g., 'Bachelor of Technology')",
      "field": "string (e.g., 'Computer Science and Engineering')",
      "location": "string",
      "graduationDate": "string",
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
          "title": "string",
          "subtitle": "string",
          "description": "string",
          "bullets": ["string"]
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

    // Parse the JSON response
    let parsedResume;
    try {
      // Try to extract JSON from the response (in case there's extra text)
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

    return new Response(JSON.stringify(parsedResume), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    console.error('Error in parse-resume function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
