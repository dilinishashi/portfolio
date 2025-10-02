import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      throw new Error("OPENAI_API_KEY is not set in Supabase secrets.");
    }

    const { jobDescriptionText, jobDescriptionImage, jobDescriptionUrl, cvText } = await req.json();
    if (!cvText) {
      return new Response(JSON.stringify({ error: "Missing CV text." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!jobDescriptionText && !jobDescriptionImage && !jobDescriptionUrl) {
      return new Response(JSON.stringify({ error: "Missing job description text, image, or URL." }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let model: string;
    let messages: any[];
    let finalJobDescription = jobDescriptionText;

    if (jobDescriptionUrl) {
      try {
        const response = await fetch(jobDescriptionUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        if (!doc) throw new Error("Failed to parse HTML from URL.");

        // Try to find the main content, otherwise fall back to the whole body
        const mainContent = doc.querySelector("main") || doc.querySelector("article") || doc.body;
        finalJobDescription = mainContent?.textContent?.replace(/\s\s+/g, ' ').trim() || '';
        
        if (!finalJobDescription) {
          throw new Error("Could not extract any text content from the URL.");
        }
      } catch (e) {
        throw new Error(`Failed to process URL. It might be a complex site or require a login. Error: ${e.message}`);
      }
    }

    const analysisPrompt = `
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
      {JOB_DESCRIPTION_PLACEHOLDER}
      ---

      Your response MUST be a valid JSON object with the following structure:
      {
        "matchPercentage": number,
        "summary": "string",
        "matchingSkills": ["skill1", "skill2", "skill3"]
      }
    `;

    if (finalJobDescription) {
      model = "gpt-3.5-turbo";
      const prompt = analysisPrompt.replace('{JOB_DESCRIPTION_PLACEHOLDER}', finalJobDescription);
      messages = [{ role: "user", content: prompt }];
    } else { // jobDescriptionImage
      model = "gpt-4o"; // Use the vision-capable model
      const promptForImage = analysisPrompt.replace('{JOB_DESCRIPTION_PLACEHOLDER}', '(The job description is in the provided image. Please extract the text from the image first and then perform the analysis.)');
      messages = [
        {
          role: "user",
          content: [
            { type: "text", text: promptForImage },
            {
              type: "image_url",
              image_url: { url: jobDescriptionImage },
            },
          ],
        },
      ];
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1000,
      }),
    });

    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      throw new Error(`OpenAI API error: ${openAiResponse.status} ${errorBody}`);
    }

    const data = await openAiResponse.json();
    const analysis = JSON.parse(data.choices[0].message.content);

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