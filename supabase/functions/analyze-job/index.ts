import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

// CORS headers to allow requests from your website
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Main function to handle requests
serve(async (req) => {
  // Handle preflight CORS requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the OpenAI API key from Supabase secrets
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OPENAI_API_KEY is not set in Supabase secrets.");
    }

    // Get the job description and CV text from the request body
    const { jobDescriptionText, cvText } = await req.json();
    if (!jobDescriptionText || !cvText) {
      return new Response(JSON.stringify({ error: "Missing job description or CV text." }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // The prompt for the AI model
    const prompt = `
      You are an expert career coach and resume analyst.
      Analyze the following CV text and job description.
      Provide a percentage match score, a brief summary explaining why the candidate is a good fit,
      and a list of the candidate's skills that directly match the job requirements.

      CV Text:
      ---
      ${cvText}
      ---

      Job Description:
      ---
      ${jobDescriptionText}
      ---

      Your response MUST be a valid JSON object with the following structure:
      {
        "matchPercentage": number,
        "summary": "string",
        "matchingSkills": ["skill1", "skill2", "skill3"]
      }
    `;

    // Call the OpenAI API
    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }, // Ensure the response is JSON
        temperature: 0.3,
      }),
    });

    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      throw new Error(`OpenAI API error: ${openAiResponse.status} ${errorBody}`);
    }

    const data = await openAiResponse.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    // Return the analysis to the client
    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});