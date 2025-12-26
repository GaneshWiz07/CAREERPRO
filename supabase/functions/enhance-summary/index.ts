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
    const { summary, experiences, skills } = await req.json();
    const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY');
    
    if (!GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not configured');
    }

    const skillsList = skills?.map((s: { name: string }) => s.name).join(', ') || '';
    const rolesList = experiences?.map((e: { title: string }) => e.title).join(', ') || '';

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
            content: `You are an expert resume writer. Enhance the professional summary to be:
1. Compelling and results-focused
2. 2-3 sentences maximum
3. Include key skills and experience level
4. ATS-friendly with relevant keywords
Only return the enhanced summary, nothing else.`
          },
          {
            role: 'user',
            content: `Original summary: ${summary}\nRelevant skills: ${skillsList}\nRoles held: ${rolesList}`
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', errorText);
      throw new Error('Failed to enhance summary');
    }

    const data = await response.json();
    const enhancedSummary = data.choices[0]?.message?.content?.trim();

    return new Response(JSON.stringify({ enhancedSummary }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-summary:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
