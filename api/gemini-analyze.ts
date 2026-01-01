import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Ensure the API key is loaded from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    // Allow GET requests for the test endpoint
    if (req.method === 'GET' && req.query.test === 'true') {
      return res.status(200).json({ message: 'Serverless function is alive and responding with JSON!', test: true });
    }
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { cvText, jobDescription } = req.body;

  if (!cvText || !jobDescription) {
    return res.status(400).json({ error: 'Both cvText and jobDescription are required.' });
  }

  // Critical check: Ensure API key is present before proceeding
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set. Please set it in your environment variables.");
    return res.status(500).json({ error: 'Server configuration error: Gemini API key is missing. Please ensure GEMINI_API_KEY is set in your environment variables.' });
  }

  // --- TEMPORARY DEBUGGING STEP: Return dummy data here ---
  // If you see this response, it means your API key is likely set correctly,
  // and the issue is further down with the actual Gemini API call or its response.
  // REMOVE THIS BLOCK ONCE DEBUGGING IS COMPLETE.
  return res.status(200).json({
    matchPercentage: 85,
    summary: "This is a dummy analysis result. If you see this, your serverless function is working up to the API key check.",
    matchingKeywords: ["Dummy Keyword 1", "Dummy Keyword 2"],
    missingKeywords: ["Dummy Missing 1", "Dummy Missing 2"]
  });
  // --- END TEMPORARY DEBUGGING STEP ---


  // The code below will only run if the temporary debugging block above is removed.
  // const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  // try {
  //   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  //   const prompt = `You are an expert career advisor specializing in talent acquisition. Your task is to perform a comprehensive, semantic, and contextual analysis of the provided CV text against the given job description. Go beyond simple keyword matching; evaluate the depth of experience, transferable skills, and overall alignment with the role's requirements and responsibilities.

  //   Your goal is to determine:
  //   1.  A precise match percentage (0-100).
  //   2.  A concise summary of the alignment, highlighting key strengths and areas where the candidate's profile could be further emphasized or developed for this specific role.
  //   3.  Key skills, experiences, and qualifications from the job description that are strongly present or clearly implied in the CV.
  //   4.  Important skills, experiences, or qualifications from the job description that appear to be missing, underrepresented, or could benefit from more explicit mention in the CV.

  //   CV Text:
  //   """
  //   ${cvText}
  //   """

  //   Job Description:
  //   """
  //   ${jobDescription}
  //   """

  //   Provide the output in a JSON format with the following keys:
  //   - \`matchPercentage\`: (number, 0-100) A numerical score indicating the overall match based on semantic understanding.
  //   - \`summary\`: (string) A concise summary of the match, highlighting strengths, potential, and areas for improvement.
  //   - \`matchingKeywords\`: (array of strings) Key skills/experiences from the job description that are clearly present or strongly implied in the CV.
  //   - \`missingKeywords\`: (array of strings) Key skills/experiences from the job description that are missing or underrepresented in the CV.

  //   Example JSON output:
  //   {
  //     "matchPercentage": 75,
  //     "summary": "Your CV demonstrates a strong foundation in X and Y, aligning well with the role's technical demands. To further strengthen your application, consider elaborating on your experience with Z, as it's a key requirement.",
  //     "matchingKeywords": ["Agile Methodologies", "Test Automation", "Jira", "API Testing"],
  //     "missingKeywords": ["Cloud Deployment", "CI/CD Pipelines"]
  //   }
  //   `;

  //   const result = await model.generateContent(prompt);
  //   const response = await result.response;
  //   const text = response.text();

  //   console.log("Raw Gemini API response text:", text); // Log the raw response for debugging

  //   if (!text || text.trim() === '') {
  //     throw new Error("Gemini API returned an empty response. This could indicate an issue with the API call or the API key.");
  //   }

  //   let jsonString = text;
  //   // Attempt to extract JSON if it's wrapped in markdown code blocks
  //   const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
  //   if (jsonMatch && jsonMatch[1]) {
  //     jsonString = jsonMatch[1];
  //   } else {
  //     // Fallback to finding the first { and last } if not in markdown
  //     const jsonStartIndex = text.indexOf('{');
  //     const jsonEndIndex = text.lastIndexOf('}');
  //     if (jsonStartIndex !== -1 && jsonEndIndex !== -1 && jsonEndIndex > jsonStartIndex) {
  //       jsonString = text.substring(jsonStartIndex, jsonEndIndex + 1);
  //     } else {
  //       // If no valid JSON structure is found, throw an error
  //       throw new Error("No valid JSON structure (even partial) found in Gemini's response. Check raw response in logs.");
  //     }
  //   }

  //   if (!jsonString.trim()) {
  //     throw new Error("Extracted JSON string is empty or whitespace. Gemini might not have generated valid JSON.");
  //   }

  //   let analysis;
  //   try {
  //     analysis = JSON.parse(jsonString);
  //   } catch (parseError: any) {
  //     console.error("Failed to parse JSON from Gemini response:", parseError.message);
  //     throw new Error(`Failed to parse AI analysis: ${parseError.message}. Raw extracted string: ${jsonString}`);
  //   }

  //   res.status(200).json(analysis);

  // } catch (error: any) {
  //   console.error('Error during Gemini API call or processing:', error.message);
  //   // Provide more specific error messages based on the type of error
  //   if (error.message.includes("API key")) {
  //     res.status(500).json({ error: 'Gemini API key might be invalid or incorrectly configured.', details: error.message });
  //   } else if (error.message.includes("No valid JSON structure found")) {
  //     res.status(500).json({ error: 'AI response did not contain a valid JSON structure as expected. Check server logs for raw response.', details: error.message });
  //   } else if (error.message.includes("Failed to parse AI analysis")) {
  //     res.status(500).json({ error: 'AI response was malformed and could not be parsed. Check server logs for raw response.', details: error.message });
  //   } else if (error.message.includes("Gemini API returned an empty response")) {
  //     res.status(500).json({ error: 'Gemini API returned an empty response. This often means an issue with the API key, rate limits, or an internal Gemini error. Check server logs.', details: error.message });
  //   }
  //   else {
  //     res.status(500).json({ error: 'An unexpected error occurred during AI analysis.', details: error.message });
  //   }
  // }
}