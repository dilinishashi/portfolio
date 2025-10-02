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
    console.log("Function invoked. Checking for OpenAI API key...");
    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      console.error("! IMPORTANT: OPENAI_API_KEY secret not found!");
      throw new Error("The OPENAI_API_KEY secret is not set in the Supabase project. Please add it in the Edge Function settings.");
    }
    console.log("OpenAI API key found successfully.");

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
      console.log(`Processing URL: ${jobDescriptionUrl}`);
      try {
        const response = await fetch(jobDescriptionUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch URL: ${response.statusText}`);
        }
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        if (!doc) throw new Error("Failed to parse HTML from URL.");

        const mainContent = doc.querySelector("main") || doc.querySelector("article") || doc.body;
        finalJobDescription = mainContent?.textContent?.replace(/\s\s+/g, ' ').trim() || '';
        
        if (!finalJobDescription) {
          throw new Error("Could not extract any text content from the URL.");
        }
        console.log("Successfully extracted content from URL.");
      } catch (e) {
        throw new Error(`Failed to process URL. It might be a complex site or require a login. Error: ${e.message}`);
      }
    }

    const analysisPrompt = `
      You are an expert hiring assistant. Your task is to compare a candidate's CV against a job description.
      **Candidate's CV:**
      ---
      ${cvText}
      ---
      **Job Description:**
      ---
      {JOB_DESCRIPTION_PLACEHOLDER}
      ---
      **Instructions:**
      1.  Carefully read both the CV and the Job Description.
      2.  Calculate a match percentage based on how well the candidate's skills and experience align with the job requirements.
      3.  Write a brief summary explaining the match score. Highlight key strengths and potential gaps.
      4.  List the specific skills from the CV that are also mentioned or required in the Job Description.
      **IMPORTANT:** Your analysis MUST be based on comparing the two documents. Do not just summarize the CV. If the Job Description is missing or empty, state that you cannot perform the analysis.
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
      model = "gpt-4o";
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

    console.log(`Making request to OpenAI with model: ${model}`);
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

    console.log(`OpenAI response status: ${openAiResponse.status}`);
    if (!openAiResponse.ok) {
      const errorBody = await openAiResponse.text();
      console.error("OpenAI API Error:", errorBody);
      throw new Error(`OpenAI API error (${openAiResponse.status}): ${errorBody}`);
    }
    console.log("Successfully received response from OpenAI.");

    const data = await openAiResponse.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("An error occurred in the function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});